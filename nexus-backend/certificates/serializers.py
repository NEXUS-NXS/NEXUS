from rest_framework import serializers
from .models import Certificate, UserCertificate

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = [
            'id', 'title', 'description', 'issuer', 'certificate_type', 
            'template', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class SimpleUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()

class UserCertificateSerializer(serializers.ModelSerializer):
    certificate_details = CertificateSerializer(source='certificate', read_only=True)
    user_details = SimpleUserSerializer(source='user', read_only=True)
    
    class Meta:
        model = UserCertificate
        fields = [
            'id', 'user', 'certificate', 'certificate_file', 'issue_date', 
            'expiry_date', 'status', 'created_at', 'updated_at',
            'certificate_details', 'user_details'
        ]
        read_only_fields = ['created_at', 'updated_at', 'status']
    
    def validate(self, data):
        # Ensure expiry date is after issue date if both are provided
        if 'expiry_date' in data and 'issue_date' in data:
            if data['expiry_date'] < data['issue_date']:
                raise serializers.ValidationError("Expiry date must be after issue date.")
        return data
