# learnhub/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import (
    Expertise, Instructor, Tag, LearningObjective, Prerequisite,
    Course, Module, Lesson, KeyPoint, BulletPoint, CodeExample, Question, CourseEnrollment,
    CourseRating, QuizSubmission,
)
from .serializers import (
    ExpertiseSerializer, InstructorSerializer, TagSerializer,
    LearningObjectiveSerializer, PrerequisiteSerializer, CourseSerializer,
    ModuleSerializer, LessonSerializer, KeyPointSerializer,
    BulletPointSerializer, CodeExampleSerializer, QuestionSerializer, CourseEnrollmentSerializer,
    EnrolledCourseSerializer, CourseRatingSerializer, QuizSubmissionSerializer, CourseCoverImageSerializer,

)
from .permissions import IsInstructor, IsInstructorOrReadOnly

class ExpertiseViewSet(viewsets.ModelViewSet):
    queryset = Expertise.objects.all()
    serializer_class = ExpertiseSerializer
    permission_classes = [IsInstructorOrReadOnly]

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    permission_classes = [IsInstructor]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsInstructorOrReadOnly]

class LearningObjectiveViewSet(viewsets.ModelViewSet):
    queryset = LearningObjective.objects.all()
    serializer_class = LearningObjectiveSerializer
    permission_classes = [IsInstructorOrReadOnly]

class PrerequisiteViewSet(viewsets.ModelViewSet):
    queryset = Prerequisite.objects.all()
    serializer_class = PrerequisiteSerializer
    permission_classes = [IsInstructorOrReadOnly]

from .permissions import IsInstructorOrReadOnly, IsEnrolled, IsInstructorOrEnrolled 
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import status

from .permissions import IsInstructorOrReadOnly, IsEnrolled, IsInstructorOrEnrolled 
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsInstructorOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'difficulty', 'status']

    def get_permissions(self):
        if self.action in ['retrieve', 'preview']:
            # Allow instructor or enrolled users for retrieve, AllowAny for preview
            if self.action == 'retrieve':
                return [IsInstructorOrEnrolled()]
            return [AllowAny()]
        return [IsInstructorOrReadOnly()]

    @action(detail=True, methods=['post'], permission_classes=[IsInstructor])
    def publish(self, request, pk=None):
        course = self.get_object()
        course.status = 'published'
        course.save()
        return Response({'status': 'Course published'})


    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def preview(self, request, pk=None):
        course = self.get_object()
        serializer = CourseSerializer(course, context={'request': request})
        return Response(serializer.data)
    



    # Existing actions (publish, preview) remain unchanged

    @action(detail=True, methods=['patch'], permission_classes=[IsInstructorOrReadOnly], url_path='upload-cover')
    def upload_cover(self, request, pk=None):
        course = self.get_object()
        serializer = CourseCoverImageSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'Cover image uploaded successfully',
                'cover_picture': request.build_absolute_uri(course.cover_picture.url) if course.cover_picture else None
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    @action(detail=True, methods=['get'], permission_classes=[AllowAny], url_path='get-cover')
    def get_cover(self, request, pk=None):
        course = self.get_object()
        return Response({
            'cover_picture': request.build_absolute_uri(course.cover_picture.url) if course.cover_picture else None
        }, status=status.HTTP_200_OK)
    

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsInstructorOrReadOnly]

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        if course_id:
            return Module.objects.filter(course__id=course_id)
        return super().get_queryset()

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsInstructorOrReadOnly]

    def get_queryset(self):
        module_id = self.request.query_params.get('module_id')
        if module_id:
            return Lesson.objects.filter(module__id=module_id)
        return super().get_queryset()

class KeyPointViewSet(viewsets.ModelViewSet):
    queryset = KeyPoint.objects.all()
    serializer_class = KeyPointSerializer
    permission_classes = [IsInstructorOrReadOnly]

class BulletPointViewSet(viewsets.ModelViewSet):
    queryset = BulletPoint.objects.all()
    serializer_class = BulletPointSerializer
    permission_classes = [IsInstructorOrReadOnly]

class CodeExampleViewSet(viewsets.ModelViewSet):
    queryset = CodeExample.objects.all()
    serializer_class = CodeExampleSerializer
    permission_classes = [IsInstructorOrReadOnly]

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsInstructorOrReadOnly]



class CourseEnrollmentViewSet(viewsets.ModelViewSet):
    queryset = CourseEnrollment.objects.all()
    serializer_class = CourseEnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CourseEnrollment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class EnrolledCourseViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EnrolledCourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Course.objects.filter(courseenrollment__user=self.request.user)

class CourseRatingViewSet(viewsets.ModelViewSet):
    queryset = CourseRating.objects.all()
    serializer_class = CourseRatingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class QuizSubmissionViewSet(viewsets.ModelViewSet):
    queryset = QuizSubmission.objects.all()
    serializer_class = QuizSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizSubmission.objects.filter(user=self.request.user)
    




from .models import UserLessonProgress
from .serializers import UserLessonProgressSerializer

class UserLessonProgressViewSet(viewsets.ModelViewSet):
    queryset = UserLessonProgress.objects.all()
    serializer_class = UserLessonProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserLessonProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)




# learnhub/views.py
from rest_framework.permissions import BasePermission

class IsEnrolled(BasePermission):
    def has_object_permission(self, request, view, obj):
        return CourseEnrollment.objects.filter(user=request.user, course=obj).exists()
