from django.urls import path, include
from rest_framework.routers import DefaultRouter
from simulations.views import (
    RunSimulationView,
    SimulationStatusView,
    SimulationResultView,
    ModelValidationView,
    ModelListView,
    ModelCreateView,
    ModelDetailView,
    ModelUpdateView,
    ModelDeleteView,
    SimulationSessionListView,
    SimulationSessionShareView,
    SharedSessionsView,
    SimulationExportView,
    DatasetViewSet
)
router = DefaultRouter()
router.register(r'datasets', DatasetViewSet, basename='datasets')

urlpatterns = [
    # Include dataset routes
    path('', include(router.urls)),
    
    # Simulation endpoints
    path('run/', RunSimulationView.as_view(), name='run_simulation'),
    path('<str:session_id>/status/', SimulationStatusView.as_view(), name='simulation_status'),
    path('<str:session_id>/results/', SimulationResultView.as_view(), name='simulation_results'),
    path('<str:session_id>/export/', SimulationExportView.as_view(), name='simulation_export'),
    
    # Model endpoints
    path('models/', ModelListView.as_view(), name='model_list'),
    path('models/create/', ModelCreateView.as_view(), name='model_create'),
    path('models/validate/', ModelValidationView.as_view(), name='model_validate'),
    path('models/<int:pk>/', ModelDetailView.as_view(), name='model_detail'),
    path('models/<int:pk>/update/', ModelUpdateView.as_view(), name='model_update'),
    path('models/<int:pk>/delete/', ModelDeleteView.as_view(), name='model_delete'),
    
    # Session management endpoints
    path('sessions/', SimulationSessionListView.as_view(), name='simulation_sessions'),
    path('sessions/<str:session_id>/share/', SimulationSessionShareView.as_view(), name='simulation_share'),
    path('sessions/shared/', SharedSessionsView.as_view(), name='shared_sessions'),
]
