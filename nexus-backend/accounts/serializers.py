# auth/serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(max_length=255, required=True, write_only=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    gender = serializers.ChoiceField(
        choices=[
            ('male', 'Male'),
            ('female', 'Female'),
            ('other', 'Other'),
            ('prefer-not-to-say', 'Prefer not to say'),
        ],
        required=False,
    )
    education = serializers.ChoiceField(
        choices=[
            ('undergraduate', 'Undergraduate'),
            ('graduate', 'Graduate'),
            ('postgraduate', 'Postgraduate'),
            ('professional', 'Professional'),
        ],
        required=False,
    )

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'password2', 'gender', 'education']
        extra_kwargs = {'email': {'required': True}}

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match'})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({'email': 'A user with this email already exists'})
        return attrs

    def create(self, validated_data):
        # Split full_name into first_name and last_name
        full_name = validated_data.pop('full_name')
        name_parts = full_name.strip().split(maxsplit=1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        password2 = validated_data.pop('password2')
        gender = validated_data.pop('gender', '')
        education = validated_data.pop('education', '')

        # Create user
        user = User.objects.create_user(
            username=validated_data['email'].lower(),  # Use email as username
            email=validated_data['email'].lower(),
            first_name=first_name,
            last_name=last_name,
            password=validated_data['password'],
        )

        # Create profile
        Profile.objects.create(
            user=user,
            gender=gender,
            education=education,
        )

        return user