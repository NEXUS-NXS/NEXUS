from django.db import models
from django.db.models import JSONField
from django.conf import settings
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Model(models.Model):
    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('r', 'R'),
        ('dsl', 'DSL'),
    ]
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)  # e.g., actuarial, financial
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES)
    code = models.TextField()  # Model code or DSL JSON
    metadata = JSONField(default=dict)  # Additional info (e.g., description)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class Dataset(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(null=True, upload_to='datasets/')
    format = models.CharField(null=True, max_length=50)
    size = models.BigIntegerField(null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='datasets', null=True)
    is_public = models.BooleanField(default=False, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Simulation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    session_id = models.CharField(max_length=100, unique=True)
    model = models.ForeignKey(Model, on_delete=models.CASCADE)
    parameters = JSONField(default=dict)  # Simulation parameters
    dataset = models.ForeignKey(Dataset, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    progress = models.FloatField(default=0.0)  # 0 to 100
    current_step = models.CharField(max_length=100, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    start_time = models.DateTimeField(null=True, blank=True)
    estimated_completion = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Simulation {self.session_id}"

class Result(models.Model):
    simulation = models.OneToOneField(Simulation, on_delete=models.CASCADE)
    summary = models.TextField(blank=True)
    metrics = JSONField(default=dict)  # e.g., {"mean": 100, "std_dev": 10}
    chart_data = JSONField(default=dict)  # e.g., {"line": [[x1, y1], [x2, y2]]}
    errors = JSONField(default=dict)  # e.g., {"code": "ERR001", "message": "..."}
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result for {self.simulation.session_id}"