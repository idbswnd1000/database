from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.response import Response

from app.authentication.permissions import (
    IsAuthenticatedUser,
)
from app.services.customer_service import (
    get_customer_graph,
    get_customers,
)


@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def customer_list(request):
    keyword = request.query_params.get(
        "keyword",
        "",
    )

    limit = min(
        int(request.query_params.get(
            "limit",
            100,
        )),
        500,
    )

    return Response({
        "items": get_customers(
            keyword,
            limit,
        )
    })


@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def customer_graph(
    request,
    customer_code: str,
):
    sale_limit = min(
        int(request.query_params.get(
            "saleLimit",
            50,
        )),
        200,
    )

    return Response(
        get_customer_graph(
            customer_code,
            sale_limit,
        )
    )