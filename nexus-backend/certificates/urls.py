from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'certificates', views.CertificateViewSet, basename='certificate')
router.register(r'my-certificates', views.UserCertificateViewSet, basename='user-certificate')

urlpatterns = [
    path('', include(router.urls)),
    
    # Course-related certificate endpoints
    path('courses/available/', views.available_courses_for_certificate, name='available-courses'),
    path('my-certificates/courses/', views.UserCertificateViewSet.as_view({'get': 'course_certificates'}), name='my-course-certificates'),
]
