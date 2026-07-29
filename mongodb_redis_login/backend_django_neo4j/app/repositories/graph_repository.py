from common.neo4j import execute_query


def find_overview_graph(limit: int = 100) -> list[dict]:
    query = """
    MATCH (source)-[relationship]->(target)
    WHERE source:Customer
       OR source:Sale
       OR source:Product
       OR target:Customer
       OR target:Sale
       OR target:Product
    RETURN
        elementId(source) AS sourceElementId,
        labels(source) AS sourceLabels,
        properties(source) AS sourceProperties,

        elementId(relationship) AS relationshipElementId,
        type(relationship) AS relationshipType,
        properties(relationship) AS relationshipProperties,

        elementId(target) AS targetElementId,
        labels(target) AS targetLabels,
        properties(target) AS targetProperties
    LIMIT $limit
    """

    return execute_query(
        query,
        {"limit": limit},
    )