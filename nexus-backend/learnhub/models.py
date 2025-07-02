from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import JSONField
import uuid
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
from django.core.validators import FileExtensionValidator


User = get_user_model()

class Expertise(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Instructor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    experience = models.CharField(max_length=100, blank=True)
    profile_image = models.URLField(blank=True)
    expertise = models.ManyToManyField(Expertise, blank=True)
    social_links = JSONField(default=dict, blank=True)  # Replaced separate URL fields

    def __str__(self):
        return self.user.get_full_name() or self.user.username

class Tag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class LearningObjective(models.Model):
    text = models.TextField()
    course = models.ForeignKey('Course', null=True, blank=True, on_delete=models.CASCADE)
    lesson = models.ForeignKey('Lesson', null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.text[:60]

class Prerequisite(models.Model):
    text = models.TextField()
    course = models.ForeignKey('Course', on_delete=models.CASCADE)

    def __str__(self):
        return self.text[:60]

class Course(models.Model):
    STATUS_CHOICES = [("draft", "Draft"), ("published", "Published")]
    CATEGORY_CHOICES = [
        ("programming", "Programming"),
        ("data-science", "Data Science"),
        ("machine-learning", "Machine Learning"),
        ("statistics", "Statistics"),
        ("finance", "Financial Modeling"),
        ("risk-management", "Risk Management"),
        ("certification", "Certification Prep"),
        ("other", "Other"),
    ]
    DIFFICULTY_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
        ("expert", "Expert"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, blank=False)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=False)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default="beginner")
    estimated_duration = models.CharField(max_length=100, blank=True)
    cover_picture = models.ImageField(
    upload_to='courses/covers/',
    blank=True,
    null=True,
    validators=[
        FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif']),
    ]
)
    tags = models.ManyToManyField(Tag, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_lessons = models.IntegerField(default=0)
    total_duration = models.IntegerField(default=0)  # in minutes
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE)
    learning_objectives = models.ManyToManyField(LearningObjective, blank=True, related_name="courses")
    prerequisites = models.ManyToManyField(
            'Prerequisite', 
            blank=True, 
            related_name='related_courses'  # or another meaningful name
        )
    rating = models.FloatField(default=0.0, validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    enrolled_students = models.PositiveIntegerField(default=0)

    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    is_popular = models.BooleanField(default=False)
    thumbnail = models.URLField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.title)
            # Ensure slug uniqueness
            original_slug = self.slug
            counter = 1
            while Course.objects.filter(slug=self.slug).exclude(id=self.id).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category']),
            models.Index(fields=['status']),
        ]

class Module(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=255, blank=False)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title


class Lesson(models.Model):
    TYPE_CHOICES = [("video", "Video"), ("quiz", "Quiz")]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=255, blank=False)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    duration = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    video_url = models.URLField(blank=True)
    is_completed = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    overview = models.TextField(blank=True)
    summary = models.TextField(blank=True)
    learning_objectives = models.ManyToManyField(LearningObjective, blank=True, related_name="lessons")

    def __str__(self):
        return self.title

class KeyPoint(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="keypoints")
    title = models.CharField(max_length=255, blank=False)
    content = models.TextField(blank=True)

    def __str__(self):
        return self.title

class BulletPoint(models.Model):
    key_point = models.ForeignKey(KeyPoint, on_delete=models.CASCADE, related_name="bullets")
    text = models.TextField(blank=False)

    def __str__(self):
        return self.text[:50]

class CodeExample(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="code_examples")
    title = models.CharField(max_length=255, blank=False)
    code = models.TextField(blank=False)

    def __str__(self):
        return self.title

class Question(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="questions")
    question = models.TextField(blank=False)
    options = JSONField(default=list)  # Replaced separate option fields
    correct_option = models.PositiveSmallIntegerField()
    explanation = models.TextField(blank=True)

    def __str__(self):
        return self.question[:60]
    



class CourseEnrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'course']



class CourseRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    rating = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'course']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update course rating
        course = self.course
        ratings = CourseRating.objects.filter(course=course)
        course.rating = ratings.aggregate(Avg('rating'))['rating__avg'] or 0.0
        course.save()


class QuizSubmission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    answers = models.JSONField()  # e.g., { "question_id": selected_option_index }
    score = models.FloatField(null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'lesson']


class UserLessonProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    video_progress = models.FloatField(default=0.0)
    video_current_time = models.FloatField(default=0.0)

    class Meta:
        unique_together = ['user', 'lesson']
