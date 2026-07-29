from rest_framework.exceptions import NotFound

from app.repositories.sale_repository import (
    find_sale_graph,
    find_sales,
)
from app.services.graph_service import (
    convert_records_to_graph,
)


def get_sales(
    keyword: str,
    limit: int,
) -> list[dict]:
    return find_sales(
        keyword=keyword,
        limit=limit,
    )


def get_sale_graph(
    sale_id: str,
) -> dict:
    records = find_sale_graph(sale_id)

    if not records:
        raise NotFound(
            "판매 데이터를 찾을 수 없습니다."
        )

    return convert_records_to_graph(records)