from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'resources', views.ResourceViewSet, basename='resource')
router.register(r'categories', views.ResourceCategoryViewSet, basename='resourcecategory')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('test-connection/', views.test_connection, name='test-connection'),
    path('test-auth/', views.test_connection, name='test-auth-connection'),
]
