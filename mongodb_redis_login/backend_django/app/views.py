from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from app.services.auth_service import (
    register_user,
    login_user,
    logout_user,
    refresh_access_token
)

from app.services.sales_service import (
    get_dashboard,
    get_top_products,
    get_category_sales
)


@api_view(["POST"])
def register(request):

    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {
                "detail":
                    "아이디와 비밀번호를 입력해주세요."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        return Response(
            register_user(
                username,
                password
            ),
            status=status.HTTP_201_CREATED
        )

    except ValueError as e:
        return Response(
            {
                "detail": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def login(request):

    try:
        return Response(
            login_user(
                request.data.get("username"),
                request.data.get("password")
            )
        )

    except ValueError as e:
        return Response(
            {
                "detail": str(e)
            },
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["POST"])
def logout(request):

    refresh_token = request.data.get(
        "refresh_token"
    )

    if refresh_token:
        logout_user(
            refresh_token
        )

    return Response(
        {
            "message": "로그아웃 성공"
        }
    )


@api_view(["POST"])
def refresh(request):

    try:
        return Response(
            refresh_access_token(
                request.data.get(
                    "refresh_token"
                )
            )
        )

    except ValueError as e:
        return Response(
            {
                "detail": str(e)
            },
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["GET"])
def dashboard(request):
    return Response(
        get_dashboard()
    )


@api_view(["GET"])
def top_products(request):
    return Response(
        get_top_products()
    )


@api_view(["GET"])
def categories(request):
    return Response(
        get_category_sales()
    )