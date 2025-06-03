from django.db import models
from django.conf import settings
from django.utils import timezone
import os

def resource_file_path(instance, filename):
    """Generate file path for resource files"""
    ext = filename.split('.')[-1]
    filename = f"{timezone.now().strftime('%Y%m%d_%H%M%S')}.{ext}"
    return os.path.join('resources/files/', filename)

def resource_cover_path(instance, filename):
    """Generate file path for resource cover images"""
    ext = filename.split('.')[-1]
    filename = f"cover_{timezone.now().strftime('%Y%m%d_%H%M%S')}.{ext}"
    return os.path.join('resources/covers/', filename)

class Organization(models.Model):
    id = models.CharField(max_length=50, primary_key=True, help_text="Unique identifier for the organization (e.g., 'soa', 'ifoa', 'cas')")
    name = models.CharField(max_length=100, unique=True, help_text="Full name of the organization")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Organization"
        verbose_name_plural = "Organizations"

class Category(models.Model):
    id = models.CharField(max_length=50, primary_key=True, help_text="Unique identifier for the category (e.g., 'books', 'papers', 'exams')")
    name = models.CharField(max_length=100, unique=True, help_text="Name of the category")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

class ResourceType(models.Model):
    id = models.CharField(max_length=50, primary_key=True, help_text="Unique identifier for the resource type (e.g., 'free', 'premium', 'books')")
    name = models.CharField(max_length=100, unique=True, help_text="Name of the resource type")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Resource Type"
        verbose_name_plural = "Resource Types"

class Resource(models.Model):
    # Basic information
    title = models.CharField(max_length=255, help_text="Title of the resource")
    author = models.CharField(max_length=255, help_text="Author(s) of the resource")
    description = models.TextField(help_text="Description of the resource")
    
    # Relationships
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, help_text="Category of the resource")
    resource_type = models.ForeignKey(ResourceType, on_delete=models.SET_NULL, null=True, help_text="Type of the resource")
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, help_text="Organization associated with the resource")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='resources_created')
    
    # File and media
    file = models.FileField(upload_to=resource_file_path, null=True, blank=True, help_text="Upload the resource file")
    download_url = models.URLField(max_length=500, blank=True, null=True, help_text="External URL for downloading the resource (if not uploaded)")
    cover_image = models.ImageField(upload_to=resource_cover_path, blank=True, null=True, help_text="Cover image for the resource")
    
    # Status and metrics
    is_premium = models.BooleanField(default=False, help_text="Indicates if the resource is premium")
    is_active = models.BooleanField(default=True, help_text="Indicates if the resource is active")
    view_count = models.PositiveIntegerField(default=0, help_text="Number of times the resource has been viewed")
    download_count = models.PositiveIntegerField(default=0, help_text="Number of times the resource has been downloaded")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, help_text="Timestamp when the resource was created")
    updated_at = models.DateTimeField(auto_now=True, help_text="Timestamp when the resource was last updated")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Resource"
        verbose_name_plural = "Resources"
        indexes = [
            models.Index(fields=['title', 'author']),
            models.Index(fields=['category']),
            models.Index(fields=['resource_type']),
            models.Index(fields=['organization']),
        ]