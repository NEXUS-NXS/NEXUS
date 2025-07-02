from django.urls import path
from . import views

urlpatterns = [
    path('', views.Get_meditations_for_students, name='meditations_for_students'),
    path('meditations/', views.Get_meditations_for_students, name='meditations_for_students'),
    path('connect-counsellors/', views.Connect_users_with_counsellors, name='connect_with_counsellors'),
    path('schedule-support/', views.scheduling_service_with_support_group, name='schedule_support_group'),
]
