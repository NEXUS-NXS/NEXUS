# # learnhub/views.py
# from rest_framework import viewsets
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from django_filters.rest_framework import DjangoFilterBackend
# from .models import (
#     Expertise, Instructor, Tag, LearningObjective, Prerequisite,
#     Course, Module, Lesson, KeyPoint, BulletPoint, CodeExample, Question
# )
# from .serializers import (
#     ExpertiseSerializer, InstructorSerializer, TagSerializer,
#     LearningObjectiveSerializer, PrerequisiteSerializer, CourseSerializer,
#     ModuleSerializer, LessonSerializer, KeyPointSerializer,
#     BulletPointSerializer, CodeExampleSerializer, QuestionSerializer
# )
# from .permissions import IsInstructor, IsInstructorOrReadOnly

# class ExpertiseViewSet(viewsets.ModelViewSet):
#     queryset = Expertise.objects.all()
#     serializer_class = ExpertiseSerializer
#     permission_classes = [IsInstructorOrReadOnly]

# class InstructorViewSet(viewsets.ModelViewSet):
#     queryset = Instructor.objects.all()
#     serializer_class = InstructorSerializer
#     permission_classes = [IsInstructor]

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)

# class TagViewSet(viewsets.ModelViewSet):
#     queryset = Tag.objects.all()
#     serializer_class = TagSerializer
#     permission_classes = [IsInstructorOrReadOnly]

# class LearningObjectiveViewSet(viewsets.ModelViewSet):
#     queryset = LearningObjective.objects.all()
#     serializer_class = LearningObjectiveSerializer
#     permission_classes = [IsInstructorOrReadOnly]

# class PrerequisiteViewSet(viewsets.ModelViewSet):
#     queryset = Prerequisite.objects.all()
#     serializer_class = PrerequisiteSerializer
#     permission_classes = [IsInstructorOrReadOnly]

# class CourseViewSet(viewsets.ModelViewSet):
#     queryset = Course.objects.all()
#     serializer_class = CourseSerializer
#     permission_classes = [IsInstructorOrReadOnly]
#     filter_backends = [DjangoFilterBackend]
#     filterset_fields = ['category', 'difficulty', 'status']

#     @action(detail=True, methods=['post'], permission_classes=[IsInstructor])
#     def publish(self, request, pk=None):
#         course = self.get_object()
#         course.status = 'published'
#         course.save()
#         return Response({'status': 'Course published'})

#     @action(detail=True, methods=['get'])
#     def preview(self, request, pk=None):
#         course = self.get_object()
#         serializer = self.get_serializer(course)
#         return Response(serializer.data)

# class ModuleViewSet(viewsets.ModelViewSet):
#     queryset = Module.objects.all()
#     serializer_class = ModuleSerializer
#     permission_classes = [IsInstructorOrReadOnly]

#     def get_queryset(self):
#         course_id = self.request.query_params.get('course_id')
#         if course_id:
#             return Module.objects.filter(course__id=course_id)
#         return super().get_queryset()

# class LessonViewSet(viewsets.ModelViewSet):
#     queryset = Lesson.objects.all()
#     serializer_class = LessonSerializer
#     permission_classes = [IsInstructorOrReadOnly]

#     def get_queryset(self):
#         module_id = self.request.query_params.get('module_id')
#         if module_id:
#             return Lesson.objects.filter(module__id=module_id)
#         return super().get_queryset()

# class KeyPointViewSet(viewsets.ModelViewSet):
#     queryset = KeyPoint.objects.all()
#     serializer_class = KeyPointSerializer
#     permission_classes = [IsInstructorOrReadOnly]

# class BulletPointViewSet(viewsets.ModelViewSet):
#     queryset = BulletPoint.objects.all()
#     serializer_class = BulletPointSerializer
#     permission_classes = [IsInstructorOrReadOnly]

# class CodeExampleViewSet(viewsets.ModelViewSet):
#     queryset = CodeExample.objects.all()
#     serializer_class = CodeExampleSerializer
#     permission_classes = [IsInstructorOrReadOnly]

# class QuestionViewSet(viewsets.ModelViewSet):
#     queryset = Question.objects.all()
#     serializer_class = QuestionSerializer
#     permission_classes = [IsInstructorOrReadOnly]