import {
    useEffect,
    useRef,
    useState,
} from "react";
import ForceGraph2D from "react-force-graph-2d";
import styled from "styled-components";

import NodeDetailPanel from "../NodeDetailPanel";

const NODE_COLORS = {
    Customer: "#38bdf8",
    Sale: "#22c55e",
    Product: "#f59e0b",
    ProductCategory: "#a78bfa",
    Category: "#ec4899",
    Region: "#14b8a6",
    Channel: "#06b6d4",
    Promotion: "#f43f5e",
    Date: "#94a3b8",
    Node: "#64748b",
};

const getNodeColor = (node) => {
    return (
        NODE_COLORS[node.label] ??
        NODE_COLORS.Node
    );
};

const getNodeTitle = (node) => {
    return (
        node.title ??
        node.properties?.name ??
        node.properties?.customerName ??
        node.properties?.productName ??
        String(node.id)
    );
};

const BaseForceGraph = ({
                            graphData,
                            mode = "network",
                        }) => {
    const containerRef =
        useRef(null);

    const graphRef = useRef(null);

    const [
        selectedNode,
        setSelectedNode,
    ] = useState(null);

    const [size, setSize] =
        useState({
            width: 900,
            height: 650,
        });

    useEffect(() => {
        if (
            !containerRef.current
        ) {
            return undefined;
        }

        const observer =
            new ResizeObserver(
                ([entry]) => {
                    setSize({
                        width:
                        entry
                            .contentRect
                            .width,
                        height:
                        entry
                            .contentRect
                            .height,
                    });
                },
            );

        observer.observe(
            containerRef.current,
        );

        return () =>
            observer.disconnect();
    }, []);

    useEffect(() => {
        const timer =
            window.setTimeout(() => {
                graphRef.current?.zoomToFit(
                    600,
                    60,
                );
            }, 400);

        return () =>
            window.clearTimeout(
                timer,
            );
    }, [graphData, mode]);

    const drawNode = (
        node,
        context,
        globalScale,
    ) => {
        const label =
            getNodeTitle(node);

        const radius =
            node.label === "Sale"
                ? 6
                : 8;

        context.beginPath();
        context.arc(
            node.x,
            node.y,
            radius,
            0,
            Math.PI * 2,
        );

        context.fillStyle =
            getNodeColor(node);

        context.fill();

        context.lineWidth =
            selectedNode?.id ===
            node.id
                ? 3
                : 1;

        context.strokeStyle =
            selectedNode?.id ===
            node.id
                ? "#ffffff"
                : "rgba(255,255,255,0.35)";

        context.stroke();

        if (globalScale < 0.8) {
            return;
        }

        const fontSize =
            12 / globalScale;

        context.font =
            `${fontSize}px Arial`;

        context.textAlign =
            "center";

        context.textBaseline =
            "top";

        context.fillStyle =
            "#e2e8f0";

        context.fillText(
            label,
            node.x,
            node.y +
            radius +
            3,
        );
    };

    return (
        <Container
            ref={containerRef}
        >
            <ForceGraph2D
                ref={graphRef}
                width={size.width}
                height={size.height}
                graphData={graphData}
                nodeId="id"
                nodeCanvasObject={
                    drawNode
                }
                nodePointerAreaPaint={(
                    node,
                    color,
                    context,
                ) => {
                    context.beginPath();

                    context.arc(
                        node.x,
                        node.y,
                        10,
                        0,
                        Math.PI * 2,
                    );

                    context.fillStyle =
                        color;

                    context.fill();
                }}
                linkLabel={(link) =>
                    link.type ??
                    "RELATED_TO"
                }
                linkColor={() =>
                    "rgba(148,163,184,0.55)"
                }
                linkWidth={1.2}
                linkDirectionalArrowLength={
                    5
                }
                linkDirectionalArrowRelPos={
                    1
                }
                backgroundColor="#081120"
                cooldownTicks={
                    mode === "network"
                        ? 120
                        : 0
                }
                enableNodeDrag={
                    mode === "network"
                }
                onNodeClick={(node) =>
                    setSelectedNode(
                        node,
                    )
                }
                onBackgroundClick={() =>
                    setSelectedNode(
                        null,
                    )
                }
            />

            <NodeDetailPanel
                node={selectedNode}
                onClose={() =>
                    setSelectedNode(
                        null,
                    )
                }
            />
        </Container>
    );
};

export default BaseForceGraph;

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 680px;
    overflow: hidden;
    border-radius: 16px;
    background: #081120;
`;