from typing import Any

from neo4j.graph import Node

from app.repositories.graph_repository import (
    find_overview_graph,
)


TITLE_PROPERTIES = {
    "User": [
        "username",
        "email",
    ],
    "Customer": [
        "customerName",
        "customerCode",
    ],
    "Product": [
        "productName",
        "productCode",
    ],
    "Sale": [
        "saleId",
        "orderId",
        "salesAmount",
    ],
    "Region": [
        "regionName",
        "regionCode",
    ],
    "Category": [
        "categoryName",
        "categoryCode",
    ],
    "ProductCategory": [
        "productCategoryName",
        "productCategoryCode",
    ],
    "Promotion": [
        "promotionName",
        "promotionCode",
    ],
    "Channel": [
        "channelName",
        "channelCode",
    ],
    "Date": [
        "date",
        "fullDate",
    ],
}


def serialize_value(
    value: Any,
) -> Any:
    if value is None:
        return None

    if hasattr(value, "iso_format"):
        return value.iso_format()

    if isinstance(value, dict):
        return {
            key: serialize_value(item)
            for key, item in value.items()
        }

    if isinstance(value, (list, tuple)):
        return [
            serialize_value(item)
            for item in value
        ]

    return value


def get_node_title(
    labels: list[str],
    properties: dict,
) -> str:
    label = (
        labels[0]
        if labels
        else "Node"
    )

    candidates = TITLE_PROPERTIES.get(
        label,
        [],
    )

    for property_name in candidates:
        value = properties.get(
            property_name
        )

        if value not in (
            None,
            "",
        ):
            return str(value)

    return label


def convert_node(
    node: Node,
) -> dict:
    labels = list(node.labels)

    properties = serialize_value(
        dict(node)
    )

    return {
        "id": str(node.element_id),
        "label": (
            labels[0]
            if labels
            else "Node"
        ),
        "labels": labels,
        "title": get_node_title(
            labels,
            properties,
        ),
        "properties": properties,
    }


def add_relationship(
    relationships: dict[str, dict],
    source_node: Node | None,
    target_node: Node | None,
    relationship_type: str,
) -> None:
    if (
        source_node is None
        or target_node is None
    ):
        return

    source_id = str(
        source_node.element_id
    )

    target_id = str(
        target_node.element_id
    )

    relationship_id = (
        f"{source_id}:"
        f"{relationship_type}:"
        f"{target_id}"
    )

    relationships[
        relationship_id
    ] = {
        "id": relationship_id,
        "source": source_id,
        "target": target_id,
        "type": relationship_type,
        "properties": {},
    }


def add_known_relationships(
    record: dict,
    relationships: dict[str, dict],
) -> None:
    customer = record.get(
        "customer"
    )

    region = record.get(
        "region"
    )

    sale = record.get(
        "sale"
    )

    product = record.get(
        "product"
    )

    product_category = record.get(
        "productCategory"
    )

    category = record.get(
        "category"
    )

    date = record.get(
        "date"
    )

    promotion = record.get(
        "promotion"
    )

    channel = record.get(
        "channel"
    )

    add_relationship(
        relationships,
        customer,
        region,
        "LIVES_IN",
    )

    add_relationship(
        relationships,
        sale,
        customer,
        "PURCHASED_BY",
    )

    add_relationship(
        relationships,
        sale,
        product,
        "SOLD_PRODUCT",
    )

    add_relationship(
        relationships,
        product,
        product_category,
        "BELONGS_TO",
    )

    add_relationship(
        relationships,
        product_category,
        category,
        "BELONGS_TO",
    )

    add_relationship(
        relationships,
        sale,
        date,
        "HAS_DATE",
    )

    add_relationship(
        relationships,
        sale,
        promotion,
        "USED_PROMOTION",
    )

    add_relationship(
        relationships,
        sale,
        channel,
        "THROUGH_CHANNEL",
    )


def convert_records_to_graph(
    records: list[dict],
) -> dict:
    nodes: dict[str, dict] = {}
    relationships: dict[str, dict] = {}

    for record in records:
        for value in record.values():
            if not isinstance(
                value,
                Node,
            ):
                continue

            converted = convert_node(
                value
            )

            nodes[
                converted["id"]
            ] = converted

        add_known_relationships(
            record,
            relationships,
        )

    return {
        "nodes": list(
            nodes.values()
        ),
        "relationships": list(
            relationships.values()
        ),
    }


def get_overview_graph(
    limit: int,
) -> dict:
    records = find_overview_graph(
        limit
    )

    nodes: dict[str, dict] = {}
    relationships: dict[str, dict] = {}

    for record in records:
        source_id = str(
            record[
                "sourceElementId"
            ]
        )

        target_id = str(
            record[
                "targetElementId"
            ]
        )

        source_labels = record.get(
            "sourceLabels",
            [],
        )

        target_labels = record.get(
            "targetLabels",
            [],
        )

        source_properties = serialize_value(
            record.get(
                "sourceProperties",
                {},
            )
        )

        target_properties = serialize_value(
            record.get(
                "targetProperties",
                {},
            )
        )

        nodes[source_id] = {
            "id": source_id,
            "label": (
                source_labels[0]
                if source_labels
                else "Node"
            ),
            "labels": source_labels,
            "title": get_node_title(
                source_labels,
                source_properties,
            ),
            "properties": source_properties,
        }

        nodes[target_id] = {
            "id": target_id,
            "label": (
                target_labels[0]
                if target_labels
                else "Node"
            ),
            "labels": target_labels,
            "title": get_node_title(
                target_labels,
                target_properties,
            ),
            "properties": target_properties,
        }

        relationship_id = str(
            record[
                "relationshipElementId"
            ]
        )

        relationships[
            relationship_id
        ] = {
            "id": relationship_id,
            "source": source_id,
            "target": target_id,
            "type": record[
                "relationshipType"
            ],
            "properties": serialize_value(
                record.get(
                    "relationshipProperties",
                    {},
                )
            ),
        }

    return {
        "nodes": list(
            nodes.values()
        ),
        "relationships": list(
            relationships.values()
        ),
    }