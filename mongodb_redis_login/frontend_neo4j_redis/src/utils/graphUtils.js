const getNodeId = (value) => {
    if (typeof value === "object" && value !== null) {
        return value.id;
    }

    return value;
};

const normalizeNode = (node) => {
    return {
        ...node,
        id: String(node.id),
        label:
            node.label ??
            node.labels?.[0] ??
            "Node",
        title:
            node.title ??
            node.properties?.name ??
            node.properties?.customerName ??
            node.properties?.productName ??
            node.properties?.saleCode ??
            String(node.id),
        properties: node.properties ?? {},
    };
};

const normalizeRelationship = (relationship, index) => {
    const source =
        relationship.source ??
        relationship.startNodeId ??
        relationship.start ??
        relationship.from;

    const target =
        relationship.target ??
        relationship.endNodeId ??
        relationship.end ??
        relationship.to;

    return {
        ...relationship,
        id:
            relationship.id ??
            `${getNodeId(source)}-${getNodeId(target)}-${index}`,
        source: String(getNodeId(source)),
        target: String(getNodeId(target)),
        type:
            relationship.type ??
            relationship.label ??
            relationship.relationshipType ??
            "RELATED_TO",
    };
};

export const normalizeGraphData = (response) => {
    if (!response) {
        return {
            nodes: [],
            links: [],
        };
    }

    /*
     * 백엔드가 바로
     * { nodes, relationships }
     * 형태를 반환하는 경우
     */
    if (Array.isArray(response.nodes)) {
        const relationships =
            response.relationships ??
            response.links ??
            [];

        return {
            nodes: response.nodes.map(normalizeNode),
            links: relationships.map(normalizeRelationship),
        };
    }

    /*
     * 현재 화면처럼
     * {
     *   path: {
     *     nodes: [],
     *     relationships: []
     *   }
     * }
     * 형태를 반환하는 경우
     */
    const graphValues = Object.values(response).filter(
        (value) =>
            value &&
            typeof value === "object" &&
            Array.isArray(value.nodes),
    );

    const nodeMap = new Map();
    const linkMap = new Map();

    graphValues.forEach((graphValue) => {
        graphValue.nodes.forEach((node) => {
            const normalizedNode = normalizeNode(node);

            nodeMap.set(
                normalizedNode.id,
                normalizedNode,
            );
        });

        const relationships =
            graphValue.relationships ??
            graphValue.links ??
            [];

        relationships.forEach(
            (relationship, index) => {
                const normalizedRelationship =
                    normalizeRelationship(
                        relationship,
                        index,
                    );

                linkMap.set(
                    normalizedRelationship.id,
                    normalizedRelationship,
                );
            },
        );
    });

    return {
        nodes: Array.from(nodeMap.values()),
        links: Array.from(linkMap.values()),
    };
};