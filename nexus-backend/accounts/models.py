# accounts/models.py
from django.db import models
from django.conf import settings

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
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

    def __str__(self):
        return f"{self.user.email}'s profile"