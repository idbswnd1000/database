from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import (
    IsAuthenticated,
)
from rest_framework.response import Response

from app.services.product_service import (
    get_product_graph,
    get_products,
)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def product_list(request):
    keyword = request.query_params.get(
        "keyword",
        "",
    )

    try:
        limit = int(
            request.query_params.get(
                "limit",
                100,
            )
        )
    except ValueError:
        return Response(
            {
                "detail": (
                    "limit은 숫자여야 합니다."
                ),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    limit = max(
        1,
        min(
            limit,
            500,
        ),
    )

    products = get_products(
        keyword=keyword,
        limit=limit,
    )

    return Response(
        products,
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def product_graph(
    request,
    product_code: str,
):
    try:
        sale_limit = int(
            request.query_params.get(
                "saleLimit",
                5,
            )
        )
    except ValueError:
        return Response(
            {
                "detail": (
                    "saleLimit은 숫자여야 합니다."
                ),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    sale_limit = max(
        1,
        min(
            sale_limit,
            100,
        ),
    )

    graph = get_product_graph(
        product_code=product_code,
        sale_limit=sale_limit,
    )

    if not graph["nodes"]:
        return Response(
            {
                "detail": (
                    "상품을 찾을 수 없습니다."
                ),
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    return Response(
        graph,
        status=status.HTTP_200_OK,
    )