from django.contrib import admin
from django.utils.html import format_html
from .models import Resource, Category, ResourceType, Organization


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    """Admin configuration for Resource model."""
    list_display = (
        'title',
        'author',
        'category',
        'resource_type',
        'organization',
        'is_premium',
        'is_active',
        'download_count',
        'view_count',
        'created_at',
    )
    
    list_filter = (
        'is_active', 
        'is_premium',
        'category',
        'resource_type',
        'organization',
        'created_at',
    )
    
    search_fields = (
        'title', 
        'author', 
        'description',
        'download_url',
    )
    
    readonly_fields = (
        'created_at', 
        'updated_at',
        'download_count',
        'view_count',
        'preview_cover_image',
    )
    
    list_per_page = 20
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'title',
                'author',
                'description',
                'created_by',
            )
        }),
        ('Categorization', {
            'fields': (
                'category',
                'resource_type',
                'organization',
            )
        }),
        ('Files', {
            'fields': (
                'file',
                'download_url',
                'cover_image',
                'preview_cover_image',
            )
        }),
        ('Status', {
            'fields': (
                'is_premium',
                'is_active',
            )
        }),
        ('Statistics', {
            'classes': ('collapse',),
            'fields': (
                'download_count',
                'view_count',
            )
        }),
        ('Timestamps', {
            'classes': ('collapse',),
            'fields': (
                'created_at',
                'updated_at',
            )
        }),
    )
    
    def display_author(self, obj):
        """Display a shortened version of the author field."""
        return obj.author[:30] + '...' if len(obj.author) > 30 else obj.author
    display_author.short_description = 'Author'
    display_author.admin_order_field = 'author'
    
    def preview_cover_image(self, obj):
        """Display a preview of the cover image in the admin."""
        if obj.cover_image:
            return format_html(
                '<img src="{}" style="max-height: 200px; max-width: 200px;" />',
                obj.cover_image.url
            )
        return "No cover image"
    preview_cover_image.short_description = 'Cover Image Preview'
    
    def save_model(self, request, obj, form, change):
        """Set the created_by field to the current user when creating a new resource."""
        if not obj.pk:  # Only set created_by if this is a new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(Category, ResourceType, Organization)
class GenericAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
# Models are registered using the @admin.register decorator