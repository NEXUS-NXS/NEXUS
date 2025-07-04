# learnhub/permissions.py
from rest_framework.permissions import BasePermission
from .models import CourseEnrollment
from rest_framework import permissions
from rest_framework import permissions
from .models import Instructor, Course, Lesson

class IsInstructorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and Instructor.objects.filter(user=request.user).exists()

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if the user is an instructor
        is_instructor = Instructor.objects.filter(user=request.user).exists()
        if not is_instructor:
            return False

        # Handle different object types
        if isinstance(obj, Course):
            return obj.instructor.user == request.user
        elif isinstance(obj, Lesson):
            return obj.module.course.instructor.user == request.user
        return False
    
    
class IsInstructor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated 

# class IsInstructorOrReadOnly(BasePermission):
#     def has_object_permission(self, request, view, obj):
#         if request.method in permissions.SAFE_METHODS:
#             return True  # Allow GET, HEAD, OPTIONS for all
#         return obj.instructor.user == request.user and request.user.userprofile.is_instructor 
# #after defining this you can include it: hasattr(request.user, 'instructor')

# learnhub/permissions.py
from .models import CourseEnrollment

class IsInstructorOrEnrolled(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow access if the user is the course instructor
        if obj.instructor.user == request.user:
            return True
        # Allow access if the user is enrolled
        return CourseEnrollment.objects.filter(user=request.user, course=obj).exists()
    

# learnhub/views.py
class IsEnrolled(BasePermission):
    def has_object_permission(self, request, view, obj):
        return CourseEnrollment.objects.filter(user=request.user, course=obj).exists()