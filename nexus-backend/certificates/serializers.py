from rest_framework import serializers
from .models import Certificate, UserCertificate
from learnhub.models import Course as LearnHubCourse

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearnHubCourse
        fields = ['id', 'title', 'description', 'category', 'difficulty', 'instructor']
        read_only_fields = fields

class CertificateSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=LearnHubCourse.objects.all(),
        source='course',
        write_only=True,
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Certificate
        fields = [
            'id', 'title', 'description', 'issuer', 'certificate_type', 
            'course', 'course_id', 'template', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, data):
        certificate_type = data.get('certificate_type', self.instance.certificate_type if self.instance else None)
        course = data.get('course')
        
        if certificate_type == 'course' and not course:
            raise serializers.ValidationError({"course": "Course is required for course completion certificates."})
            
        if course and certificate_type != 'course':
            raise serializers.ValidationError({"course": "Course can only be set for course completion certificates."})
            
        return data

class SimpleUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()

class UserCertificateSerializer(serializers.ModelSerializer):
    certificate_details = CertificateSerializer(source='certificate', read_only=True)
    user_details = SimpleUserSerializer(source='user', read_only=True)
    course_details = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = UserCertificate
        fields = [
            'id', 'user', 'user_details', 'certificate', 'certificate_details',
            'course', 'course_details', 'certificate_file', 'issue_date', 
            'expiry_date', 'status', 'created_at', 'updated_at',
            'verification_code'
        ]
        read_only_fields = [
            'created_at', 'updated_at', 'status', 'verification_code',
            'certificate_details', 'course_details', 'user_details'
        ]
    
    def validate(self, data):
        # Ensure expiry date is after issue date if both are provided
        issue_date = data.get('issue_date', self.instance.issue_date if self.instance else None)
        expiry_date = data.get('expiry_date', self.instance.expiry_date if self.instance else None)
        
        if expiry_date and issue_date and expiry_date < issue_date:
            raise serializers.ValidationError({"expiry_date": "Expiry date must be after issue date."})
            
        # If this is a course certificate, ensure the course is set
        certificate = data.get('certificate', getattr(self.instance, 'certificate', None))
        if certificate and certificate.certificate_type == 'course' and 'course' not in data:
            data['course'] = certificate.course
            
        return data
