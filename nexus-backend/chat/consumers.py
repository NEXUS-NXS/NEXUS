import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatUser, StudyGroup, Message, Notification, GroupMembership
from .serializers import MessageSerializer
from django.shortcuts import get_object_or_404
from channels.layers import get_channel_layer

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self, request):
        self.user = self.scope['user']

        if self.user.is_anonymous:
            await self.close()
            return 
        
        
        self.room_group_name=None 
        await self.update_user_status(True)
        await self.accept()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.update_user_status(False)
            if self.room_group_name:
                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name
                )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'join_room':
            group_id = data.get('group_id')
            recipient_id = data.get('recipient_id')

            if group_id:
                self.room_group_name = f'group_{group_id}'
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )
            elif recipient_id:
                self.room_group_name = f'chat_{min(self.user.chat_user.id, int(recipient_id))}_{max(self.user.chat_user.id, int(recipient_id))}'
                await self.channel_layer.group_add(
                    self.room_group_name, 
                    self.channel_name
                )
            elif message_type == 'message':
                content = data.get('content')
                group_id = data.get('group_id')
                recipient_id = data.get('recipient_id')
                file_url = data.get(file_url)
                msg_type = data.get('message_type', 'TEXT')

                message = await self.create_message(content, group_id, recipient_id, file_url, msg_type)
                serialized_message = await self.serialize_message(message)

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': serialized_message
                    }
                )
        
    async def chat_message(self,event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message']
        }))

    @database_sync_to_async
    def create_message(self, content, group_id, recipient_id, file_url, message_type):
        message_data = {
            'sender': self.user.chat_user,
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

        #create notification
        if group_id:
            group = message_data['group']
            members = GroupMembership.objects.filter(group=group).exclude(user=self.user.chat_user)
            
            for membership in members:
                Notification.objects.create(
                    user=membership.user,
                    group=group,
                    message=message,
                    content=f'New message in {group.name}'
                )

        elif recipient_id:
            Notification.objects.create(
                user=message_data['recipient'],
                message=message,
                content=f"New message from {self.user.chat_user.chat_username}"
            )
        
        return message
    
    @database_sync_to_async
    def serialize_message(self, message):
        return MessageSerializer(message).data
                


