from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.response import (
    Response,
)

from app.authentication.permissions import (
    IsAuthenticatedUser,
)
from app.services.dashboard_service import (
    get_category_sales,
    get_channel_sales,
    get_dashboard_kpi,
    get_monthly_sales,
    get_top_products,
)


def get_integer_parameter(
    request,
    name: str,
    default: int,
    maximum: int,
) -> int:
    try:
        value = int(
            request.query_params.get(
                name,
                default,
            )
        )

    except ValueError:
        value = default

    return max(
        1,
        min(value, maximum),
    )


@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def dashboard_kpi(request):
    return Response(
        get_dashboard_kpi()
    )


@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def monthly_sales(request):
    return Response({
        "items": get_monthly_sales()
    })


@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def top_products(request):
    limit = get_integer_parameter(
        request,
        "limit",
        10,
        50,
    )

    return Response({
        "items": get_top_products(
            limit
        )
    })


@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def category_sales(request):
    return Response({
        "items": get_category_sales()
    })


@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def channel_sales(request):
    return Response({
        "items": get_channel_sales()}
    )