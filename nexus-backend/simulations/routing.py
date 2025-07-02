from django.urls import re_path
from .consumers import SimulationConsumer

websocket_urlpatterns = [
    re_path(r"ws/simulation/(?P<session_id>\w+)/$", SimulationConsumer.as_asgi()),
]
