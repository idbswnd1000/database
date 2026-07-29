from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.response import Response

from app.authentication.permissions import (
    IsAuthenticatedUser,
)
from app.services.sale_service import (
    get_sale_graph,
    get_sales,
)


@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def sale_list(request):
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
        "items": get_sales(
            keyword,
            limit,
        )
    })


@api_view(["GET"])
@permission_classes([IsAuthenticatedUser])
def sale_graph(
    request,
    sale_id: str,
):
    return Response(
        get_sale_graph(sale_id)
    )