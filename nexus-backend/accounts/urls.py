# auth/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CustomTokenObtainPairView, ProtectedView, LogoutView, CsrfTokenView

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register_view'),
    path('protected/', ProtectedView.as_view(), name='protected'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('csrf/', CsrfTokenView.as_view(), name='csrf'),
]