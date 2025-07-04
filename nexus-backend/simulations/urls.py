from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from simulations.views import (
    RunSimulationView,
    SimulationStatusView,
    SimulationResultView,
    ModelValidationView,
    ModelViewSet,
    ModelCreateView,
    ModelDetailView,
    ModelUpdateView,
    ModelDeleteView,
    SimulationSessionListView,
    SimulationSessionShareView,
    SharedSessionsView,
    SimulationExportView,
    SimulationProgressView,
    DatasetViewSet,
    ModelParameterTemplateViewSet,
    ModelCollaboratorViewSet,
    ModelSessionViewSet
)

# Main router
router = DefaultRouter()
router.register(r'datasets', DatasetViewSet, basename='datasets')
router.register(r'models', ModelViewSet, basename='models')

# Create nested routers for model-related endpoints
models_router = routers.NestedDefaultRouter(router, r'models', lookup='model')
models_router.register(r'parameters', ModelParameterTemplateViewSet, basename='model-parameters')
models_router.register(r'collaborators', ModelCollaboratorViewSet, basename='model-collaborators')
models_router.register(r'sessions', ModelSessionViewSet, basename='model-sessions')

urlpatterns = [
    # Include dataset and model routes
    path('', include(router.urls)),
    path('', include(models_router.urls)),
    
    # Simulation endpoints
    path('run/', RunSimulationView.as_view(), name='run_simulation'),
    path('<str:session_id>/status/', SimulationStatusView.as_view(), name='simulation_status'),
    path('<str:session_id>/progress/', SimulationProgressView.as_view(), name='simulation_progress'),
    path('<str:session_id>/results/', SimulationResultView.as_view(), name='simulation_results'),
    path('<str:session_id>/export/', SimulationExportView.as_view(), name='simulation_export'),
    
    # Model validation endpoint
    path('models/validate/', ModelValidationView.as_view(), name='model_validate'),
    
    # Session management endpoints
    path('sessions/', SimulationSessionListView.as_view(), name='simulation_sessions'),
    path('sessions/<str:session_id>/share/', SimulationSessionShareView.as_view(), name='simulation_share'),
    path('sessions/shared/', SharedSessionsView.as_view(), name='shared_sessions'),
]
