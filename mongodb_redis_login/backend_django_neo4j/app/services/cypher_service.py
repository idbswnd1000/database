import re
from typing import Any

from neo4j.graph import Node, Path, Relationship
from rest_framework.exceptions import ValidationError

from app.repositories.cypher_repository import (
    execute_read_query,
)
from app.services.graph_service import (
    convert_node,
    serialize_value,
)


BLOCKED_KEYWORDS = [
    "CREATE",
    "MERGE",
    "DELETE",
    "DETACH",
    "SET",
    "REMOVE",
    "DROP",
    "LOAD CSV",
    "FOREACH",
    "CALL",
]


def validate_read_only_query(
    query: str,
) -> None:
    normalized = re.sub(
        r"\\s+",
        " ",
        query.strip().upper(),
    )

    if not normalized:
        raise ValidationError(
            "Cypher 쿼리를 입력해주세요."
        )

    for keyword in BLOCKED_KEYWORDS:
        if re.search(
            rf"\\b{re.escape(keyword)}\\b",
            normalized,
        ):
            raise ValidationError(
                f"{keyword} 명령은 사용할 수 없습니다."
            )

    if "RETURN" not in normalized:
        raise ValidationError(
            "조회 쿼리에는 RETURN이 필요합니다."
        )


def serialize_cypher_value(
    value: Any,
) -> Any:
    if isinstance(value, Node):
        return convert_node(value)

    if isinstance(value, Relationship):
        return {
            "id": value.element_id,
            "type": value.type,
            "source": value.start_node.element_id,
            "target": value.end_node.element_id,
            "properties": serialize_value(
                dict(value)
            ),
        }

    if isinstance(value, Path):
        return {
            "nodes": [
                convert_node(node)
                for node in value.nodes
            ],
            "relationships": [
                serialize_cypher_value(
                    relationship
                )
                for relationship
                in value.relationships
            ],
        }

    return serialize_value(value)


def extract_graph(
    records: list[dict],
) -> dict:
    nodes = {}
    relationships = {}

    def visit(value: Any) -> None:
        if isinstance(value, Node):
            node = convert_node(value)
            nodes[node["id"]] = node
            return

        if isinstance(value, Relationship):
            relationship = (
                serialize_cypher_value(value)
            )

            relationships[
                relationship["id"]
            ] = relationship

            visit(value.start_node)
            visit(value.end_node)
            return

        if isinstance(value, Path):
            for node in value.nodes:
                visit(node)

            for relationship in value.relationships:
                visit(relationship)

            return

        if isinstance(value, list):
            for item in value:
                visit(item)

        if isinstance(value, dict):
            for item in value.values():
                visit(item)

    for record in records:
        for value in record.values():
            visit(value)

    return {
        "nodes": list(nodes.values()),
        "relationships": list(
            relationships.values()
        ),
    }


def execute_cypher(
    query: str,
    parameters: dict,
) -> dict:
    validate_read_only_query(query)

    records = execute_read_query(
        query,
        parameters,
    )

    rows = [
        {
            key: serialize_cypher_value(value)
            for key, value in record.items()
        }
        for record in records
    ]

    columns = (
        list(records[0].keys())
        if records
        else []
    )

    return {
        "columns": columns,
        "rows": rows,
        "graph": extract_graph(records),
        "count": len(rows),
    }