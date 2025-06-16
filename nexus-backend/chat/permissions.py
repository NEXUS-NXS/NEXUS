from rest_framework import permissions
from .models import StudyGroup, GroupMembership

class IsGroupMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, StudyGroup):
            return GroupMembership.objects.filter(group=obj, user=request.user.chat_user).exists()
        return False

class IsGroupAdminOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, StudyGroup):
            membership = GroupMembership.objects.filter(group=obj, user=request.user.chat_user).first()
            return membership and membership.role in ['ADMIN', 'OWNER']
        return False

class IsGroupOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, StudyGroup):
            membership = GroupMembership.objects.filter(group=obj, user=request.user.chat_user).first()
            return membership and membership.role == 'OWNER'
        return False

class IsMessageSender(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.sender == request.user.chat_user