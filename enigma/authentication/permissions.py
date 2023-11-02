from rest_framework.permissions import BasePermission

from authentication.models import ADMIN, SUPER_ADMIN


class IsSuperUser(BasePermission):
    """
    Allows access only to admin users.
    """

    def has_permission(self, request, _):
        return bool(request.user and (request.user.user_type == ADMIN or request.user.user_type == SUPER_ADMIN))
