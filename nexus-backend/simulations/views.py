from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
import uuid
from django.db.models import Q
from simulations.models import Simulation, Model, Dataset, Result
from simulations.serializers import SimulationSerializer, ResultSerializer, ModelSerializer, ModelValidationSerializer
from simulations.tasks import run_simulation_task
from simulations.engine import SimulationEngine
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from django.http import FileResponse
from .serializers import DatasetSerializer
from django.db.models import Q


class DatasetViewSet(viewsets.ModelViewSet):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_permissions(self):
        if self.action in ['create', 'destroy', 'share']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        file = self.request.FILES.get('file')
        size = file.size if file else 0
        serializer.save(owner=self.request.user, size=size)

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Dataset.objects.filter(Q(owner=user) | Q(is_public=True))
        return Dataset.objects.filter(is_public=True)

    @action(detail=False, methods=['post'], url_path='share')
    def share(self, request):
        dataset_id = request.data.get('dataset_id')
        dataset = Dataset.objects.filter(id=dataset_id, owner=request.user).first()
        if not dataset:
            return Response({'error': 'Dataset not found or permission denied'}, status=403)
        dataset.is_public = True
        dataset.save()
        return Response({'status': 'shared'})

    @action(detail=True, methods=['get'], url_path='download')
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