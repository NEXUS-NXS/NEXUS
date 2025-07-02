from django.db import models

from django.db import models
from auth_service.models import CustomUser
from datetime import datetime


class StudentMentalHealthStatus(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    stress_level = models.IntegerField()  # Stress level (1-10)
    anxiety_level = models.IntegerField()  # Anxiety level (1-10)
    mood = models.CharField(max_length=50)  # Mood (e.g., "Happy", "Stressed", "Anxious")
    sleep_hours = models.FloatField()  # Number of hours of sleep
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.username}'s Mental Health Status on {self.last_updated.strftime('%Y-%m-%d')}"


class MeditationContentForStudentWellness(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()  # A description of what the meditation focuses on (e.g., stress relief, relaxation)
    meditation_type = models.CharField(max_length=100)  # Category (e.g., 'stress relief', 'anxiety reduction', 'sleep aid')
    duration_minutes = models.IntegerField()  # Duration in minutes
    audio_file = models.FileField(upload_to='meditations/', null=True, blank=True)  # Optional meditation audio file

    def __str__(self):
        return self.title
    

class Professional_or_peer_counsellors_profiles(models.Model):
    # will store details of counsellors
    ...


# class Student(models.Model):
#     user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='mental_health_students')
#     needs_mental_health_survey = models.BooleanField(default=False)

# class Notification(models.Model):
#     student = models.ForeignKey(Student, on_delete=models.CASCADE)
#     message = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)