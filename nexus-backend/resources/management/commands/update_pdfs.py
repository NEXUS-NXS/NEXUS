from django.core.management.base import BaseCommand
from django.conf import settings
from resources.models import Resource, Category, ResourceType, Organization
from django.contrib.auth import get_user_model
from django.core.files import File
from django.utils import timezone
import os
import re
from datetime import datetime
import PyPDF2
import logging

# Set up logging
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Update resources with PDF files from the test_pdfs directory'

    def extract_metadata(self, pdf_path):
        """Extract metadata from a PDF file."""
        metadata = {
            'title': None,
            'author': None,
            'subject': None,
            'keywords': None,
            'page_count': 0,
            'created': None,
            'modified': None
        }
        
        try:
            with open(pdf_path, 'rb') as f:
                pdf = PyPDF2.PdfReader(f)
                
                # Get document info
                info = pdf.metadata
                if info:
                    metadata.update({
                        'title': info.get('/Title'),
                        'author': info.get('/Author'),
                        'subject': info.get('/Subject'),
                        'keywords': info.get('/Keywords'),
                        'created': info.get('/CreationDate'),
                        'modified': info.get('/ModDate')
                    })
                
                # Get page count
                metadata['page_count'] = len(pdf.pages)
                
                # If no title in metadata, use filename (without extension)
                if not metadata['title']:
                    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
                    metadata['title'] = ' '.join(
                        word.capitalize() 
                        for word in re.split(r'[\s_\-]+', base_name)
                    )
                
                # Clean up metadata values
                for key, value in metadata.items():
                    if isinstance(value, str):
                        # Remove PDF metadata markers if present
                        value = value.strip()
                        if value.startswith('D:'):  # PDF date format
                            try:
                                date_str = value[2:16]  # Get YYYYMMDDHHMMSS
                                metadata[key] = datetime.strptime(date_str, '%Y%m%d%H%M%S')
                            except (ValueError, IndexError):
                                metadata[key] = None
                                
                return metadata
                
        except Exception as e:
            logger.error(f"Error extracting metadata from {pdf_path}: {str(e)}")
            # Return at least the filename as title
            base_name = os.path.splitext(os.path.basename(pdf_path))[0]
            return {
                'title': ' '.join(word.capitalize() for word in re.split(r'[\s_\-]+', base_name)),
                'author': 'Unknown',
                'subject': None,
                'keywords': None,
                'page_count': 0,
                'created': None,
                'modified': None
            }

    def get_or_create_defaults(self):
        """Get or create default category, resource type, and organization."""
        # Get or create default category
        category, _ = Category.objects.get_or_create(
            id='document', 
            defaults={'name': 'Document'}
        )
        
        # Get or create default resource type
        resource_type, _ = ResourceType.objects.get_or_create(
            id='document',
            defaults={'name': 'Document'}
        )
        
        # Get or create default organization
        organization, _ = Organization.objects.get_or_create(
            id='other',
            defaults={'name': 'Other'}
        )
        
        return category, resource_type, organization

    def handle(self, *args, **options):
        self.stdout.write('Updating resources with PDF files...')
        
        # Get the first available user or None
        User = get_user_model()
        user = User.objects.first()  # Get first user or None if no users exist
            
        # Define the test_pdfs directory path
        test_pdfs_dir = os.path.join(settings.BASE_DIR, 'test_pdfs')
        
        # Get all PDF files in the test_pdfs directory
        pdf_files = [f for f in os.listdir(test_pdfs_dir) if f.lower().endswith('.pdf')]
        
        if not pdf_files:
            self.stdout.write(self.style.WARNING('No PDF files found in the test_pdfs directory.'))
            return
            
        # Get or create default category, resource type, and organization
        category, resource_type, organization = self.get_or_create_defaults()
        
        # Process each PDF file
        for pdf_file in pdf_files:
            pdf_path = os.path.join(test_pdfs_dir, pdf_file)
            
            try:
                # Extract metadata from PDF
                metadata = self.extract_metadata(pdf_path)
                
                # Prepare resource data
                title = metadata['title']
                author = metadata['author'] or 'Unknown'
                
                # Create description from available metadata
                description_parts = [f"PDF document: {title}"]
                if metadata['subject']:
                    description_parts.append(f"Subject: {metadata['subject']}")
                if metadata['page_count']:
                    description_parts.append(f"Pages: {metadata['page_count']}")
                if metadata['keywords']:
                    description_parts.append(f"Keywords: {metadata['keywords']}")
                
                description = '\n'.join(description_parts)
                
                # Check if a resource with this title already exists
                resource, created = Resource.objects.update_or_create(
                    title=title,
                    defaults={
                        'author': author,
                        'description': description,
                        'category': category,
                        'resource_type': resource_type,
                        'organization': organization,
                        'is_premium': False,
                        'created_by': user  # Will be None if no users exist
                    }
                )
                
                # Update the PDF file
                with open(pdf_path, 'rb') as f:
                    resource.file.save(
                        pdf_file,
                        File(f),
                        save=True
                    )
                
                if created:
                    self.stdout.write(self.style.SUCCESS(f'✅ Created new resource: {title}'))
                    self.stdout.write(f'   Author: {author}')
                    if metadata['page_count']:
                        self.stdout.write(f'   Pages: {metadata["page_count"]}')
                else:
                    self.stdout.write(self.style.SUCCESS(f'🔄 Updated existing resource: {title}'))
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'❌ Error processing {pdf_file}: {str(e)}'))
                continue
        
        self.stdout.write(self.style.SUCCESS('\n✅ Successfully processed all PDF files in the test_pdfs directory!'))
