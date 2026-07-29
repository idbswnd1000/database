from common.neo4j import execute_query


def find_customers(
    keyword: str = "",
    limit: int = 100,
) -> list[dict]:
    query = """
    MATCH (customer:Customer)

    WHERE $keyword = ""
       OR toLower(
            coalesce(
                customer.customerName,
                ""
            )
          ) CONTAINS toLower($keyword)
       OR toLower(
            coalesce(
                customer.customerCode,
                ""
            )
          ) CONTAINS toLower($keyword)

    RETURN
        customer.customerCode AS customerCode,
        customer.customerName AS customerName,
        customer.email AS email

    ORDER BY
        customer.customerName

    LIMIT $limit
    """

    return execute_query(
        query,
        {
            "keyword": keyword,
            "limit": limit,
        },
    )


def find_customer_graph(
    customer_code: str,
    sale_limit: int = 5,
) -> list[dict]:
    query = """
    MATCH (customer:Customer {
        customerCode: $customerCode
    })

    OPTIONAL MATCH
        (customer)-[:LIVES_IN]->
        (region:Region)

    OPTIONAL MATCH
        (sale:Sale)-[:PURCHASED_BY]->
        (customer)

    WITH
        customer,
        region,
        sale

    LIMIT $saleLimit

    RETURN
        customer,
        region,
        sale
    """

    return execute_query(
        query,
        {
            "customerCode": customer_code,
            "saleLimit": sale_limit,
        },
    )