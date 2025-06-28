# # learnhub/permissions.py
# from rest_framework.permissions import BasePermission

# class IsInstructor(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_authenticated 

# class IsInstructorOrReadOnly(BasePermission):
#     def has_permission(self, request, view):
#         if request.method in ('GET', 'HEAD', 'OPTIONS'):
#             return True
#         return request.user.is_authenticated
    
# #after defining this you can include it: hasattr(request.user, 'instructor')