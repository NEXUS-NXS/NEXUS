from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
import uuid
from django.db.models import Q
from simulations.models import Simulation, Model, Dataset, Result
from simulations.serializers import (
    SimulationSerializer, ResultSerializer, ModelSerializer, 
    ModelValidationSerializer, DatasetSerializer, DatasetCreateSerializer
)
from simulations.tasks import run_simulation_task
from simulations.engine import SimulationEngine
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from django.http import FileResponse
from .serializers import DatasetSerializer
from django.db.models import Q


class DatasetViewSet(viewsets.ModelViewSet):
    queryset = Dataset.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'category', 'tags']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DatasetCreateSerializer
        return DatasetSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        file = self.request.FILES.get('file')
        size = file.size if file else 0
        
        # Auto-detect file type if not provided
        file_type = serializer.validated_data.get('type', '')
        if not file_type and file:
            if file.name.endswith('.csv'):
                file_type = 'CSV'
            elif file.name.endswith(('.xlsx', '.xls')):
                file_type = 'Excel'
            elif file.name.endswith('.json'):
                file_type = 'JSON'
            else:
                file_type = 'File'
        
        serializer.save(owner=self.request.user, size=size, type=file_type)

    def get_queryset(self):
        user = self.request.user
        queryset = Dataset.objects.all()
        
        # Filter by user permissions
        if user.is_authenticated:
            queryset = queryset.filter(
                Q(owner=user) | Q(is_public=True) | Q(shared_with=user)
            ).distinct()
        else:
            queryset = queryset.filter(is_public=True)
        
        # Filter by category if provided
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by type if provided
        dataset_type = self.request.query_params.get('type')
        if dataset_type:
            queryset = queryset.filter(type=dataset_type)
        
        # Filter by owner if provided
        owner = self.request.query_params.get('owner')
        if owner:
            queryset = queryset.filter(owner__username=owner)
        
        return queryset

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to increment view count"""
        instance = self.get_object()
        
        # Increment view count
        instance.increment_views()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='share')
    def share_dataset(self, request, pk=None):
        """Share dataset with specific users or make public"""
        dataset = self.get_object()
        
        # Check if user owns the dataset
        if dataset.owner != request.user:
            return Response({'error': 'Permission denied'}, status=403)
        
        user_ids = request.data.get('user_ids', [])
        make_public = request.data.get('make_public', False)
        
        if make_public:
            dataset.is_public = True
            dataset.save()
        
        if user_ids:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            users = User.objects.filter(id__in=user_ids)
            dataset.shared_with.add(*users)
        
        return Response({'status': 'shared', 'shared_with_count': dataset.shared_with_count})

    @action(detail=True, methods=['get'], url_path='download')
    def download(self, request, pk=None):
        """Download dataset file and increment download count"""
        dataset = self.get_object()
        
        # Check permissions
        user = request.user
        if not (dataset.is_public or 
                (user.is_authenticated and (dataset.owner == user or dataset.shared_with.filter(id=user.id).exists()))):
            return Response({'error': 'Permission denied'}, status=403)
        
        # Increment download count
        dataset.increment_downloads()
        
        if dataset.file:
            response = FileResponse(
                dataset.file.open(),
                as_attachment=True,
                filename=dataset.file.name
            )
            return response
        else:
            return Response({'error': 'No file available for download'}, status=404)

    @action(detail=False, methods=['get'], url_path='my-datasets')
    def my_datasets(self, request):
        """Get datasets owned by current user"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)
        
        datasets = Dataset.objects.filter(owner=request.user)
        serializer = self.get_serializer(datasets, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='shared-with-me')
    def shared_with_me(self, request):
        """Get datasets shared with current user"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)
        
        datasets = Dataset.objects.filter(shared_with=request.user)
        serializer = self.get_serializer(datasets, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='update-quality')
    def update_quality_metrics(self, request, pk=None):
        """Update quality metrics for a dataset"""
        dataset = self.get_object()
        
        if dataset.owner != request.user:
            return Response({'error': 'Permission denied'}, status=403)
        
        quality_data = request.data.get('quality', {})
        
        if 'completeness' in quality_data:
            dataset.quality_completeness = quality_data['completeness']
        if 'accuracy' in quality_data:
            dataset.quality_accuracy = quality_data['accuracy']
        if 'consistency' in quality_data:
            dataset.quality_consistency = quality_data['consistency']
        if 'timeliness' in quality_data:
            dataset.quality_timeliness = quality_data['timeliness']
        
        dataset.save()
        
        serializer = self.get_serializer(dataset)
        return Response(serializer.data)
    def download(self, request, pk=None):
        dataset = self.get_object()
        return FileResponse(dataset.file.open(), as_attachment=True, filename=dataset.file.name.split('/')[-1])


class RunSimulationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        model_id = request.data.get('model_id')
        parameters = request.data.get('parameters', {})
        dataset_id = request.data.get('dataset_id', None)
        
        try:
            model = Model.objects.get(id=model_id)
            dataset = Dataset.objects.get(id=dataset_id) if dataset_id else None
            simulation = Simulation.objects.create(
                session_id=str(uuid.uuid4()),
                model=model,
                parameters=parameters,
                dataset=dataset,
                user=request.user
            )
            run_simulation_task.delay(simulation.session_id)
            serializer = SimulationSerializer(simulation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Model.DoesNotExist:
            return Response({'error': 'Model not found'}, status=status.HTTP_404_NOT_FOUND)
        except Dataset.DoesNotExist:
            return Response({'error': 'Dataset not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SimulationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        try:
            simulation = Simulation.objects.get(session_id=session_id, user=request.user)
            return Response({
                "status": simulation.status,
                "progress": simulation.progress,
                "current_step": simulation.current_step,
                "start_time": simulation.start_time,
                "estimated_completion": simulation.estimated_completion,
            })
        except Simulation.DoesNotExist:
            return Response({'error': 'Simulation not found or not authorized'}, status=status.HTTP_404_NOT_FOUND)


class SimulationResultView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        try:
            simulation = Simulation.objects.get(session_id=session_id, user=request.user)
            result = Result.objects.filter(simulation=simulation).first()
            if not result:
                return Response({'error': 'Result not available yet'}, status=status.HTTP_404_NOT_FOUND)
            serializer = ResultSerializer(result)
            return Response(serializer.data)
        except Simulation.DoesNotExist:
            return Response({'error': 'Simulation not found or not authorized'}, status=status.HTTP_404_NOT_FOUND)

class ModelValidationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ModelValidationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        try:
            if data.get('model_id'):
                model = Model.objects.get(id=data['model_id'])
            else:
                model = Model(
                    name='Temp Model',
                    category='actuarial',
                    language=data['language'],
                    code=data['code'],
                    owner=request.user
                )
            
            simulation = Simulation(
                session_id=str(uuid.uuid4()),
                model=model,
                parameters=data['parameters'],
                dataset=Dataset.objects.get(id=data['dataset_id']) if data.get('dataset_id') else None,
                user=request.user
            )
            engine = SimulationEngine(simulation)
            errors = engine.validate()
            if errors:
                return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'status': 'valid', 'message': 'Model and parameters are valid'})
        except Model.DoesNotExist:
            return Response({'error': 'Model not found'}, status=status.HTTP_404_NOT_FOUND)
        except Dataset.DoesNotExist:
            return Response({'error': 'Dataset not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ModelListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ModelSerializer

    def get_queryset(self):
        queryset = Model.objects.filter(Q(owner=self.request.user) | Q(owner__isnull=True))
        category = self.request.query_params.get('category')
        language = self.request.query_params.get('language')
        if category:
            queryset = queryset.filter(category=category)
        if language:
            queryset = queryset.filter(language=language)
        return queryset

class ModelCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# NEW MISSING ENDPOINTS

class ModelDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            model = Model.objects.get(
                pk=pk, 
                owner__in=[request.user, None]  # User's models or public models
            )
            serializer = ModelSerializer(model)
            return Response(serializer.data)
        except Model.DoesNotExist:
            return Response({'error': 'Model not found or access denied'}, status=status.HTTP_404_NOT_FOUND)


class ModelUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            model = Model.objects.get(pk=pk, owner=request.user)
            serializer = ModelSerializer(model, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Model.DoesNotExist:
            return Response({'error': 'Model not found or access denied'}, status=status.HTTP_404_NOT_FOUND)


class ModelDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            model = Model.objects.get(pk=pk, owner=request.user)
            model.delete()
            return Response({'message': 'Model deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Model.DoesNotExist:
            return Response({'error': 'Model not found or access denied'}, status=status.HTTP_404_NOT_FOUND)


class SimulationSessionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        simulations = Simulation.objects.filter(user=request.user).order_by('-created_at')
        serializer = SimulationSerializer(simulations, many=True)
        return Response(serializer.data)


class SimulationSessionShareView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        try:
            simulation = Simulation.objects.get(session_id=session_id, user=request.user)
            # Add sharing logic here - you might want to add a shared_with field to Simulation model
            # For now, we'll just mark it as shareable
            return Response({'message': 'Session shared successfully', 'share_url': f'/shared/{session_id}'})
        except Simulation.DoesNotExist:
            return Response({'error': 'Simulation not found or access denied'}, status=status.HTTP_404_NOT_FOUND)


class SharedSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # This would need a shared_with field in Simulation model
        # For now, return empty list - you can enhance this later
        return Response([])


class SimulationExportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        try:
            simulation = Simulation.objects.get(session_id=session_id, user=request.user)
            result = Result.objects.filter(simulation=simulation).first()
            
            if not result:
                return Response({'error': 'No results available for export'}, status=status.HTTP_404_NOT_FOUND)
            
            # For now, return JSON data that frontend can convert to PDF
            # You can implement actual PDF generation later
            export_data = {
                'simulation_id': session_id,
                'model_name': simulation.model.name,
                'parameters': simulation.parameters,
                'results': result.data,
                'created_at': simulation.created_at,
                'export_format': request.query_params.get('format', 'json')
            }
            
            return Response(export_data)
            
        except Simulation.DoesNotExist:
            return Response({'error': 'Simulation not found or access denied'}, status=status.HTTP_404_NOT_FOUND)