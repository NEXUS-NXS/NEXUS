#consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from .models import ChatUser, StudyGroup, Message, Notification, GroupMembership
from .serializers import MessageSerializer
from django.shortcuts import get_object_or_404
import datetime

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = await self.get_user()
        if user.is_anonymous:
            await self.close()
            return
        self.user = user
        self.chat_user = await self.get_chat_user()
        self.room_group_name = None
        await self.update_user_status(True)
        await self.accept()

    @database_sync_to_async
    def get_user(self):
        try:
            jwt_auth = JWTAuthentication()
            token = self.scope['cookies'].get(settings.SIMPLE_JWT['AUTH_COOKIE'])
            if not token:
                return AnonymousUser()
            validated_token = jwt_auth.get_validated_token(token)
            user = jwt_auth.get_user(validated_token)
            return user
        except Exception as e:
            print(f"WebSocket auth error: {e}")
            return AnonymousUser()

    @database_sync_to_async
    def get_chat_user(self):
        # return getattr(self.user, 'chat_user', None)
        return ChatUser.objects.get_or_create(user=self.user)[0]

    async def disconnect(self, close_code):
        if self.user.is_authenticated and self.room_group_name:
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
            await self.update_user_status(False)
        print(f"WebSocket closed with code: {close_code}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'join_room':
            group_id = data.get('group_id')
            recipient_id = data.get('recipient_id')
            if group_id:
                self.room_group_name = f'group_{group_id}'
                await self.channel_layer.group_add(self.room_group_name, self.channel_name)
                await self.send(text_data=json.dumps({'type': 'join_room', 'status': 'joined', 'group_id': group_id}))
            elif recipient_id:
                self.room_group_name = f'chat_{min(self.chat_user.id, int(recipient_id))}_{max(self.chat_user.id, int(recipient_id))}'
                await self.channel_layer.group_add(self.room_group_name, self.channel_name)
                await self.send(text_data=json.dumps({'type': 'join_room', 'status': 'joined', 'recipient_id': recipient_id}))
        elif message_type == 'message':
            content = data.get('content')
            group_id = data.get('group_id')
            recipient_id = data.get('recipient_id')
            file_url = data.get('file_url')
            msg_type = data.get('message_type', 'TEXT')
            message = await self.create_message(content, group_id, recipient_id, file_url, msg_type)
            if message:
                serialized_message = await self.serialize_message(message)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': json.loads(json.dumps(serialized_message, default=str)),
                    }
                )
                print(f"[group_send] Sent to room: {self.room_group_name}")


    async def chat_message(self, event):
        try:
            await self.send(text_data=json.dumps({
                'type': 'message',
                'message': event['message'],
            }))
        except Exception as e:
            print(f"[chat_message error] {e}")
            await self.close()

    @database_sync_to_async
    def create_message(self, content, group_id, recipient_id, file_url, message_type):
        message_data = {
            'sender': self.chat_user,
            'content': content,
            'message_type': message_type,
        }
        if file_url:
            message_data['file'] = file_url
        if group_id:
            message_data['group'] = get_object_or_404(StudyGroup, id=group_id)
        elif recipient_id:
            message_data['recipient'] = get_object_or_404(ChatUser, id=recipient_id)
        message = Message.objects.create(**message_data)

        if group_id:
            group = message_data['group']
            members = GroupMembership.objects.filter(group=group).exclude(user=self.chat_user)
            for membership in members:
                Notification.objects.create(
                    user=membership.user,
                    group=group,
                    message=message,
                    content=f'New message in {group.name}',
                )
        elif recipient_id:
            Notification.objects.create(
                user=message_data['recipient'],
                message=message,
                content=f'New message from {self.chat_user.chat_username}',
            )
        return message

    # @database_sync_to_async
    # def serialize_message(self, message):
    #     return MessageSerializer(message).data
    @database_sync_to_async
    def serialize_message(self, message):
        data = MessageSerializer(message).data
        if isinstance(data.get("timestamp"), datetime.datetime):
            data["timestamp"] = data["timestamp"].isoformat()
        return data


    @database_sync_to_async
    def update_user_status(self, is_online):
        if self.chat_user:
            self.chat_user.is_online = is_online
            self.chat_user.save()