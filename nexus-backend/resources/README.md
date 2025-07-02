## 📚 Resources Module
This Django app manages educational resources (primarily PDFs) for the NEXUS platform, including upload, storage, metadata extraction, and retrieval functionality. The Resources module provides comprehensive management of educational materials with the following features:

### Key Features
- **PDF Management**: Upload, store, and serve PDF resources
- **Metadata Extraction**: Automatic extraction of PDF metadata including:
  - Page count and file size
  - Creation/modification dates
  - Author information
  - Keywords and tags
- **Rich Preview**: Interactive resource cards with hover effects
- **Search & Filter**: Find resources by title, description, or metadata
- **Statistics**: Track views and downloads for each resource

### Frontend Components
- `ResourceList`: Displays a grid of available resources with search and filter options
- `ResourceDetails`: Shows detailed view of a resource with metadata and download options
- `ResourceUpload`: Form for uploading new resources with metadata
- `ResourceCard`: Reusable component for displaying resource previews

### Backend API
- **Endpoints**:
  - `GET /api/resources/`: List all resources (with pagination)
  - `POST /api/resources/`: Upload new resource
  - `GET /api/resources/{id}/`: Get resource details
  - `GET /api/resources/{id}/download/`: Download resource file
  - `PATCH /api/resources/{id}/`: Update resource metadata
  - `DELETE /api/resources/{id}/`: Delete resource


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


## Management Commands

### `update_pdfs`
Updates metadata for existing PDFs in the database.

```bash
poetry run python manage.py update_pdfs
```

### `load_test_data`
Loads test PDFs with metadata into the database.

```bash
poetry run python manage.py load_test_data
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
   poetry install
   ```

2. Run migrations:
   ```bash
   poetry run python manage.py makemigrations
   poetry run python manage.py migrate
   ```
4. Run the development server:(Using Uvicorn)
   ```bash
   poetry run uvicorn config.asgi:application   --host 0.0.0.0   --port 8000   --ssl-certfile certs/127.0.0.1.pem   --ssl-keyfile certs/127.0.0.1-key.pem
   ```

## Environment Variables

- `MEDIA_ROOT`: Directory to store uploaded files
- `MAX_UPLOAD_SIZE`: Maximum file size in bytes (default: 50MB)
- `ALLOWED_EXTENSIONS`: List of allowed file extensions (default: ['pdf'])
