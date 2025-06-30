# auth/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Profile
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]

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
                secure=True,  # Set to True in production
                samesite="None",
                max_age=3600,  # 1 hour
            )
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=True,
                samesite="None",
                max_age=86400,  # 1 day
            )

            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        user = User.objects.filter(email=email.lower()).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            profile = Profile.objects.get(user=user)

            # Include tokens in the JSON response
            response_data = {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
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

            # Also set HTTP-only cookies (optional redundancy for security)
            response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=True,
                secure=True,
                samesite="None",
                max_age=3600,
            )
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=True,
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
    
# auth/views.py
from django.middleware.csrf import get_token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny  # Add this import

class CsrfTokenView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        csrf_token = get_token(request)
        response = Response({'csrf_token': csrf_token})
        response.set_cookie(
            key='csrftoken',
            value=csrf_token,
            httponly=False,
            secure=True,
            samesite='None',
            max_age=86400,
        )
        return response