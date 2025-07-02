from django.contrib import admin
from .models import *

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)

@admin.register(ExamFocus)
class ExamFocusAdmin(admin.ModelAdmin):
    list_display = ("name",)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name",)

@admin.register(ChatUser)
class ChatUserAdmin(admin.ModelAdmin):
    list_display = ('chat_username', 'user', 'is_online')
    search_fields = ('chat_username', 'user__first_name')

@admin.register(StudyGroup)
class StudyGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'owner', 'category', 'exam_focus', 'status', 'created_at', 'invite_link')
    list_filter = ('status', 'category', 'exam_focus')
    search_fields = ('name', 'description')

@admin.register(GroupMembership)
class GroupMembershipAdmin(admin.ModelAdmin):
    list_display = ('group', 'user', 'role', 'joined_at')
    list_filter = ('role',)
    search_fields = ('group__name', 'user__chat_username')

@admin.register(JoinRequest)
class JoinRequestAdmin(admin.ModelAdmin):
    list_display = ('group', 'user', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('group__name', 'user__chat_username')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'group', 'recipient', 'message_type', 'timestamp', 'is_deleted')
    list_filter = ('message_type', 'is_deleted')
    search_fields = ('content', 'sender__chat_username')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'content', 'is_read', 'created_at')
    list_filter = ('is_read',)
    search_fields = ('content', 'user__chat_username')
