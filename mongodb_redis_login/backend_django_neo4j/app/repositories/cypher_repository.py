from common.neo4j import execute_query


def execute_read_query(
    query: str,
    parameters: dict,
) -> list[dict]:
    return execute_query(
        query,
        parameters,
    )