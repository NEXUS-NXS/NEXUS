from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import FileExtensionValidator

class Certificate(models.Model):
    CERTIFICATE_TYPES = [
        ('course', 'Course Completion'),
        ('workshop', 'Workshop'),
        ('training', 'Training'),
        ('certification', 'Professional Certification'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    issuer = models.CharField(max_length=255)
    certificate_type = models.CharField(max_length=50, choices=CERTIFICATE_TYPES, default='course')
    template = models.FileField(
        upload_to='certificate_templates/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'jpeg', 'png'])]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.issuer}"
    
    class Meta:
        ordering = ['-created_at']


class UserCertificate(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('expired', 'Expired'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='certificates')
    certificate = models.ForeignKey(Certificate, on_delete=models.CASCADE, related_name='user_certificates')
    certificate_file = models.FileField(upload_to='user_certificates/', null=True, blank=True)
    issue_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s {self.certificate.title}"
    
    def save(self, *args, **kwargs):
        # Update status based on dates
        if self.expiry_date and self.expiry_date < timezone.now().date():
            self.status = 'expired'
        elif self.status == 'expired' and self.expiry_date and self.expiry_date >= timezone.now().date():
            self.status = 'completed'
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-issue_date']
        unique_together = ['user', 'certificate']
