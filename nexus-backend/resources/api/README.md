# NEXUS Resources API

This document provides an overview of the NEXUS Resources API, which allows you to manage educational resources such as books, papers, and exam materials.

## Base URL

All API endpoints are prefixed with `/api/resources/`.

## Authentication

- **Read operations** (GET): No authentication required
- **Write operations** (POST, PUT, PATCH, DELETE): Require admin authentication
- **Premium resources**: Require authentication to download

## Endpoints

### Resources

- `GET /api/resources/` - List all resources
- `POST /api/resources/` - Create a new resource (admin only)
- `GET /api/resources/{id}/` - Retrieve a specific resource
- `PUT /api/resources/{id}/` - Update a resource (admin only)
- `PATCH /api/resources/{id}/` - Partially update a resource (admin only)
- `DELETE /api/resources/{id}/` - Delete a resource (admin only)
- `GET /api/resources/{id}/download/` - Download a resource file

### Categories

- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create a new category (admin only)
- `GET /api/categories/{id}/` - Retrieve a specific category
- `PUT /api/categories/{id}/` - Update a category (admin only)
- `PATCH /api/categories/{id}/` - Partially update a category (admin only)
- `DELETE /api/categories/{id}/` - Delete a category (admin only)

## Filtering and Searching

You can filter resources using the following query parameters:

- `category`: Filter by category (e.g., `?category=books`)
- `type`: Filter by type (e.g., `?type=free`)
- `organization`: Filter by organization (e.g., `?organization=soa`)
- `is_premium`: Filter by premium status (e.g., `?is_premium=true`)
- `search`: Search in title, author, or description (e.g., `?search=actuarial`)

## Ordering

You can order results using the `ordering` parameter:

- `?ordering=title` - Order by title (ascending)
- `?ordering=-created_at` - Order by creation date (newest first)
- `?ordering=download_count` - Order by download count

## Pagination

All list endpoints are paginated with 20 items per page. You can navigate through pages using the `page` parameter:

- `?page=2` - Get the second page of results

## Example Requests

### List all resources
```http
GET /api/resources/
```

### Filter resources by category and type
```http
GET /api/resources/?category=books&type=free
```

### Search for resources
```http
GET /api/resources/?search=actuarial
```

### Download a resource
```http
GET /api/resources/1/download/
```

## Response Format

All responses are in JSON format. Example resource object:

```json
{
    "id": 1,
    "title": "Actuarial Mathematics for Life Contingent Risks",
    "author": "David C. M. Dickson, Mary R. Hardy, Howard R. Waters",
    "description": "A comprehensive textbook covering the mathematical models for pricing and reserving in life insurance.",
    "category": "books",
    "type": "premium",
    "organization": "soa",
    "cover_image": "http://example.com/media/resources/covers/actuarial_math.jpg",
    "is_premium": true,
    "download_count": 42,
    "view_count": 100,
    "created_at": "2023-01-01T12:00:00Z",
    "updated_at": "2023-01-01T12:00:00Z"
}
```

## Error Handling

Errors are returned in the following format:

```json
{
    "detail": "Error message"
}
```

Common status codes:

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
