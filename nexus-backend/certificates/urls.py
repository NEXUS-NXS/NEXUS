from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'certificates', views.CertificateViewSet, basename='certificate')
router.register(r'my-certificates', views.UserCertificateViewSet, basename='user-certificate')

urlpatterns = [
    path('', include(router.urls)),
]
