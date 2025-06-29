from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from .models import Certificate, UserCertificate
from .serializers import CertificateSerializer, UserCertificateSerializer

class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['certificate_type', 'issuer']
    search_fields = ['title', 'description', 'issuer']
    ordering_fields = ['title', 'issuer', 'created_at']
    ordering = ['title']


class UserCertificateViewSet(viewsets.ModelViewSet):
    serializer_class = UserCertificateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'certificate__certificate_type']
    search_fields = ['certificate__title', 'certificate__issuer']
    ordering_fields = ['issue_date', 'expiry_date', 'status']
    ordering = ['-issue_date']

    def get_queryset(self):
        # Users can only see their own certificates
        return UserCertificate.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user to the current user
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def renew(self, request, pk=None):
        """Renew an expired certificate."""
        user_cert = self.get_object()
        
        if user_cert.status != 'expired':
            return Response(
                {'error': 'Only expired certificates can be renewed.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the issue date to now and clear the expiry date
        user_cert.issue_date = timezone.now().date()
        user_cert.expiry_date = None  # Or set a new expiry date based on your logic
        user_cert.status = 'in_progress'
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
            'in_progress': queryset.filter(status='in_progress').count(),
            'expired': queryset.filter(status='expired').count(),
        }
        
        return Response(stats)
