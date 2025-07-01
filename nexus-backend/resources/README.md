# Resources App

This Django app manages educational resources (primarily PDFs) for the NEXUS platform, including upload, storage, metadata extraction, and retrieval functionality.

## Features

- **File Management**: Upload, store, and serve PDF resources
- **Metadata Extraction**: Automatically extracts metadata from PDFs including:
  - Page count
  - File size
  - Creation/modification dates
  - Author information
  - Keywords and tags
- **Search & Filter**: Search resources by title, description, or metadata
- **User Permissions**: Role-based access control for resource management
- **Statistics**: Track views and downloads for each resource

## Models

### Resource
- `title`: Resource title
- `description`: Detailed description
- `file`: FileField for PDF uploads
- `file_size`: Size in bytes (auto-calculated)
- `page_count`: Number of pages (extracted from PDF)
- `author`: Original author
- `organization`: Associated organization
- `resource_type`: Type of resource (e.g., Book, Article, Notes)
- `category`: Categorization
- `is_premium`: Premium content flag
- `view_count`: Number of views
- `download_count`: Number of downloads
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## API Endpoints

- `GET /api/resources/`: List all resources
- `POST /api/resources/`: Upload new resource
- `GET /api/resources/{id}/`: Get resource details
- `GET /api/resources/{id}/download/`: Download resource file
- `PATCH /api/resources/{id}/`: Update resource metadata
- `DELETE /api/resources/{id}/`: Delete resource

## Management Commands

### `update_pdfs`
Updates metadata for existing PDFs in the database.

```bash
python manage.py update_pdfs
```

### `load_test_data`
Loads test PDFs with metadata into the database.

```bash
python manage.py load_test_data
```

## Frontend Integration

The frontend interacts with the resources API to:
- Display a paginated list of resources
- Show detailed resource views with metadata
- Handle file downloads with progress tracking
- Support search and filtering
- Display resource statistics

## Dependencies

- Django
- Django REST Framework
- PyPDF2 (for PDF metadata extraction)
- Pillow (for image processing if thumbnails are implemented)

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run migrations:
   ```bash
   python manage.py migrate
   ```

3. Create a superuser (if needed):
   ```bash
   python manage.py createsuperuser
   ```

4. Run the development server:
   ```bash
   python manage.py runserver
   ```

## Environment Variables

- `MEDIA_ROOT`: Directory to store uploaded files
- `MAX_UPLOAD_SIZE`: Maximum file size in bytes (default: 50MB)
- `ALLOWED_EXTENSIONS`: List of allowed file extensions (default: ['pdf'])
