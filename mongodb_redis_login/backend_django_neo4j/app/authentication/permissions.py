from rest_framework.permissions import (
    BasePermission,
)


class IsAuthenticatedUser(BasePermission):
    message = "로그인이 필요합니다."

    def has_permission(
        self,
        request,
        view,
    ) -> bool:
        return bool(
            request.user
            and getattr(
                request.user,
                "is_authenticated",
                False,
            )
        )