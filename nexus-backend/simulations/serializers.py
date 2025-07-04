from rest_framework import serializers
from simulations.models import (
    Simulation, Model, Dataset, Result, 
    ModelParameterTemplate, ModelCollaborator, ModelSession, SimulationProgress
)
from django.contrib.auth import get_user_model

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
    """Serializer for basic user information in datasets"""
    avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'avatar']
        read_only_fields = ['id', 'username', 'first_name', 'last_name', 'email', 'avatar']
    
    def get_avatar(self, obj):
        # Return a placeholder or user's actual avatar URL
        return f"/api/users/{obj.id}/avatar/" if hasattr(obj, 'profile') else "/placeholder.svg"


class ModelParameterTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelParameterTemplate
        fields = ['id', 'name', 'description', 'parameters', 'is_default', 'created_at']


class ModelCollaboratorSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    added_by = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = ModelCollaborator
        fields = ['id', 'user', 'permission', 'added_by', 'added_at']


class ModelSessionSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = ModelSession
        fields = ['id', 'user', 'status', 'cursor_position', 'last_activity']


class SimulationProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimulationProgress
        fields = [
            'current_step', 'progress_percentage', 'estimated_completion',
            'steps_completed', 'steps_total', 'detailed_log', 'updated_at'
        ]


class ModelSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    parameter_templates = ModelParameterTemplateSerializer(many=True, read_only=True)
    collaborators = ModelCollaboratorSerializer(many=True, read_only=True)
    active_sessions = serializers.SerializerMethodField()
    
    class Meta:
        model = Model
        fields = [
            'id', 'name', 'category', 'language', 'code', 'metadata', 'owner', 
            'parameter_templates', 'collaborators', 'active_sessions',
            'created_at', 'updated_at'
        ]
    
    def get_active_sessions(self, obj):
        # Get sessions active in the last 5 minutes
        from django.utils import timezone
        from datetime import timedelta
        
        recent_threshold = timezone.now() - timedelta(minutes=5)
        recent_sessions = obj.sessions.filter(last_activity__gte=recent_threshold)
        return ModelSessionSerializer(recent_sessions, many=True).data

class DatasetSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    shared_with = UserBasicSerializer(many=True, read_only=True)
    shared_with_count = serializers.ReadOnlyField()
    quality = serializers.SerializerMethodField()
    preview = serializers.SerializerMethodField()
    
    class Meta:
        model = Dataset
        fields = [
            'id', 'name', 'description', 'long_description',
            'file', 'type', 'size', 'row_count', 'column_count',
            'owner', 'is_public', 'shared_with', 'shared_with_count',
            'source', 'category', 'tags',
            'quality_completeness', 'quality_accuracy', 'quality_consistency', 'quality_timeliness',
            'quality', 'downloads', 'views',
            'schema', 'preview_data', 'preview', 'usage_stats',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['owner', 'shared_with_count', 'downloads', 'views', 'created_at', 'updated_at']
    
    def get_quality(self, obj):
        """Return quality metrics in the format expected by frontend"""
        return {
            'completeness': obj.quality_completeness,
            'accuracy': obj.quality_accuracy,
            'consistency': obj.quality_consistency,
            'timeliness': obj.quality_timeliness,
        }
    
    def get_preview(self, obj):
        """Return preview data in the format expected by frontend"""
        return obj.preview_data

class DatasetCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating datasets"""
    shared_with_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Dataset
        fields = [
            'name', 'description', 'long_description',
            'file', 'type', 'row_count', 'column_count',
            'is_public', 'source', 'category', 'tags',
            'quality_completeness', 'quality_accuracy', 'quality_consistency', 'quality_timeliness',
            'schema', 'preview_data', 'usage_stats', 'shared_with_ids'
        ]
    
    def create(self, validated_data):
        shared_with_ids = validated_data.pop('shared_with_ids', [])
        dataset = Dataset.objects.create(**validated_data)
        
        if shared_with_ids:
            users = User.objects.filter(id__in=shared_with_ids)
            dataset.shared_with.set(users)
        
        return dataset
    
    def update(self, instance, validated_data):
        shared_with_ids = validated_data.pop('shared_with_ids', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if shared_with_ids is not None:
            users = User.objects.filter(id__in=shared_with_ids)
            instance.shared_with.set(users)
        
        return instance

class SimulationSerializer(serializers.ModelSerializer):
    model = ModelSerializer()
    dataset = DatasetSerializer(allow_null=True)
    progress = SimulationProgressSerializer(read_only=True)

    class Meta:
        model = Simulation
        fields = [
            'session_id', 'model', 'parameters', 'dataset',
            'status', 'progress', 'current_step',
            'start_time', 'estimated_completion',
            'created_at', 'updated_at'
        ]


class ResultSerializer(serializers.ModelSerializer):
    simulation = SimulationSerializer()
    
    class Meta:
        model = Result
        fields = ['simulation', 'summary', 'metrics', 'chart_data', 'errors', 'created_at']

class ModelValidationSerializer(serializers.Serializer):
    model_id = serializers.IntegerField(required=False)
    code = serializers.CharField(required=False)
    language = serializers.ChoiceField(choices=['python', 'r', 'dsl'], required=False)
    parameters = serializers.JSONField(default=dict)
    dataset_id = serializers.IntegerField(required=False, allow_null=True)

    def validate(self, data):
        # Ensure either model_id or (code + language) is provided
        if not data.get('model_id') and not (data.get('code') and data.get('language')):
            raise serializers.ValidationError("Either model_id or (code and language) must be provided")
        return data