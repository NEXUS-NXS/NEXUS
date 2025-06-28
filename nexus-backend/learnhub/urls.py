# learnhub/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExpertiseViewSet, InstructorViewSet, TagViewSet, LearningObjectiveViewSet,
    PrerequisiteViewSet, CourseViewSet, ModuleViewSet, LessonViewSet,
    KeyPointViewSet, BulletPointViewSet, CodeExampleViewSet, QuestionViewSet
)

router = DefaultRouter()
router.register(r'expertise', ExpertiseViewSet)
router.register(r'instructors', InstructorViewSet)
router.register(r'tags', TagViewSet)
router.register(r'learning-objectives', LearningObjectiveViewSet)
router.register(r'prerequisites', PrerequisiteViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'modules', ModuleViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'keypoints', KeyPointViewSet)
router.register(r'bullets', BulletPointViewSet)
router.register(r'code-examples', CodeExampleViewSet)
router.register(r'questions', QuestionViewSet)

app_name = "learnhub"
urlpatterns = [
    path('api/', include((router.urls, 'learnhub'), namespace='learnhub')),
]