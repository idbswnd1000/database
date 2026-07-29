const cloneGraph = (graphData) => {
    return {
        nodes: (graphData?.nodes ?? []).map(
            (node) => ({
                ...node,
            }),
        ),
        links: (graphData?.links ?? []).map(
            (link) => ({
                ...link,
            }),
        ),
    };
};

const getNodeDate = (node) => {
    const properties =
        node.properties ?? {};

    const rawDate =
        properties.date ??
        properties.saleDate ??
        properties.orderDate ??
        properties.createdAt ??
        node.date;

    if (!rawDate) {
        return null;
    }

    const date = new Date(rawDate);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return null;
    }

    return date;
};

export const createNetworkLayout = (
    graphData,
) => {
    const graph = cloneGraph(graphData);

    graph.nodes.forEach((node) => {
        delete node.fx;
        delete node.fy;
    });

    return graph;
};

export const createRadialLayout = (
    graphData,
) => {
    const graph = cloneGraph(graphData);

    const nodesByLabel = graph.nodes.reduce(
        (groups, node) => {
            const label =
                node.label ?? "Node";

            if (!groups[label]) {
                groups[label] = [];
            }

            groups[label].push(node);

            return groups;
        },
        {},
    );

    const labelGroups =
        Object.values(nodesByLabel);

    labelGroups.forEach(
        (nodes, groupIndex) => {
            const radius =
                120 + groupIndex * 100;

            nodes.forEach(
                (node, nodeIndex) => {
                    const angle =
                        (Math.PI * 2 * nodeIndex) /
                        Math.max(
                            nodes.length,
                            1,
                        );

                    node.fx =
                        Math.cos(angle) *
                        radius;

                    node.fy =
                        Math.sin(angle) *
                        radius;
                },
            );
        },
    );

    return graph;
};

export const createClusterLayout = (
    graphData,
) => {
    const graph = cloneGraph(graphData);

    const groupedNodes =
        graph.nodes.reduce(
            (groups, node) => {
                const label =
                    node.label ?? "Node";

                if (!groups[label]) {
                    groups[label] = [];
                }

                groups[label].push(node);

                return groups;
            },
            {},
        );

    const labels =
        Object.keys(groupedNodes);

    const columns = Math.ceil(
        Math.sqrt(labels.length),
    );

    labels.forEach(
        (label, labelIndex) => {
            const column =
                labelIndex % columns;

            const row = Math.floor(
                labelIndex / columns,
            );

            const centerX =
                column * 280 -
                ((columns - 1) * 280) /
                2;

            const centerY =
                row * 240 -
                (Math.floor(
                        (labels.length - 1) /
                        columns,
                    ) *
                    240) /
                2;

            groupedNodes[label].forEach(
                (node, nodeIndex) => {
                    const angle =
                        (Math.PI * 2 * nodeIndex) /
                        Math.max(
                            groupedNodes[label]
                                .length,
                            1,
                        );

                    const radius =
                        35 +
                        Math.floor(
                            nodeIndex / 10,
                        ) *
                        30;

                    node.fx =
                        centerX +
                        Math.cos(angle) *
                        radius;

                    node.fy =
                        centerY +
                        Math.sin(angle) *
                        radius;
                },
            );
        },
    );

    return graph;
};

export const createTimelineLayout = (
    graphData,
) => {
    const graph = cloneGraph(graphData);

    const datedNodes = [];
    const undatedNodes = [];

    graph.nodes.forEach((node) => {
        const date =
            getNodeDate(node);

        if (date) {
            datedNodes.push({
                node,
                date,
            });
        } else {
            undatedNodes.push(node);
        }
    });

    datedNodes.sort(
        (first, second) =>
            first.date - second.date,
    );

    const groups = datedNodes.reduce(
        (result, item) => {
            const monthKey =
                `${item.date.getFullYear()}-` +
                `${String(
                    item.date.getMonth() +
                    1,
                ).padStart(2, "0")}`;

            if (!result[monthKey]) {
                result[monthKey] = [];
            }

            result[monthKey].push(
                item.node,
            );

            return result;
        },
        {},
    );

    const monthKeys =
        Object.keys(groups);

    monthKeys.forEach(
        (monthKey, monthIndex) => {
            groups[monthKey].forEach(
                (node, nodeIndex) => {
                    node.fx =
                        monthIndex * 220 -
                        ((monthKeys.length -
                                1) *
                            220) /
                        2;

                    node.fy =
                        nodeIndex * 65 -
                        ((groups[monthKey]
                                    .length -
                                1) *
                            65) /
                        2;

                    node.timelineLabel =
                        monthKey;
                },
            );
        },
    );

    undatedNodes.forEach(
        (node, index) => {
            node.fx =
                monthKeys.length * 220;

            node.fy =
                index * 55 -
                ((undatedNodes.length -
                        1) *
                    55) /
                2;
        },
    );

    return graph;
};

export const filterGraphByLabels = (
    graphData,
    selectedLabels,
) => {
    if (
        !selectedLabels ||
        selectedLabels.length === 0
    ) {
        return {
            nodes: [],
            links: [],
        };
    }

    const nodes = (
        graphData?.nodes ?? []
    ).filter((node) =>
        selectedLabels.includes(
            node.label ?? "Node",
        ),
    );

    const nodeIds = new Set(
        nodes.map((node) =>
            String(node.id),
        ),
    );

    const links = (
        graphData?.links ?? []
    ).filter((link) => {
        const sourceId =
            typeof link.source ===
            "object"
                ? link.source.id
                : link.source;

        const targetId =
            typeof link.target ===
            "object"
                ? link.target.id
                : link.target;

        return (
            nodeIds.has(
                String(sourceId),
            ) &&
            nodeIds.has(
                String(targetId),
            )
        );
    });

    return {
        nodes,
        links,
    };
};