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
            serializer = SimulationSerializer(simulation)
            return Response(serializer.data)
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