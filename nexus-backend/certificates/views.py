from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q, Prefetch
from django.utils import timezone
from datetime import timedelta

from .models import Certificate, UserCertificate
from .serializers import CertificateSerializer, UserCertificateSerializer, CourseSerializer
from learnhub.models import Course as LearnHubCourse

class CertificateViewSet(viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['certificate_type', 'issuer', 'course']
    search_fields = ['title', 'description', 'issuer', 'course__title']
    ordering_fields = ['title', 'created_at', 'updated_at']
    ordering = ['title']
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by course if course_id is provided
        course_id = self.request.query_params.get('course_id')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
            
        return queryset

class UserCertificateViewSet(viewsets.ModelViewSet):
    serializer_class = UserCertificateSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'certificate__certificate_type', 'course']
    search_fields = ['certificate__title', 'certificate__issuer', 'course__title']
    ordering_fields = ['issue_date', 'expiry_date', 'created_at']
    ordering = ['-issue_date']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only allow users to see their own certificates
        queryset = UserCertificate.objects.filter(user=self.request.user)
        
        # Prefetch related data for better performance
        queryset = queryset.select_related('certificate', 'course')
        
        # Filter by course if course_id is provided
        course_id = self.request.query_params.get('course_id')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
            
        return queryset
    
    def perform_create(self, serializer):
        # Automatically set the user to the current user
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def renew(self, request, pk=None):
        """Renew an expired certificate."""
        user_cert = self.get_object()
        
        if user_cert.status != 'expired':
            return Response(
                {'detail': 'Only expired certificates can be renewed.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new expiry date (1 year from now)
        user_cert.expiry_date = timezone.now().date() + timedelta(days=365)
        user_cert.status = 'completed'
        user_cert.save()
        
        serializer = self.get_serializer(user_cert)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get certificate statistics for the current user."""
        queryset = self.filter_queryset(self.get_queryset())
        
        stats = {
            'total': queryset.count(),
            'completed': queryset.filter(status='completed').count(),
            'expired': queryset.filter(status='expired').count(),
            'in_progress': queryset.filter(status='in_progress').count(),
            'by_type': queryset.values('certificate__certificate_type')
                           .annotate(count=Count('id'))
                           .order_by('-count'),
            'by_course': queryset.exclude(course__isnull=True)
                              .values('course__title', 'course_id')
                              .annotate(count=Count('id'))
                              .order_by('-count')
        }
        
        return Response(stats)
    
    @action(detail=False, methods=['get'])
    def course_certificates(self, request):
        """Get all certificates for courses the user is enrolled in."""
        from learnhub.models import CourseEnrollment
        
        # Get all courses the user is enrolled in
        enrolled_courses = CourseEnrollment.objects.filter(
            user=request.user
        ).values_list('course_id', flat=True)
        
        # Get all certificates for these courses
        queryset = self.filter_queryset(
            self.get_queryset().filter(course_id__in=enrolled_courses)
        )
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def available_courses_for_certificate(request):
    """Get all courses that don't have a certificate template yet."""
    # Get all courses that already have a certificate template
    courses_with_cert = Certificate.objects.filter(
        certificate_type='course'
    ).exclude(course__isnull=True).values_list('course_id', flat=True)
    
    # Get all courses that don't have a certificate template yet
    available_courses = LearnHubCourse.objects.exclude(
        id__in=courses_with_cert
    )
    
    serializer = CourseSerializer(available_courses, many=True)
    return Response(serializer.data)
