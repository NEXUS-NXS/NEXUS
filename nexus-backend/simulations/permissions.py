from rest_framework import permissions
from .models import Model, ModelCollaborator


class IsModelOwnerOrAdmin(permissions.BasePermission):
    """
    Permission to check if user is the model owner or has admin privileges
    """
    def has_object_permission(self, request, view, obj):
        # Check if obj is a Model
        if hasattr(obj, 'owner'):
            model = obj
        elif hasattr(obj, 'model'):
            model = obj.model
        else:
            return False
        
        # Model owner has full access
        if model.owner == request.user:
            return True
        
        # Check if user is a collaborator with admin permission
        try:
            collaboration = ModelCollaborator.objects.get(
                model=model, 
                user=request.user, 
                permission='admin'
            )
            return True
        except ModelCollaborator.DoesNotExist:
            return False


class IsModelOwnerOrCollaborator(permissions.BasePermission):
    """
    Permission to check if user is the model owner or any collaborator
    """
    def has_object_permission(self, request, view, obj):
        # Check if obj is a Model
        if hasattr(obj, 'owner'):
            model = obj
        elif hasattr(obj, 'model'):
            model = obj.model
        else:
            return False
        
        # Model owner has full access
        if model.owner == request.user:
            return True
        
        # Check if user is any kind of collaborator
        try:
            ModelCollaborator.objects.get(model=model, user=request.user)
            return True
        except ModelCollaborator.DoesNotExist:
            return False


class IsModelOwnerOrReadOnlyCollaborator(permissions.BasePermission):
    """
    Permission for read operations - allows model owner and collaborators,
    but only owner can modify
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Check if obj is a Model
        if hasattr(obj, 'owner'):
            model = obj
        elif hasattr(obj, 'model'):
            model = obj.model
        else:
            return False
        
        # Read permissions for model owner and collaborators
        if request.method in permissions.SAFE_METHODS:
            # Model owner has access
            if model.owner == request.user:
                return True
            
            # Check if user is a collaborator
            try:
                ModelCollaborator.objects.get(model=model, user=request.user)
                return True
            except ModelCollaborator.DoesNotExist:
                return False
        
        # Write permissions only for model owner or admin collaborators
        if model.owner == request.user:
            return True
        
        try:
            collaboration = ModelCollaborator.objects.get(
                model=model, 
                user=request.user, 
                permission__in=['admin', 'edit']
            )
            return True
        except ModelCollaborator.DoesNotExist:
            return False


class IsParameterModelOwnerOrAdmin(permissions.BasePermission):
    """
    Permission specifically for parameter management - only model owners and admin collaborators
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # For parameter objects, get the model
        if hasattr(obj, 'model'):
            model = obj.model
        else:
            return False
        
        # Model owner has full access
        if model.owner == request.user:
            return True
        
        # Only admin collaborators can manage parameters
        try:
            ModelCollaborator.objects.get(
                model=model, 
                user=request.user, 
                permission='admin'
            )
            return True
        except ModelCollaborator.DoesNotExist:
            return False


class IsSimulationOwner(permissions.BasePermission):
    """
    Permission to check if user owns the simulation
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user