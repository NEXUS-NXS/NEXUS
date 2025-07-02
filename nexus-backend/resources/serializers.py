from rest_framework import serializers
from .models import Resource, Category, ResourceType, Organization
from django.conf import settings


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ResourceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceType
        fields = ['id', 'name']


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name']



class ResourceListSerializer(serializers.ModelSerializer):
    """Serializer for listing resources (with limited fields)."""
    category = serializers.StringRelatedField()
    resource_type = serializers.StringRelatedField()
    organization = serializers.StringRelatedField()
    coverImage = serializers.SerializerMethodField()
    downloadUrl = serializers.SerializerMethodField()
    isPremium = serializers.BooleanField(source='is_premium', read_only=True)
    
    class Meta:
        model = Resource
        fields = [
            'id',
            'title',
            'author',
            'category',
            'resource_type',
            'organization',
            'description',
            'coverImage',
            'isPremium',
            'downloadUrl',
        ]
    
    def get_coverImage(self, obj):
        if obj.cover_image:
            if hasattr(obj.cover_image, 'url'):
                request = self.context.get('request')
                if request is not None:
                    return request.build_absolute_uri(obj.cover_image.url)
                return obj.cover_image.url
            return obj.cover_image  # In case it's already a URL
        return None
    
    def get_downloadUrl(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(f'/api/resources/{obj.id}/download/')
            return f'/api/resources/{obj.id}/download/'
        return obj.download_url


class ResourceDetailSerializer(ResourceListSerializer):
    """Serializer for detailed resource view (includes all fields)."""
    created_by = serializers.StringRelatedField()
    download_count = serializers.IntegerField(read_only=True)
    view_count = serializers.IntegerField(read_only=True)
    
    class Meta(ResourceListSerializer.Meta):
        fields = ResourceListSerializer.Meta.fields + [
            'file', 'created_by', 'created_at', 'updated_at', 
            'download_count', 'view_count', 'is_active'
        ]
        read_only_fields = [
            'created_by', 'created_at', 'updated_at', 
            'download_count', 'view_count'
        ]


class ResourceCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating resources."""
    coverImage = serializers.ImageField(
        source='cover_image', 
        required=False, 
        allow_null=True,
        help_text="Cover image file"
    )
    isPremium = serializers.BooleanField(
        source='is_premium', 
        default=False,
        help_text="Whether this is a premium resource"
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        allow_null=True
    )
    resource_type = serializers.PrimaryKeyRelatedField(
        queryset=ResourceType.objects.all(),
        required=False,
        allow_null=True,
        source='type'
    )
    organization = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Resource
        fields = [
            'title', 'author', 'description', 'category', 'resource_type',
            'organization', 'file', 'coverImage', 'isPremium', 'is_active',
            'download_url'
        ]
        extra_kwargs = {
            'file': {'required': False, 'allow_null': True},
            'download_url': {'required': False, 'allow_blank': True},
        }
    
    def validate(self, attrs):
        """
        Validate that either file or download_url is provided.
        """
        if not attrs.get('file') and not attrs.get('download_url'):
            raise serializers.ValidationError(
                "Either file or download_url must be provided."
            )
        return attrs
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        if 'request' in self.context and hasattr(self.context['request'], 'user'):
            validated_data['created_by'] = self.context['request'].user
        
        # Handle file/URL validation
        if 'file' not in validated_data and 'download_url' not in validated_data:
            raise serializers.ValidationError(
                "Either file or download_url must be provided."
            )
            
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Handle file/URL validation
        if 'file' not in validated_data and 'download_url' not in validated_data:
            if not instance.file and not instance.download_url:
                raise serializers.ValidationError(
                    "Either file or download_url must be provided."
                )
        return super().update(instance, validated_data)
