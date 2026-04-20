from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Leitura permitida para qualquer requisicao.
    Escrita restrita a usuarios com is_staff=True.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)
