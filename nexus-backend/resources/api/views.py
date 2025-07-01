import logging
import os
from datetime import datetime

from rest_framework import viewsets, status, filters, serializers
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F
from django.http import FileResponse, Http404, JsonResponse, HttpResponseRedirect
from django.utils import timezone
from django.conf import settings

# Set up logging
logger = logging.getLogger(__name__)

from ..models import Resource, Category, ResourceType, Organization
from .. import serializers as resource_serializers


class ResourceViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing resources.
    """
    queryset = Resource.objects.all()
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'category': ['exact', 'in'],
        'resource_type': ['exact', 'in'],
        'organization': ['exact', 'in'],
        'is_premium': ['exact'],
    }
    search_fields = ['title', 'author', 'description']
    ordering_fields = ['title', 'created_at', 'download_count', 'view_count']
    ordering = ['-created_at']
    
    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        """
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """
        Download the resource file.
        """
        try:
            resource = self.get_object()
            
            # Check if the resource has a file
            if not resource.file:
                return Response(
                    {'detail': 'No file available for this resource.'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Check if the file exists
            if not os.path.exists(resource.file.path):
                return Response(
                    {'detail': 'The requested file does not exist on the server.'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Increment download count
            resource.download_count = F('download_count') + 1
            resource.save(update_fields=['download_count'])
            
            # Get the file name from the path
            file_name = os.path.basename(resource.file.path)
            
            # Open the file and create a response
            response = FileResponse(open(resource.file.path, 'rb'))
            response['Content-Disposition'] = f'attachment; filename="{file_name}"'
            response['Content-Type'] = 'application/pdf'
            
            return response
            
        except Resource.DoesNotExist:
            return Response(
                {'detail': 'Resource not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f'Error downloading resource {pk}: {str(e)}')
            return Response(
                {'detail': 'An error occurred while processing your request.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a resource instance and increment its view count.
        """
        try:
            instance = self.get_object()
            # Increment view count
            instance.view_count = F('view_count') + 1
            instance.save(update_fields=['view_count'])
            
            # Get the serialized data
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
            
        except Resource.DoesNotExist:
            return Response(
                {'detail': 'Resource not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f'Error retrieving resource: {str(e)}')
            return Response(
                {'detail': 'An error occurred while processing your request.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get_serializer_class(self):
        if self.action == 'list':
            return resource_serializers.ResourceListSerializer
        elif self.action == 'retrieve':
            return resource_serializers.ResourceDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return resource_serializers.ResourceCreateUpdateSerializer
        return resource_serializers.ResourceListSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['list', 'retrieve', 'download']:
            permission_classes = [AllowAny]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Optionally restricts the returned resources based on query parameters.
        """
        queryset = super().get_queryset()
        
        # Filter out inactive resources for non-staff users
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        
        # Filter by search query if provided
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(author__icontains=search_query) |
                Q(description__icontains=search_query)
            )
        
        return queryset

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a resource and increment its view count.
        """
        instance = self.get_object()
        
        # Increment view count
        instance.view_count += 1
        instance.save(update_fields=['view_count', 'updated_at'])
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """
        Download the resource file and increment the download count.
        Handles both file-based and URL-based resources.
        """
        resource = self.get_object()
        
        # Check if the resource is premium and user is authenticated
        if resource.is_premium and not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required for premium resources.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # If resource has a direct download URL, redirect to it
        if resource.download_url:
            # Increment download count before redirecting
            resource.download_count += 1
            resource.save(update_fields=['download_count', 'updated_at'])
            return Response({
                'redirect': resource.download_url,
                'resource_id': resource.id,
                'filename': os.path.basename(resource.download_url)
            })
        
        # Handle file-based resource
        if not resource.file:
            return Response(
                {'detail': 'No downloadable file available for this resource.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Increment download count
        resource.download_count += 1
        resource.save(update_fields=['download_count', 'updated_at'])
        
        # Get the file path and filename
        try:
            file_path = resource.file.path
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found at {file_path}")
                
            filename = os.path.basename(file_path)
            
            # Use FileResponse for efficient file streaming
            response = FileResponse(
                open(file_path, 'rb'),
                as_attachment=True,
                filename=filename
            )
            
            # Set appropriate content type and headers
            response['Content-Type'] = 'application/octet-stream'
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            response['Content-Length'] = resource.file.size
            
            return response
            
        except FileNotFoundError as e:
            logger.error(f"File not found for resource {resource.id}: {str(e)}")
            return Response(
                {'detail': 'The requested file could not be found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error serving file for resource {resource.id}: {str(e)}")
            return Response(
                {'detail': 'An error occurred while processing your request.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
@permission_classes([AllowAny])
def test_connection(request):
    """
    Test endpoint to verify CORS and basic API functionality.
    """
    return Response({
        'status': 'success',
        'message': 'Backend is running and CORS is configured correctly!',
        'user': str(request.user) if request.user.is_authenticated else 'Anonymous',
        'timestamp': timezone.now().isoformat(),
    })


class ResourceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for managing resource categories.
    """
    queryset = Category.objects.all()
    serializer_class = resource_serializers.CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """
        Optionally filter by organization if provided in query params.
        """
        queryset = super().get_queryset()
        organization = self.request.query_params.get('organization')
        if organization:
            queryset = queryset.filter(organization=organization)
        return queryset
