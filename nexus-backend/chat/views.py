from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Category, ExamFocus, Tag, ChatUser, StudyGroup, GroupMembership, JoinRequest, Message, Notification
from .serializers import (CategorySerializer, ExamFocusSerializer, TagSerializer, ChatUserSerializer,
                         StudyGroupSerializer, GroupMembershipSerializer, JoinRequestSerializer,
                         MessageSerializer, NotificationSerializer, PendingJoinRequestSerializer)
from .permissions import IsGroupMember, IsGroupAdminOrOwner, IsGroupOwner, IsMessageSender
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import serializers

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ExamFocusListView(generics.ListAPIView):
    queryset = ExamFocus.objects.all()
    serializer_class = ExamFocusSerializer

class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

#Search for someone by their username
class ChatUserSearchView(generics.ListAPIView):
    serializer_class = ChatUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        return ChatUser.objects.filter(chat_username__icontains=query).exclude(user=self.request.user)

#search for  group, create a group
class StudyGroupListCreateView(generics.ListCreateAPIView):
    serializer_class = StudyGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        return StudyGroup.objects.filter(Q(name__icontains=query) | Q(status='PUBLIC'))

    def perform_create(self, serializer):
        group = serializer.save(owner=self.request.user.chat_user)
        GroupMembership.objects.create(group=group, user=self.request.user.chat_user, role='OWNER')

"""
it is designed to :
    fetch the full details of a specific studygroup GET
    allow the group owner to update the group's information PUT/PATCH
    allow the group owner to delete the group DELETE
    Restrict access so that only group members can see the group, and only the owner can edit it

"""
class StudyGroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StudyGroup.objects.all()
    serializer_class = StudyGroupSerializer
    permission_classes = [IsAuthenticated, IsGroupMember]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [IsAuthenticated(), IsGroupOwner()]
        if self.request.method == 'DELETE':
            return [IsAuthenticated(), IsGroupOwner()]
        return [IsAuthenticated(), IsGroupMember()]
    

#list all join requests
class PendingJoinRequestsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsGroupAdminOrOwner]
    serializer_class = PendingJoinRequestSerializer

    def get_queryset(self):
        group_id = self.kwargs['group_id']
        group = get_object_or_404(StudyGroup, id=group_id)
        return JoinRequest.objects.filter(group=group, status='PENDING')


#handles creation of join requests
class JoinRequestCreateView(generics.CreateAPIView):
    serializer_class = JoinRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        group = get_object_or_404(StudyGroup, id=self.kwargs['group_id'])
        if group.status == 'PRIVATE' and not GroupMembership.objects.filter(group=group, user=self.request.user.chat_user).exists():
            serializer.save(user=self.request.user.chat_user, group=group)
        else:
            raise serializers.ValidationError("Cannot send join request to a public group or if already a member.")

#handles approval or rejection of join requests
class JoinRequestManageView(APIView):
    permission_classes = [IsAuthenticated, IsGroupAdminOrOwner]

    def post(self, request, join_request_id):
        join_request = get_object_or_404(JoinRequest, id=join_request_id)
        action = request.data.get('action')
        if action not in ['APPROVE', 'REJECT']:
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
        
        join_request.status = 'APPROVED' if action == 'APPROVE' else 'REJECTED'
        join_request.save()
        
        if action == 'APPROVE':
            GroupMembership.objects.create(group=join_request.group, user=join_request.user, role='MEMBER')
            Notification.objects.create(
                user=join_request.user,
                group=join_request.group,
                content=f"Your join request to {join_request.group.name} has been approved."
            )
        
        return Response({'status': join_request.status}, status=status.HTTP_200_OK)


#handles role management in groups
class GroupMembershipManageView(APIView):
    permission_classes = [IsAuthenticated, IsGroupAdminOrOwner]

    def post(self, request, group_id, user_id):
        group = get_object_or_404(StudyGroup, id=group_id)
        user = get_object_or_404(ChatUser, id=user_id)
        membership = get_object_or_404(GroupMembership, group=group, user=user)
        
        action = request.data.get('action')
        if action == 'REMOVE':
            if membership.role == 'OWNER' and self.request.user.chat_user != group.owner:
                return Response({'error': 'Cannot remove owner'}, status=status.HTTP_403_FORBIDDEN)
            membership.delete()
        elif action == 'PROMOTE':
            if membership.role == 'OWNER':
                return Response({'error': 'Cannot promote owner'}, status=status.HTTP_400_BAD_REQUEST)
            membership.role = 'ADMIN'
            membership.save()
        elif action == 'DEMOTE':
            if membership.role == 'OWNER':
                return Response({'error': 'Cannot demote owner'}, status=status.HTTP_400_BAD_REQUEST)
            membership.role = 'MEMBER'
            membership.save()
        else:
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'status': 'success'}, status=status.HTTP_200_OK)


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        group_id = self.kwargs.get('group_id')
        recipient_id = self.kwargs.get('recipient_id')
        if group_id:
            return Message.objects.filter(group_id=group_id, is_deleted=False)
        if recipient_id:
            return Message.objects.filter(
                Q(sender=self.request.user.chat_user, recipient_id=recipient_id) |
                Q(sender_id=recipient_id, recipient=self.request.user.chat_user),
                is_deleted=False
            )
        return Message.objects.none()

    def perform_create(self, serializer):
        group_id = self.kwargs.get('group_id')
        recipient_id = self.kwargs.get('recipient_id')
        if group_id:
            group = get_object_or_404(StudyGroup, id=group_id)
            if not GroupMembership.objects.filter(group=group, user=self.request.user.chat_user).exists():
                raise serializers.ValidationError("You are not a member of this group.")
            serializer.save(sender=self.request.user.chat_user, group=group)
        elif recipient_id:
            recipient = get_object_or_404(ChatUser, id=recipient_id)
            serializer.save(sender=self.request.user.chat_user, recipient=recipient)
        else:
            raise serializers.ValidationError("Must specify group or recipient.")

class MessageDeleteView(generics.DestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated, IsMessageSender]

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user.chat_user).order_by('-created_at')

class LeaveGroupView(APIView):
    permission_classes = [IsAuthenticated, IsGroupMember]

    def post(self, request, group_id):
        group = get_object_or_404(StudyGroup, id=group_id)
        membership = get_object_or_404(GroupMembership, group=group, user=self.request.user.chat_user)
        if membership.role == 'OWNER':
            return Response({'error': 'Owner cannot leave the group'}, status=status.HTTP_400_BAD_REQUEST)
        membership.delete()
        return Response({'status': 'success'}, status=status.HTTP_200_OK)

class JoinGroupByLinkView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, invite_link):
        group = get_object_or_404(StudyGroup, invite_link=invite_link)
        if GroupMembership.objects.filter(group=group, user=self.request.user.chat_user).exists():
            return Response({'error': 'Already a member'}, status=status.HTTP_400_BAD_REQUEST)
        
        if group.status == 'PUBLIC':
            GroupMembership.objects.create(group=group, user=self.request.user.chat_user, role='MEMBER')
            return Response({'status': 'Joined group'}, status=status.HTTP_200_OK)
        else:
            JoinRequest.objects.get_or_create(group=group, user=self.request.user.chat_user, status='PENDING')
            return Response({'status': 'Join request sent'}, status=status.HTTP_200_OK)