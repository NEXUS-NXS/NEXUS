from django.db import models
from django.conf import settings
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from django.core.validators import FileExtensionValidator
import uuid

# Import Course model from learnhub app
from learnhub.models import Course as LearnHubCourse

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
    course = models.OneToOneField(
        LearnHubCourse,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='certificate_template',
        help_text='Link to a course in LearnHub (optional)'
    )
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
    course = models.ForeignKey(
        LearnHubCourse,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='certificates_issued',
        help_text='The course this certificate is for'
    )
    certificate_file = models.FileField(
        upload_to='user_certificates/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf'])]
    )
    issue_date = models.DateField(default=timezone.now)
    expiry_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    verification_code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    class Meta:
        unique_together = [
            ['user', 'certificate'],
            ['user', 'course']
        ]
        ordering = ['-issue_date']
    
    def __str__(self):
        return f"{self.user.username} - {self.certificate.title}"
    
    def save(self, *args, **kwargs):
        # If this is a course certificate, ensure the course is set on the certificate
        if self.certificate.certificate_type == 'course' and not self.course and self.certificate.course:
            self.course = self.certificate.course
        
        # Update status based on dates
        if self.expiry_date and timezone.now().date() > self.expiry_date:
            self.status = 'expired'
        elif self.status == 'in_progress' and self.certificate_file:
            self.status = 'completed'
        
        super().save(*args, **kwargs)

# Signal to check if a course is completed and issue a certificate
@receiver(post_save, sender='learnhub.UserLessonProgress')
def check_course_completion(sender, instance, **kwargs):
    from learnhub.models import Lesson, Module, CourseEnrollment
    
    # Only process if the lesson is marked as completed
    if not instance.is_completed:
        return
    
    user = instance.user
    lesson = instance.lesson
    course = lesson.module.course
    
    # Check if user is enrolled in the course
    try:
        enrollment = CourseEnrollment.objects.get(user=user, course=course)
    except CourseEnrollment.DoesNotExist:
        return
    
    # Get all lessons in the course
    all_lessons = Lesson.objects.filter(module__course=course)
    total_lessons = all_lessons.count()
    
    # Get all completed lessons for this user in this course
    completed_lessons = sender.objects.filter(
        user=user,
        lesson__in=all_lessons,
        is_completed=True
    ).values_list('lesson', flat=True).distinct().count()
    
    # If all lessons are completed, issue a certificate
    if total_lessons > 0 and completed_lessons >= total_lessons:
        try:
            # Find a certificate template for this course
            certificate_template = Certificate.objects.get(
                course=course,
                certificate_type='course'
            )
            
            # Create or update the user's certificate
            UserCertificate.objects.update_or_create(
                user=user,
                course=course,
                certificate=certificate_template,
                defaults={
                    'status': 'completed',
                    'issue_date': timezone.now().date(),
                    'expiry_date': timezone.now().date() + timezone.timedelta(days=365)  # 1 year validity
                }
            )
            
        except Certificate.DoesNotExist:
            # No certificate template exists for this course
            pass
