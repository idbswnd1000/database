from app.repositories.product_repository import (
    find_product_graph,
    find_products,
)
from app.services.graph_service import (
    convert_records_to_graph,
)


def get_products(
    keyword: str = "",
    limit: int = 100,
) -> list[dict]:
    return find_products(
        keyword,
        limit,
    )


def get_product_graph(
    product_code: str,
    sale_limit: int = 5,
) -> dict:
    records = find_product_graph(
        product_code,
        sale_limit,
    )

    return convert_records_to_graph(
        records
    )