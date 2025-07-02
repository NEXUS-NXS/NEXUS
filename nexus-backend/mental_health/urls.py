from django.urls import path
from .views import ChatGeminiView, ChatOpenAIView

urlpatterns = [
    path('chat/gemini/', ChatGeminiView.as_view(), name='chat-gemini'),
    path('chat/openai/', ChatOpenAIView.as_view(), name='chat-openai'),
]
