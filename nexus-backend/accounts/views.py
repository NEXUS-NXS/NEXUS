# auth/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Profile

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            profile = Profile.objects.get(user=user)

            # Prepare response
            response_data = {
                "message": "User registered",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "gender": profile.gender,
                    "education": profile.education,
                },
            }

            response = Response(response_data, status=status.HTTP_201_CREATED)

            # Set HTTP-only cookies
            response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=True,
                secure=False,  # Set to True in production
                samesite="None",
                max_age=3600,  # 1 hour
            )
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=False,
                samesite="None",
                max_age=86400,  # 1 day
            )

            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # Override to allow email login
        email = request.data.get('email')
        password = request.data.get('password')
        user = User.objects.filter(email=email.lower()).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            profile = Profile.objects.get(user=user)

            response_data = {
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "gender": profile.gender,
                    "education": profile.education,
                },
            }

            response = Response(response_data, status=status.HTTP_200_OK)
            response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=True,
                secure=False,
                samesite="None",
                max_age=3600,
            )
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=False,
                samesite="None",
                max_age=86400,
            )
            return response
        return Response({"detail": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

# Optional: Protected view for checkAuth
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({"message": "Authenticated"}, status=status.HTTP_200_OK)

# Optional: Logout view
class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logged out"}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response