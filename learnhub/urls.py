# learnhub/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExpertiseViewSet, InstructorViewSet, TagViewSet, LearningObjectiveViewSet,
    PrerequisiteViewSet, CourseViewSet, ModuleViewSet, LessonViewSet,
    KeyPointViewSet, BulletPointViewSet, CodeExampleViewSet, QuestionViewSet,CourseEnrollmentViewSet,
    EnrolledCourseViewSet, CourseRatingViewSet,QuizSubmissionViewSet, UserLessonProgressViewSet,
    
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
router.register(r'enrollments', CourseEnrollmentViewSet)

# These need `basename` because they likely don't have a `.queryset`
router.register(r'enrolled-courses', EnrolledCourseViewSet, basename='enrolled-courses')
router.register(r'ratings', CourseRatingViewSet, basename='ratings')
router.register(r'quiz-submissions', QuizSubmissionViewSet, basename='quiz-submissions')
router.register(r'progress', UserLessonProgressViewSet, basename='progress')

urlpatterns = [
    path('api/', include((router.urls, 'learnhub'), namespace='learnhub')),
]