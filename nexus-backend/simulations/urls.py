from django.urls import path
from simulations.views import (
    RunSimulationView,
    SimulationStatusView,
    SimulationResultView,
    ModelValidationView,
    ModelListView,
    ModelCreateView
)

urlpatterns = [
    path('run/', RunSimulationView.as_view(), name='run_simulation'),
    path('<str:session_id>/status/', SimulationStatusView.as_view(), name='simulation_status'),
    path('<str:session_id>/results/', SimulationResultView.as_view(), name='simulation_results'),
    path('models/validate/', ModelValidationView.as_view(), name='model_validate'),
    path('models/', ModelListView.as_view(), name='model_list'),
    path('models/create/', ModelCreateView.as_view(), name='model_create'),
]