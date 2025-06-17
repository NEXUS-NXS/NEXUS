from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
import uuid

class Category(models.Model):
    CATEGORY_CHOICES = (
        ('EXAM_PREP', 'Exam Preparation'),
        ('PROJECT', 'Project Groups'),
        ('DISCUSSION', 'Discussion Groups'),
    )
    name = models.CharField(max_length=20, choices=CATEGORY_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()

class ExamFocus(models.Model):
    EXAM_CHOICES = (
        ('SOA_P', 'SOA Exam P'),
        ('SOA_FM', 'SOA Exam FM'),
        ('SOA_IFM', 'SOA Exam IFM'),
        ('SOA_LTAM', 'SOA Exam LTAM'),
        ('SOA_STAM', 'SOA Exam STAM'),
        ('CAS_1', 'CAS Exam 1'),
        ('CAS_2', 'CAS Exam 2'),
    )
    name = models.CharField(max_length=20, choices=EXAM_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class ChatUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='chat_user')
    chat_username = models.CharField(max_length=100, unique=True)
    is_online = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.chat_username:
            base_username = self.user.first_name.lower().replace(' ', '_')
            unique_suffix = str(uuid.uuid4())[:8]
            self.chat_username = f"{base_username}_{unique_suffix}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.chat_username

class StudyGroup(models.Model):
    GROUP_STATUS = (
        ('PUBLIC', 'Public'),
        ('PRIVATE', 'Private'),
    )
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    exam_focus = models.ForeignKey(ExamFocus, on_delete=models.SET_NULL, null=True)
    max_members = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=GROUP_STATUS, default='PUBLIC')
    tags = models.ManyToManyField(Tag)
    owner = models.ForeignKey(ChatUser, on_delete=models.CASCADE, related_name='owned_groups')
    icon = models.ImageField(upload_to='group_icons/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    invite_link = models.CharField(max_length=100, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.invite_link:
            self.invite_link = str(uuid.uuid4())
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class GroupMembership(models.Model):
    ROLE_CHOICES = (
        ('OWNER', 'Owner'),
        ('ADMIN', 'Admin'),
        ('MEMBER', 'Member'),
    )
    group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(ChatUser, on_delete=models.CASCADE, related_name='group_memberships')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='MEMBER')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('group', 'user')

    def __str__(self):
        return f"{self.user.chat_username} - {self.group.name} ({self.role})"

class JoinRequest(models.Model):
    group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE, related_name='join_requests')
    user = models.ForeignKey(ChatUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=(('PENDING', 'Pending'), ('APPROVED', 'Approved'), ('REJECTED', 'Rejected')), default='PENDING')



    def __str__(self):
        return f"{self.user.chat_username} -> {self.group.name}"

class Message(models.Model):
    MESSAGE_TYPES = (
        ('TEXT', 'Text'),
        ('IMAGE', 'Image'),
        ('FILE', 'File'),
        ('VIDEO', 'Video'),
    )
    sender = models.ForeignKey(ChatUser, on_delete=models.CASCADE, related_name='sent_messages')
    group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE, related_name='messages', null=True, blank=True)
    recipient = models.ForeignKey(ChatUser, on_delete=models.CASCADE, related_name='received_messages', null=True, blank=True)
    content = models.TextField(blank=True)
    file = models.FileField(upload_to='chat_files/', null=True, blank=True)
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES, default='TEXT')
    timestamp = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender.chat_username} -> {self.group or self.recipient} ({self.timestamp})"

class Notification(models.Model):
    user = models.ForeignKey(ChatUser, on_delete=models.CASCADE, related_name='notifications')
    message = models.ForeignKey(Message, on_delete=models.CASCADE, null=True, blank=True)
    group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE, null=True, blank=True)
    content = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.chat_username}: {self.content}"