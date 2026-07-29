from app.repositories.customer_repository import (
    find_customer_graph,
    find_customers,
)
from app.services.graph_service import (
    convert_records_to_graph,
)


def get_customers(
    keyword: str = "",
    limit: int = 100,
) -> list[dict]:
    return find_customers(
        keyword,
        limit,
    )


def get_customer_graph(
    customer_code: str,
    sale_limit: int = 10,
) -> dict:
    records = find_customer_graph(
        customer_code,
        sale_limit,
    )

    return convert_records_to_graph(
        records
    )