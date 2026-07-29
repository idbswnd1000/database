from app.repositories.dashboard_repository import (
    find_category_sales,
    find_channel_sales,
    find_dashboard_kpi,
    find_monthly_sales,
    find_top_products,
)


def get_dashboard_kpi() -> dict:
    result = find_dashboard_kpi()

    return {
        "totalSalesCount": result.get(
            "totalSalesCount",
            0,
        ),
        "totalQuantity": result.get(
            "totalQuantity",
            0,
        ),
        "totalSalesAmount": result.get(
            "totalSalesAmount",
            0,
        ),
        "customerCount": result.get(
            "customerCount",
            0,
        ),
        "productCount": result.get(
            "productCount",
            0,
        ),
    }


def get_monthly_sales() -> list[dict]:
    records = find_monthly_sales()

    return [
        {
            **record,
            "period": (
                f"{record['year']}-"
                f"{int(record['month']):02d}"
            ),
        }
        for record in records
    ]


def get_top_products(
    limit: int,
) -> list[dict]:
    return find_top_products(limit)


def get_category_sales() -> list[dict]:
    return find_category_sales()


def get_channel_sales() -> list[dict]:
    return find_channel_sales()