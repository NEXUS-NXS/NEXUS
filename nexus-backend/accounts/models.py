# accounts/models.py
from django.db import models
from django.contrib.auth.models import User

def user_profile_upload_path(instance, filename):
    return f"profile_photos/user_{instance.user.id}/{filename}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    gender = models.CharField(
        max_length=20,
        choices=[
            ('male', 'Male'),
            ('female', 'Female'),
            ('other', 'Other'),
            ('prefer-not-to-say', 'Prefer not to say'),
        ],
        blank=True,
    )
    education = models.CharField(
        max_length=20,
        choices=[
            ('undergraduate', 'Undergraduate'),
            ('graduate', 'Graduate'),
            ('postgraduate', 'Postgraduate'),
            ('professional', 'Professional'),
        ],
        blank=True,
    )
    profile_photo = models.ImageField(upload_to=user_profile_upload_path, blank=True, null=True)

    def __str__(self):
        return self.user.username



    def __str__(self):
        return f"{self.user.email}'s profile"