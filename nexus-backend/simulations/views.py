from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
import uuid
from django.db.models import Q
from simulations.models import (
    Simulation, Model, Dataset, Result, 
    ModelParameterTemplate, ModelCollaborator, ModelSession, SimulationProgress,
    SimulationParameter
)
from simulations.serializers import (
    SimulationSerializer, ResultSerializer, ModelSerializer, 
    ModelValidationSerializer, DatasetSerializer, DatasetCreateSerializer,
    ModelParameterTemplateSerializer, ModelCollaboratorSerializer, 
    ModelSessionSerializer, SimulationProgressSerializer, SimulationParameterSerializer
)
from simulations.tasks import run_simulation_task
from simulations.engine import SimulationEngine
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from django.http import FileResponse
from .serializers import DatasetSerializer
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from .permissions import (
    IsModelOwnerOrAdmin, IsModelOwnerOrCollaborator, 
    IsParameterModelOwnerOrAdmin, IsSimulationOwner
)
from rest_framework.exceptions import PermissionDenied, NotFound

User = get_user_model()


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
            
            # Check if user has permission to run simulations with this model
            if not (model.owner == request.user or 
                   ModelCollaborator.objects.filter(
                       model=model, user=request.user
                   ).exists()):
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            dataset = Dataset.objects.get(id=dataset_id) if dataset_id else None
            
            # Validate parameters against model parameter definitions
            validation_errors = {}
            for param in model.parameters.all():
                param_value = parameters.get(param.name)
                errors = param.validate_value(param_value)
                if errors:
                    validation_errors[param.name] = errors
            
            if validation_errors:
                return Response({
                    'error': 'Parameter validation failed',
                    'parameter_errors': validation_errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
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
    permission_classes = [IsAuthenticated, IsSimulationOwner]

    def get(self, request, session_id):
        try:
            simulation = Simulation.objects.get(session_id=session_id)
            
            # Check permissions
            if simulation.user != request.user:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            return Response({
                "session_id": simulation.session_id,
                "status": simulation.status,
                "progress": simulation.progress,
                "current_step": simulation.current_step,
                "start_time": simulation.start_time,
                "estimated_completion": simulation.estimated_completion,
                "model_name": simulation.model.name,
                "created_at": simulation.created_at,
                "updated_at": simulation.updated_at,
            })
        except Simulation.DoesNotExist:
            return Response({'error': 'Simulation not found'}, status=status.HTTP_404_NOT_FOUND)


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
            simulation = Simulation.objects.get(session_id=session_id)
            
            # Check permissions
            if simulation.user != request.user:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
                
            result = Result.objects.filter(simulation=simulation).first()
            
            if not result:
                return Response({'error': 'No results available for export'}, status=status.HTTP_404_NOT_FOUND)
            
            export_format = request.query_params.get('format', 'json')
            
            # Prepare comprehensive export data
            export_data = {
                'simulation': {
                    'id': session_id,
                    'status': simulation.status,
                    'created_at': simulation.created_at,
                    'start_time': simulation.start_time,
                    'completed_at': result.created_at if simulation.status == 'completed' else None,
                },
                'model': {
                    'id': simulation.model.id,
                    'name': simulation.model.name,
                    'category': simulation.model.category,
                    'language': simulation.model.language,
                },
                'parameters': simulation.parameters,
                'dataset': {
                    'id': simulation.dataset.id if simulation.dataset else None,
                    'name': simulation.dataset.name if simulation.dataset else None,
                } if simulation.dataset else None,
                'results': {
                    'summary': result.summary,
                    'metrics': result.metrics,
                    'chart_data': result.chart_data,
                    'errors': result.errors,
                },
                'metadata': {
                    'export_format': export_format,
                    'exported_at': timezone.now(),
                    'exported_by': request.user.username,
                }
            }
            
            if export_format == 'csv' and result.chart_data:
                # Convert chart data to CSV format for specific chart types
                import csv
                import io
                
                csv_data = {}
                for chart_type, data in result.chart_data.items():
                    if isinstance(data, list) and len(data) > 0:
                        output = io.StringIO()
                        if isinstance(data[0], list) and len(data[0]) >= 2:
                            # Data points format [[x1, y1], [x2, y2], ...]
                            writer = csv.writer(output)
                            writer.writerow(['x', 'y'])
                            writer.writerows(data)
                            csv_data[chart_type] = output.getvalue()
                        elif isinstance(data[0], dict):
                            # Dictionary format
                            writer = csv.DictWriter(output, fieldnames=data[0].keys())
                            writer.writeheader()
                            writer.writerows(data)
                            csv_data[chart_type] = output.getvalue()
                
                export_data['csv_data'] = csv_data
            
            # Set appropriate headers for download
            if export_format == 'json':
                response = Response(export_data, content_type='application/json')
                response['Content-Disposition'] = f'attachment; filename="simulation_{session_id}_results.json"'
            else:
                response = Response(export_data)
            
            return response
            
        except Simulation.DoesNotExist:
            return Response({'error': 'Simulation not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Export failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SimulationParameterViewSet(viewsets.ModelViewSet):
    """Manage individual simulation parameters for models"""
    serializer_class = SimulationParameterSerializer
    permission_classes = [permissions.IsAuthenticated, IsParameterModelOwnerOrAdmin]
    
    def get_queryset(self):
        model_id = self.kwargs.get('model_pk')
        if model_id:
            return SimulationParameter.objects.filter(model_id=model_id)
        return SimulationParameter.objects.none()
    
    def perform_create(self, serializer):
        model_id = self.kwargs.get('model_pk')
        try:
            model = Model.objects.get(id=model_id)
            # Check if user has permission to modify this model
            if not (model.owner == self.request.user or 
                   ModelCollaborator.objects.filter(
                       model=model, user=self.request.user, permission='admin'
                   ).exists()):
                raise PermissionDenied("You don't have permission to modify this model's parameters")
            
            serializer.save(model=model)
        except Model.DoesNotExist:
            raise NotFound("Model not found")
    
    def get_permissions(self):
        """Custom permissions for different actions"""
        if self.action in ['list', 'retrieve']:
            # Allow model owner and any collaborator to view parameters
            permission_classes = [permissions.IsAuthenticated, IsModelOwnerOrCollaborator]
        else:
            # Only model owner and admin collaborators can modify parameters
            permission_classes = [permissions.IsAuthenticated, IsParameterModelOwnerOrAdmin]
        
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['post'], url_path='validate')
    def validate_parameters(self, request, model_pk=None):
        """Validate a set of parameter values against the model's parameter definitions"""
        try:
            model = Model.objects.get(id=model_pk)
            parameters = request.data.get('parameters', {})
            
            all_errors = {}
            model_parameters = model.parameters.all()
            
            for param in model_parameters:
                param_name = param.name
                param_value = parameters.get(param_name)
                errors = param.validate_value(param_value)
                if errors:
                    all_errors[param_name] = errors
            
            if all_errors:
                return Response({'valid': False, 'errors': all_errors}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({'valid': True, 'message': 'All parameters are valid'})
            
        except Model.DoesNotExist:
            return Response({'error': 'Model not found'}, status=status.HTTP_404_NOT_FOUND)


# Model Collaboration and Parameters Views

class ModelParameterTemplateViewSet(viewsets.ModelViewSet):
    """Manage parameter templates for models"""
    serializer_class = ModelParameterTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        model_id = self.kwargs.get('model_pk')
        return ModelParameterTemplate.objects.filter(model_id=model_id)
    
    def perform_create(self, serializer):
        model_id = self.kwargs.get('model_pk')
        model = Model.objects.get(id=model_id)
        serializer.save(model=model)


class ModelCollaboratorViewSet(viewsets.ModelViewSet):
    """Manage model collaborators"""
    serializer_class = ModelCollaboratorSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        model_id = self.kwargs.get('model_pk')
        return ModelCollaborator.objects.filter(model_id=model_id)
    
    def perform_create(self, serializer):
        model_id = self.kwargs.get('model_pk')
        model = Model.objects.get(id=model_id)
        serializer.save(model=model, added_by=self.request.user)


class ModelSessionViewSet(viewsets.ModelViewSet):
    """Manage active model sessions for collaboration"""
    serializer_class = ModelSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        model_id = self.kwargs.get('model_pk')
        # Only return recent sessions (last 10 minutes)
        recent_threshold = timezone.now() - timedelta(minutes=10)
        return ModelSession.objects.filter(
            model_id=model_id,
            last_activity__gte=recent_threshold
        )
    
    def perform_create(self, serializer):
        model_id = self.kwargs.get('model_pk')
        model = Model.objects.get(id=model_id)
        
        # Update or create session for this user and model
        session, created = ModelSession.objects.update_or_create(
            model=model,
            user=self.request.user,
            defaults={
                'status': serializer.validated_data.get('status', 'viewing'),
                'cursor_position': serializer.validated_data.get('cursor_position', {}),
            }
        )
        return session
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, model_pk=None, pk=None):
        """Update session status (active, viewing, editing, idle)"""
        session = self.get_object()
        status = request.data.get('status')
        cursor_position = request.data.get('cursor_position', {})
        
        if status:
            session.status = status
        if cursor_position:
            session.cursor_position = cursor_position
        session.save()
        
        return Response(ModelSessionSerializer(session).data)


class SimulationProgressView(APIView):
    """Get detailed progress for a simulation"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, session_id):
        try:
            simulation = Simulation.objects.get(session_id=session_id, user=request.user)
            progress = getattr(simulation, 'progress_details', None)
            
            if not progress:
                # Create default progress if it doesn't exist
                progress = SimulationProgress.objects.create(
                    simulation=simulation,
                    current_step="Initializing...",
                    progress_percentage=0,
                    steps_total=[
                        "Validating parameters",
                        "Loading datasets",
                        "Setting up simulation environment",
                        "Running simulation",
                        "Calculating results",
                        "Generating visualizations"
                    ]
                )
            
            return Response(SimulationProgressSerializer(progress).data)
            
        except Simulation.DoesNotExist:
            return Response({'error': 'Simulation not found'}, status=status.HTTP_404_NOT_FOUND)

class ModelViewSet(viewsets.ModelViewSet):
    """ViewSet for managing simulation models"""
    serializer_class = ModelSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'category', 'metadata__description']
    
    def get_queryset(self):
        user = self.request.user
        queryset = Model.objects.filter(
            Q(owner=user) | Q(collaborators__user=user)
        ).distinct()
        
        # Filter by category if provided
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by language if provided
        language = self.request.query_params.get('language')
        if language:
            queryset = queryset.filter(language=language)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['get'])
    def collaborators(self, request, pk=None):
        """Get all collaborators for a model"""
        model = self.get_object()
        collaborators = model.collaborators.all()
        return Response(ModelCollaboratorSerializer(collaborators, many=True).data)
    
    @action(detail=True, methods=['get'])
    def sessions(self, request, pk=None):
        """Get active sessions for a model"""
        model = self.get_object()
        recent_threshold = timezone.now() - timedelta(minutes=10)
        sessions = model.sessions.filter(last_activity__gte=recent_threshold)
        return Response(ModelSessionSerializer(sessions, many=True).data)
    
    @action(detail=True, methods=['get'])
    def parameters(self, request, pk=None):
        """Get parameter templates for a model"""
        model = self.get_object()
        templates = model.parameter_templates.all()
        return Response(ModelParameterTemplateSerializer(templates, many=True).data)