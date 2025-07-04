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
    # Basic information
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    long_description = models.TextField(blank=True)
    
    # File information
    file = models.FileField(null=True, upload_to='datasets/')
    type = models.CharField(max_length=50, blank=True)  # CSV, Database, Time Series, etc.
    size = models.BigIntegerField(null=True, blank=True)
    row_count = models.IntegerField(null=True, blank=True)
    column_count = models.IntegerField(null=True, blank=True)
    
    # Ownership and sharing
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='datasets')
    is_public = models.BooleanField(default=False)
    shared_with = models.ManyToManyField(User, related_name='shared_datasets', blank=True)
    
    # Metadata
    source = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    tags = JSONField(default=list, blank=True)
    
    # Quality metrics (0-100 scale)
    quality_completeness = models.FloatField(default=0.0)
    quality_accuracy = models.FloatField(default=0.0)
    quality_consistency = models.FloatField(default=0.0)
    quality_timeliness = models.FloatField(default=0.0)
    
    # Usage statistics
    downloads = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    
    # Schema and preview data (JSON fields)
    schema = JSONField(default=list, blank=True)  # [{name, type, description, nullable}]
    preview_data = JSONField(default=dict, blank=True)  # {columns: [], rows: []}
    
    # Usage statistics
    usage_stats = JSONField(default=dict, blank=True)  # {models: int, modelNames: []}
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return self.name
    
    @property
    def shared_with_count(self):
        return self.shared_with.count()
    
    @property 
    def quality_metrics(self):
        return {
            'completeness': self.quality_completeness,
            'accuracy': self.quality_accuracy,
            'consistency': self.quality_consistency,
            'timeliness': self.quality_timeliness,
        }
    
    def increment_views(self):
        self.views += 1
        self.save(update_fields=['views'])
        
    def increment_downloads(self):
        self.downloads += 1
        self.save(update_fields=['downloads'])

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


class ModelParameterTemplate(models.Model):
    """Default parameter templates for models"""
    model = models.ForeignKey(Model, on_delete=models.CASCADE, related_name='parameter_templates')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    parameters = JSONField(default=dict)  # Default parameter values
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['model', 'name']
    
    def __str__(self):
        return f"{self.model.name} - {self.name}"


class ModelCollaborator(models.Model):
    """Track who has access to collaborate on a model"""
    PERMISSION_CHOICES = [
        ('view', 'View Only'),
        ('edit', 'Edit'),
        ('admin', 'Admin'),
    ]
    
    model = models.ForeignKey(Model, on_delete=models.CASCADE, related_name='collaborators')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    permission = models.CharField(max_length=10, choices=PERMISSION_CHOICES)
    added_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='added_collaborators')
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['model', 'user']
    
    def __str__(self):
        return f"{self.user.username} - {self.model.name} ({self.permission})"


class ModelSession(models.Model):
    """Track active collaboration sessions for models"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('viewing', 'Viewing'),
        ('editing', 'Editing'),
        ('idle', 'Idle'),
    ]
    
    model = models.ForeignKey(Model, on_delete=models.CASCADE, related_name='sessions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='viewing')
    cursor_position = JSONField(default=dict, blank=True)  # {x: 45, y: 23}
    last_activity = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['model', 'user']
    
    def __str__(self):
        return f"{self.user.username} - {self.model.name} ({self.status})"


class SimulationProgress(models.Model):
    """Track detailed progress of running simulations"""
    simulation = models.OneToOneField(Simulation, on_delete=models.CASCADE, related_name='progress_details')
    current_step = models.CharField(max_length=255, blank=True)
    progress_percentage = models.IntegerField(default=0)
    estimated_completion = models.DateTimeField(null=True, blank=True)
    steps_completed = JSONField(default=list)  # List of completed steps
    steps_total = JSONField(default=list)  # List of all steps
    detailed_log = JSONField(default=list)  # Detailed execution log
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.simulation.session_id} - {self.progress_percentage}%"


class SimulationParameter(models.Model):
    """Individual parameter definitions for simulation models"""
    TYPE_CHOICES = [
        ('number', 'Number'),
        ('string', 'String'),
        ('boolean', 'Boolean'),
        ('date', 'Date'),
        ('select', 'Select'),
        ('range', 'Range'),
    ]
    
    model = models.ForeignKey(Model, on_delete=models.CASCADE, related_name='parameters')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    default_value = models.TextField(blank=True)  # Store as string, convert based on type
    min_value = models.FloatField(null=True, blank=True)
    max_value = models.FloatField(null=True, blank=True)
    description = models.TextField(blank=True)
    required = models.BooleanField(default=True)
    options = JSONField(default=list, blank=True)  # For select type parameters
    order = models.IntegerField(default=0)  # For parameter ordering in UI
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['model', 'name']
        ordering = ['order', 'name']
    
    def __str__(self):
        return f"{self.model.name} - {self.name}"
    
    def get_typed_default_value(self):
        """Convert default_value string to proper type"""
        if not self.default_value:
            return None
        
        if self.type == 'number':
            try:
                return float(self.default_value)
            except ValueError:
                return 0.0
        elif self.type == 'boolean':
            return self.default_value.lower() in ('true', '1', 'yes', 'on')
        elif self.type == 'date':
            return self.default_value  # Let frontend handle date parsing
        else:
            return self.default_value
    
    def validate_value(self, value):
        """Validate a parameter value against constraints"""
        errors = []
        
        if self.required and (value is None or value == ''):
            errors.append(f"{self.name} is required")
            return errors
        
        if value is None or value == '':
            return errors  # Optional parameters can be empty
        
        if self.type == 'number':
            try:
                num_value = float(value)
                if self.min_value is not None and num_value < self.min_value:
                    errors.append(f"{self.name} must be at least {self.min_value}")
                if self.max_value is not None and num_value > self.max_value:
                    errors.append(f"{self.name} must be at most {self.max_value}")
            except ValueError:
                errors.append(f"{self.name} must be a valid number")
        
        elif self.type == 'select' and self.options:
            if value not in self.options:
                errors.append(f"{self.name} must be one of: {', '.join(self.options)}")
        
        return errors