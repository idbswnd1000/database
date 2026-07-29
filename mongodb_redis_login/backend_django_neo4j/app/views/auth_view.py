from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import (
    AllowAny,
)
from rest_framework.response import (
    Response,
)

from app.authentication.permissions import (
    IsAuthenticatedUser,
)
from app.schemas.auth_schema import (
    LoginSerializer,
    LogoutSerializer,
    RefreshSerializer,
    RegisterSerializer,
)
from app.services.auth_service import (
    get_current_user,
    login_user,
    logout_user,
    refresh_access_token,
    register_user,
)


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(
        data=request.data
    )

    serializer.is_valid(
        raise_exception=True
    )

    user = register_user(
        serializer.validated_data
    )

    return Response(
        {
            "message": (
                "회원가입이 완료되었습니다."
            ),
            "user": user,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(
        data=request.data
    )

    serializer.is_valid(
        raise_exception=True
    )

    result = login_user(
        serializer.validated_data
    )

    return Response(
        result,
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def refresh_view(request):
    serializer = RefreshSerializer(
        data=request.data
    )

    serializer.is_valid(
        raise_exception=True
    )

    result = refresh_access_token(
        serializer.validated_data[
            "refresh"
        ]
    )

    return Response(result)


@api_view(["POST"])
@permission_classes([IsAuthenticatedUser])
def logout_view(request):
    serializer = LogoutSerializer(
        data=request.data
    )

    serializer.is_valid(
        raise_exception=True
    )

    logout_user(
        serializer.validated_data[
            "refresh"
        ]
    )

    return Response({
        "message": (
            "로그아웃되었습니다."
        )
    })


@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def me_view(request):
    return Response(
        get_current_user(
            request.user.userId
        )
    )