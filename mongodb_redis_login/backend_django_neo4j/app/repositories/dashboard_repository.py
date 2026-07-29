from common.neo4j import execute_query


def find_dashboard_kpi() -> dict:
    records = execute_query(
        """
        OPTIONAL MATCH (sale:Sale)

        WITH
            count(DISTINCT sale)
                AS totalSalesCount,
            coalesce(
                sum(sale.quantity),
                0
            ) AS totalQuantity,
            coalesce(
                sum(sale.salesAmount),
                0
            ) AS totalSalesAmount

        OPTIONAL MATCH (
            customer:Customer
        )

        WITH
            totalSalesCount,
            totalQuantity,
            totalSalesAmount,
            count(DISTINCT customer)
                AS customerCount

        OPTIONAL MATCH (
            product:Product
        )

        RETURN
            totalSalesCount,
            totalQuantity,
            totalSalesAmount,
            customerCount,
            count(DISTINCT product)
                AS productCount
        """
    )

    return records[0] if records else {}


def find_monthly_sales() -> list[dict]:
    return execute_query(
        """
        MATCH (sale:Sale)
        OPTIONAL MATCH
            (sale)-[:HAS_DATE]->
            (date:Date)

        WITH
            coalesce(
                toString(date.year),
                substring(
                    toString(sale.saleDate),
                    0,
                    4
                )
            ) AS year,
            coalesce(
                toInteger(date.month),
                toInteger(
                    substring(
                        toString(
                            sale.saleDate
                        ),
                        5,
                        2
                    )
                )
            ) AS month,
            sale

        WHERE year IS NOT NULL
          AND month IS NOT NULL

        RETURN
            year,
            month,
            coalesce(
                sum(sale.salesAmount),
                0
            ) AS salesAmount,
            count(sale) AS salesCount

        ORDER BY
            year,
            month
        """
    )


def find_top_products(
    limit: int,
) -> list[dict]:
    return execute_query(
        """
        MATCH
            (sale:Sale)
            -[:SOLD_PRODUCT]->
            (product:Product)

        RETURN
            product.productCode
                AS productCode,
            product.productName
                AS productName,
            coalesce(
                sum(sale.salesAmount),
                0
            ) AS salesAmount,
            coalesce(
                sum(sale.quantity),
                0
            ) AS quantity

        ORDER BY salesAmount DESC
        LIMIT $limit
        """,
        {
            "limit": limit,
        },
    )


def find_category_sales() -> list[dict]:
    return execute_query(
        """
        MATCH
            (sale:Sale)
            -[:SOLD_PRODUCT]->
            (product:Product)
            -[:BELONGS_TO]->
            (productCategory:
                ProductCategory)
            -[:BELONGS_TO]->
            (category:Category)

        RETURN
            category.categoryCode
                AS categoryCode,
            category.categoryName
                AS categoryName,
            coalesce(
                sum(sale.salesAmount),
                0
            ) AS salesAmount,
            coalesce(
                sum(sale.quantity),
                0
            ) AS quantity

        ORDER BY salesAmount DESC
        """
    )


def find_channel_sales() -> list[dict]:
    return execute_query(
        """
        MATCH
            (sale:Sale)
            -[:THROUGH_CHANNEL]->
            (channel:Channel)

        RETURN
            channel.channelCode
                AS channelCode,
            channel.channelName
                AS channelName,
            coalesce(
                sum(sale.salesAmount),
                0
            ) AS salesAmount,
            count(sale)
                AS salesCount

        ORDER BY salesAmount DESC
        """
    )