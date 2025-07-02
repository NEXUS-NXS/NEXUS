# accounts/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from chat.models import ChatUser
import uuid

@receiver(post_save, sender=User)
def create_chat_user(sender, instance, created, **kwargs):
    if created:
        ChatUser.objects.create(
            user=instance,
            chat_username=f"{instance.first_name.lower()}_{str(uuid.uuid4())[:8]}"
        )


from .models import Profile

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        instance.profile.save()
