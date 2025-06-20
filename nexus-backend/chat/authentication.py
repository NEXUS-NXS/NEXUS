# your_app/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User
from django.conf import settings
# from config import settings


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get(settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token'))
        if not access_token:
            return None
        try:
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
            return (user, validated_token)
        except InvalidToken:
            raise AuthenticationFailed('Invalid token')
        except Exception:
            return None
        



# class CookieJWTAuthentication(JWTAuthentication):
#     def authenticate(self, request):
#         access_token = request.COOKIES.get('access_token')
#         if not access_token:
#             return None
#         try:
#             validated_token = self.get_validated_token(access_token)
#             user = self.get_user(validated_token)
#             return (user, validated_token)
#         except Exception as e:
#             raise AuthenticationFailed(f'Invalid token: {str(e)}')