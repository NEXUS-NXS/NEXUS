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






"""
This StudyGroupSerializer is a detailed serializer for your StudyGroup model that does the following:

🔍 Field Breakdown
🔗 Nested Serializers
These give rich nested output rather than just IDs:

category = CategorySerializer() – shows full category info.

exam_focus = ExamFocusSerializer() – same for exam focus.

tags = TagSerializer(many=True) – displays a list of tag objects.

owner = ChatUserSerializer() – provides full info on the owner.

🧠 Computed Fields
These are read-only and calculated from the model:

members
Uses get_members() to serialize all GroupMembership objects related to the group.

python
Copy
Edit
memberships = obj.memberships.all()
Returns full details of each member: user info, role, date joined.

last_message_timestamp
Uses get_last_message_timestamp() to return the timestamp of the most recent message in the group.

python
Copy
Edit
last_message = obj.messages.order_by('-timestamp').first()
Helpful for showing activity status of the group.

🧪 Field Validation
validate_icon
Ensures only image files with .jpg, .jpeg, or .png extensions are allowed for the group icon.

python
Copy
Edit
if ext not in valid_extensions:
    raise serializers.ValidationError(...)
This protects your backend from accepting unsupported or malicious files.

🔎 Fields in Meta
python
Copy
Edit
fields = [
    'id', 'name', 'description', 'category', 'exam_focus', 'max_members',
    'status', 'tags', 'owner', 'icon', 'created_at', 'invite_link',
    'members', 'last_message_timestamp'
]
This includes everything you'd want to display in a detailed group view, like:

Core info (name, desc, status)

Metadata (created_at, invite_link)

Associations (category, exam_focus, tags)

Owner and members

Most recent activity (timestamp)

🟢 What’s Good About It
✅ Highly descriptive and detailed: perfect for views where you need rich data
✅ Uses nested serializers: more readable frontend responses
✅ Includes dynamic fields: last activity & group members
✅ Enforces file type validation: basic security measure
✅ Clean and maintainable: logic is separated and clear
"""
class StudyGroupSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    exam_focus = ExamFocusSerializer(read_only=True)
    exam_focus_id = serializers.PrimaryKeyRelatedField(
        queryset=ExamFocus.objects.all(), source='exam_focus', write_only=True
    )
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), source='tags', many=True, write_only=True
    )
    owner = ChatUserSerializer(read_only=True)
    members = serializers.SerializerMethodField()
    last_message_timestamp = serializers.SerializerMethodField()

    class Meta:
        model = StudyGroup
        fields = [
            'id', 'name', 'description', 'category', 'category_id', 'exam_focus',
            'exam_focus_id', 'max_members', 'status', 'tags', 'tag_ids', 'owner',
            'icon', 'created_at', 'invite_link', 'members', 'last_message_timestamp'
        ]

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


class PendingJoinRequestSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.chat_username', read_only=True)

    class Meta:
        model = JoinRequest
        fields = ['id', 'user', 'user_username', 'group', 'message','status', 'created_at']
        read_only_fields = fields


class JoinRequestSerializer(serializers.ModelSerializer):
    user = ChatUserSerializer(read_only=True)
    group = StudyGroupSerializer(read_only=True)
    class Meta:
        model = JoinRequest
        fields = ['id', 'group', 'user', 'status', 'message','created_at']
        read_only_fields = ['id', 'group', 'user', 'status','created_at']

class MessageSerializer(serializers.ModelSerializer):
    sender = ChatUserSerializer(read_only=True)
    group = StudyGroupSerializer(required=False)
    recipient = ChatUserSerializer(required=False)
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S.%fZ", read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'group', 'recipient', 'content', 'file', 'message_type', 'timestamp', 'is_deleted']

    def validate_file(self, value):
        if value:
            ext = os.path.splitext(value.name)[1].lower()
            valid_extensions = ['.jpg', '.jpeg', '.pdf', '.csv', '.docx', '.txt', '.mp4']
            if ext not in valid_extensions:
                raise serializers.ValidationError(f"Invalid file type: {ext}. Allowed types: {', '.join(valid_extensions)}")
            max_size = 100 * 1024 * 1024  # 10MB
            if value.size > max_size:
                raise serializers.ValidationError(f"File too large. Max size: {max_size / (1024 * 1024)}MB")
        return value
    
    def validate(self, data):
        group = data.get('group')
        recipient = data.get('recipient')
        content = data.get('content')
        file = data.get('file')
        if not content and not file:
            raise serializers.ValidationError("Either content or file must be provided.")
        if group and recipient:
            raise serializers.ValidationError("Cannot specify both group and recipient.")
        return data

class NotificationSerializer(serializers.ModelSerializer):
    user = ChatUserSerializer()
    message = MessageSerializer(required=False)
    group = StudyGroupSerializer(required=False)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'group', 'content', 'is_read', 'created_at']


class ChatUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatUser
        fields = ['id', 'chat_username', 'is_online', 'user']
