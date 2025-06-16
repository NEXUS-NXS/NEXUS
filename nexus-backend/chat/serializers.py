from rest_framework import serializers
from .models import Category, ExamFocus, Tag, ChatUser, StudyGroup, GroupMembership, JoinRequest, Message, Notification
from django.contrib.auth.models import User
import os

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ExamFocusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamFocus
        fields = ['id', 'name']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class ChatUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatUser
        fields = ['id', 'chat_username', 'is_online']

class GroupMembershipSerializer(serializers.ModelSerializer):
    user = ChatUserSerializer()
    class Meta:
        model = GroupMembership
        fields = ['id', 'user', 'role', 'joined_at']

class StudyGroupSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    exam_focus = ExamFocusSerializer()
    tags = TagSerializer(many=True)
    owner = ChatUserSerializer()
    members = serializers.SerializerMethodField()
    last_message_timestamp = serializers.SerializerMethodField()

    class Meta:
        model = StudyGroup
        fields = ['id', 'name', 'description', 'category', 'exam_focus', 'max_members', 'status', 'tags', 'owner', 'icon', 'created_at', 'invite_link', 'members', 'last_message_timestamp']

    def get_members(self, obj):
        memberships = obj.memberships.all()
        return GroupMembershipSerializer(memberships, many=True).data

    def get_last_message_timestamp(self, obj):
        last_message = obj.messages.order_by('-timestamp').first()
        return last_message.timestamp if last_message else None

    def validate_icon(self, value):
        if value:
            ext = os.path.splitext(value.name)[1].lower()
            valid_extensions = ['.jpg', '.jpeg', '.png']
            if ext not in valid_extensions:
                raise serializers.ValidationError("Invalid file type. Only JPG and PNG are allowed.")
        return value

class JoinRequestSerializer(serializers.ModelSerializer):
    user = ChatUserSerializer()
    group = StudyGroupSerializer()
    class Meta:
        model = JoinRequest
        fields = ['id', 'group', 'user', 'status', 'created_at']

class MessageSerializer(serializers.ModelSerializer):
    sender = ChatUserSerializer()
    group = StudyGroupSerializer(required=False)
    recipient = ChatUserSerializer(required=False)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'group', 'recipient', 'content', 'file', 'message_type', 'timestamp', 'is_deleted']

    def validate_file(self, value):
        if value:
            ext = os.path.splitext(value.name)[1].lower()
            valid_extensions = ['.jpg', '.jpeg', '.pdf', '.csv', '.docx', '.txt', '.mp4']
            if ext not in valid_extensions:
                raise serializers.ValidationError("Invalid file type. Allowed types: jpg, jpeg, pdf, csv, docx, txt, mp4")
        return value

class NotificationSerializer(serializers.ModelSerializer):
    user = ChatUserSerializer()
    message = MessageSerializer(required=False)
    group = StudyGroupSerializer(required=False)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'group', 'content', 'is_read', 'created_at']