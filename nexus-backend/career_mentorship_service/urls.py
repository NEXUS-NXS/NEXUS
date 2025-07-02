from django.urls import path
from . import views

urlpatterns = [
    path('', views.Map_stud_with_mentor, name='map_student_with_mentor'),
    path('map-student-mentor/', views.Map_stud_with_mentor, name='map_student_with_mentor'),
    path('career-guidance/', views.career_guidance_helper, name='career_guidance_helper'),
    path('mentor/<int:mentor_id>/', views.mentor_profile, name='mentor_profile'),

]