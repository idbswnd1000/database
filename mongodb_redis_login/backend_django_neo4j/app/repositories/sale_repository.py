from common.neo4j import execute_query


def find_sales(
    keyword: str = "",
    limit: int = 100,
) -> list[dict]:
    query = """
    MATCH (sale:Sale)
    OPTIONAL MATCH
        (sale)-[:PURCHASED_BY]->
        (customer:Customer)
    OPTIONAL MATCH
        (sale)-[:SOLD_PRODUCT]->
        (product:Product)

    WHERE $keyword = ""
       OR toLower(
            coalesce(toString(sale.saleId), "")
          ) CONTAINS toLower($keyword)
       OR toLower(
            coalesce(customer.customerName, "")
          ) CONTAINS toLower($keyword)
       OR toLower(
            coalesce(product.productName, "")
          ) CONTAINS toLower($keyword)

    RETURN
        sale.saleId AS saleId,
        toString(sale.saleDate) AS saleDate,
        sale.quantity AS quantity,
        sale.salesAmount AS salesAmount,
        customer.customerCode AS customerCode,
        customer.customerName AS customerName,
        product.productCode AS productCode,
        product.productName AS productName
    ORDER BY sale.saleDate DESC
    LIMIT $limit
    """

    return execute_query(
        query,
        {
            "keyword": keyword,
            "limit": limit,
        },
    )


def find_sale_graph(
    sale_id: str,
) -> list[dict]:
    query = """
    MATCH (sale:Sale {
        saleId: $saleId
    })

    OPTIONAL MATCH
        (sale)-[:PURCHASED_BY]->
        (customer:Customer)

    OPTIONAL MATCH
        (customer)-[:LIVES_IN]->
        (region:Region)

    OPTIONAL MATCH
        (sale)-[:SOLD_PRODUCT]->
        (product:Product)

    OPTIONAL MATCH
        (product)-[:BELONGS_TO]->
        (productCategory:ProductCategory)

    OPTIONAL MATCH
        (productCategory)-[:BELONGS_TO]->
        (category:Category)

    OPTIONAL MATCH
        (sale)-[:HAS_DATE]->(date:Date)

    OPTIONAL MATCH
        (sale)-[:USED_PROMOTION]->
        (promotion:Promotion)

    OPTIONAL MATCH
        (sale)-[:THROUGH_CHANNEL]->
        (channel:Channel)

    RETURN
        sale,
        customer,
        region,
        product,
        productCategory,
        category,
        date,
        promotion,
        channel
    """

    return execute_query(
        query,
        {"saleId": sale_id},
    )