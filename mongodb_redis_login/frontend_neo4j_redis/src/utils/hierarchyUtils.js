const getNodeTitle = (node) => {
    return (
        node.title ??
        node.properties?.name ??
        node.properties?.customerName ??
        node.properties?.productName ??
        String(node.id)
    );
};

const getLinkNodeId = (
    value,
) => {
    if (
        typeof value === "object" &&
        value !== null
    ) {
        return String(value.id);
    }

    return String(value);
};

export const convertGraphToHierarchy = (
    graphData,
    rootNodeId,
) => {
    const nodes =
        graphData?.nodes ?? [];

    const links =
        graphData?.links ?? [];

    if (nodes.length === 0) {
        return null;
    }

    const nodeMap = new Map(
        nodes.map((node) => [
            String(node.id),
            node,
        ]),
    );

    const rootId = String(
        rootNodeId ?? nodes[0].id,
    );

    const adjacencyMap = new Map();

    nodes.forEach((node) => {
        adjacencyMap.set(
            String(node.id),
            [],
        );
    });

    links.forEach((link) => {
        const sourceId =
            getLinkNodeId(
                link.source,
            );

        const targetId =
            getLinkNodeId(
                link.target,
            );

        if (
            adjacencyMap.has(sourceId)
        ) {
            adjacencyMap
                .get(sourceId)
                .push(targetId);
        }

        if (
            adjacencyMap.has(targetId)
        ) {
            adjacencyMap
                .get(targetId)
                .push(sourceId);
        }
    });

    const visited = new Set();

    const buildTree = (
        nodeId,
        depth = 0,
    ) => {
        const node =
            nodeMap.get(nodeId);

        if (!node) {
            return null;
        }

        visited.add(nodeId);

        const childIds =
            adjacencyMap.get(nodeId) ??
            [];

        const children = childIds
            .filter(
                (childId) =>
                    !visited.has(
                        childId,
                    ),
            )
            .slice(0, 15)
            .map((childId) =>
                buildTree(
                    childId,
                    depth + 1,
                ),
            )
            .filter(Boolean);

        return {
            name: getNodeTitle(node),
            attributes: {
                id: node.id,
                label:
                    node.label ??
                    "Node",
                depth,
            },
            nodeData: node,
            children:
                children.length > 0
                    ? children
                    : undefined,
        };
    };

    return buildTree(rootId);
};