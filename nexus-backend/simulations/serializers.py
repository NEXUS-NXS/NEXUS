from rest_framework import serializers
from simulations.models import Simulation, Model, Dataset, Result

class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = ['id', 'name', 'category', 'language', 'code', 'metadata', 'created_at', 'updated_at']

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = '__all__'
        read_only_fields = ['owner', 'size', 'created_at', 'updated_at']

class SimulationSerializer(serializers.ModelSerializer):
    model = ModelSerializer()
    dataset = DatasetSerializer(allow_null=True)

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