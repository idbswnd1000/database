from common.neo4j import execute_query


def find_products(
    keyword: str = "",
    limit: int = 100,
) -> list[dict]:
    query = """
    MATCH (product:Product)

    WHERE $keyword = ""
       OR toLower(
            coalesce(
                product.productName,
                ""
            )
          ) CONTAINS toLower($keyword)
       OR toLower(
            coalesce(
                product.productCode,
                ""
            )
          ) CONTAINS toLower($keyword)

    RETURN
        product.productCode AS productCode,
        product.productName AS productName,
        product.unitPrice AS unitPrice

    ORDER BY
        product.productName

    LIMIT $limit
    """

    return execute_query(
        query,
        {
            "keyword": keyword,
            "limit": limit,
        },
    )


def find_product_graph(
    product_code: str,
    sale_limit: int = 5,
) -> list[dict]:
    query = """
    MATCH (product:Product {
        productCode: $productCode
    })

    OPTIONAL MATCH
        (product)-[:BELONGS_TO]->
        (productCategory:ProductCategory)

    OPTIONAL MATCH
        (productCategory)-[:BELONGS_TO]->
        (category:Category)

    OPTIONAL MATCH
        (sale:Sale)-[:SOLD_PRODUCT]->
        (product)

    WITH
        product,
        productCategory,
        category,
        sale

    ORDER BY
        sale.saleId

    LIMIT $saleLimit

    RETURN
        product,
        productCategory,
        category,
        sale
    """

    return execute_query(
        query,
        {
            "productCode": product_code,
            "saleLimit": sale_limit,
        },
    )