from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from resources.models import Category, ResourceType, Organization, Resource
from django.conf import settings
import os

class Command(BaseCommand):
    help = 'Load test data for resources app'

    def handle(self, *args, **options):
        self.stdout.write('Loading test data...')
        
        # Get or create a superuser
        User = get_user_model()
        user = User.objects.filter(is_superuser=True).first()
        
        if not user:
            self.stdout.write(self.style.ERROR('No superuser found. Please create one first.'))
            return

        # Create categories
        categories = [
            Category.objects.get_or_create(id='books', name='Books')[0],
            Category.objects.get_or_create(id='papers', name='Research Papers')[0],
            Category.objects.get_or_create(id='exams', name='Past Exams')[0],
            Category.objects.get_or_create(id='guides', name='Study Guides')[0],
        ]
        self.stdout.write(self.style.SUCCESS(f'Created {len(categories)} categories'))

        # Create resource types
        resource_types = [
            ResourceType.objects.get_or_create(id='free', name='Free')[0],
            ResourceType.objects.get_or_create(id='premium', name='Premium')[0],
            ResourceType.objects.get_or_create(id='book', name='Book')[0],
            ResourceType.objects.get_or_create(id='paper', name='Paper')[0],
            ResourceType.objects.get_or_create(id='exam', name='Exam')[0],
        ]
        self.stdout.write(self.style.SUCCESS(f'Created {len(resource_types)} resource types'))

        # Create organizations
        organizations = [
            Organization.objects.get_or_create(id='soa', name='Society of Actuaries (SOA)')[0],
            Organization.objects.get_or_create(id='ifoa', name='Institute and Faculty of Actuaries (IFoA)')[0],
            Organization.objects.get_or_create(id='cas', name='Casualty Actuarial Society (CAS)')[0],
            Organization.objects.get_or_create(id='other', name='Other')[0],
        ]
        self.stdout.write(self.style.SUCCESS(f'Created {len(organizations)} organizations'))

        # Create sample resources
        sample_resources = [
            {
                'title': 'Actuarial Mathematics for Life Contingent Risks',
                'author': 'Dickson, Hardy, and Waters',
                'description': 'Comprehensive textbook on life contingencies and actuarial mathematics.',
                'category': categories[0],  # Books
                'resource_type': resource_types[2],  # Book
                'organization': organizations[0],  # SOA
                'is_premium': False,
                'download_url': 'https://example.com/actuarial-math.pdf',
                'created_by': user
            },
            {
                'title': 'Financial Economics Study Notes',
                'author': 'Actuarial Association',
                'description': 'Detailed study notes for the Financial Economics exam.',
                'category': categories[2],  # Exams
                'resource_type': resource_types[0],  # Free
                'organization': organizations[1],  # IFoA
                'is_premium': False,
                'download_url': 'https://example.com/fin-econ-notes.pdf',
                'created_by': user
            },
            {
                'title': 'Advanced Longevity Risk Management',
                'author': 'Dr. John Smith',
                'description': 'Research paper on advanced techniques in longevity risk management.',
                'category': categories[1],  # Research Papers
                'resource_type': resource_types[1],  # Premium
                'organization': organizations[2],  # CAS
                'is_premium': True,
                'download_url': 'https://example.com/longevity-risk.pdf',
                'created_by': user
            },
            {
                'title': 'Exam P Practice Problems',
                'author': 'SOA',
                'description': 'Collection of practice problems for Exam P/1.',
                'category': categories[2],  # Exams
                'resource_type': resource_types[0],  # Free
                'organization': organizations[0],  # SOA
                'is_premium': False,
                'download_url': 'https://example.com/exam-p-practice.pdf',
                'created_by': user
            },
            {
                'title': 'Stochastic Calculus for Finance I',
                'author': 'Steven E. Shreve',
                'description': 'The binomial asset pricing model.',
                'category': categories[0],  # Books
                'resource_type': resource_types[2],  # Book
                'organization': organizations[3],  # Other
                'is_premium': True,
                'download_url': 'https://example.com/stochastic-calculus.pdf',
                'created_by': user
            },
        ]

        # Create resources
        created_count = 0
        for resource_data in sample_resources:
            _, created = Resource.objects.get_or_create(
                title=resource_data['title'],
                defaults=resource_data
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f'Created {created_count} sample resources'))
        self.stdout.write(self.style.SUCCESS('Test data loaded successfully!'))
