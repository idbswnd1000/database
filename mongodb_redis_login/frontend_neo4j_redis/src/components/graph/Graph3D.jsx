import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import ForceGraph3D from "react-force-graph-3d";
import styled from "styled-components";

import GraphControls from "./GraphControls";
import GraphLegend from "./GraphLegend";
import NodeDetailPanel from "./NodeDetailPanel";

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

const Graph3D = ({ graphData }) => {
    const containerRef = useRef(null);
    const graphRef = useRef(null);

    const [
        selectedNode,
        setSelectedNode,
    ] = useState(null);

    const [size, setSize] = useState({
        width: 800,
        height: 650,
    });

    const safeGraphData = useMemo(() => {
        return {
            nodes: graphData?.nodes ?? [],
            links: graphData?.links ?? [],
        };
    }, [graphData]);

    const visibleSelectedNode =
        useMemo(() => {
            if (!selectedNode) {
                return null;
            }

            const exists =
                safeGraphData.nodes.some(
                    (node) =>
                        String(node.id) ===
                        String(
                            selectedNode.id,
                        ),
                );

            return exists
                ? selectedNode
                : null;
        }, [
            safeGraphData.nodes,
            selectedNode,
        ]);

    useEffect(() => {
        if (!containerRef.current) {
            return undefined;
        }

        const resizeObserver =
            new ResizeObserver(
                ([entry]) => {
                    setSize({
                        width:
                        entry.contentRect
                            .width,
                        height:
                        entry.contentRect
                            .height,
                    });
                },
            );

        resizeObserver.observe(
            containerRef.current,
        );

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        const timer =
            window.setTimeout(() => {
                graphRef.current?.zoomToFit(
                    800,
                    80,
                );
            }, 700);

        return () => {
            window.clearTimeout(timer);
        };
    }, [safeGraphData]);

    const handleNodeClick =
        useCallback((node) => {
            setSelectedNode(node);

            if (
                node.x === undefined ||
                node.y === undefined ||
                node.z === undefined
            ) {
                return;
            }

            const distance = 120;

            const nodeDistance =
                Math.hypot(
                    node.x,
                    node.y,
                    node.z,
                );

            const distanceRatio =
                1 +
                distance /
                Math.max(
                    nodeDistance,
                    1,
                );

            graphRef.current?.cameraPosition(
                {
                    x:
                        node.x *
                        distanceRatio,
                    y:
                        node.y *
                        distanceRatio,
                    z:
                        node.z *
                        distanceRatio,
                },
                node,
                900,
            );
        }, []);

    const handleZoomToFit = () => {
        graphRef.current?.zoomToFit(
            700,
            80,
        );
    };

    const handleResetCamera = () => {
        graphRef.current?.cameraPosition(
            {
                x: 0,
                y: 0,
                z: 500,
            },
            {
                x: 0,
                y: 0,
                z: 0,
            },
            900,
        );
    };

    if (
        safeGraphData.nodes.length === 0
    ) {
        return (
            <EmptyContainer>
                실행 결과가 없습니다.
            </EmptyContainer>
        );
    }

    return (
        <Container ref={containerRef}>
            <ForceGraph3D
                ref={graphRef}
                width={size.width}
                height={size.height}
                graphData={safeGraphData}
                nodeId="id"
                nodeLabel={(node) =>
                    `${node.label ?? "Node"}: ${getNodeTitle(node)}`
                }
                nodeColor={getNodeColor}
                nodeVal={(node) =>
                    node.label === "Sale"
                        ? 4
                        : 7
                }
                nodeOpacity={0.92}
                linkLabel={(link) =>
                    link.type ??
                    "RELATED_TO"
                }
                linkColor={() =>
                    "rgba(148, 163, 184, 0.65)"
                }
                linkWidth={1.2}
                linkOpacity={0.75}
                linkDirectionalArrowLength={
                    4
                }
                linkDirectionalArrowRelPos={
                    1
                }
                linkDirectionalParticles={
                    2
                }
                linkDirectionalParticleWidth={
                    1.8
                }
                linkDirectionalParticleSpeed={
                    0.004
                }
                backgroundColor="#081120"
                showNavInfo={false}
                enableNodeDrag
                enableNavigationControls
                onNodeClick={
                    handleNodeClick
                }
                onBackgroundClick={() =>
                    setSelectedNode(null)
                }
            />

            <GraphControls
                onZoomToFit={
                    handleZoomToFit
                }
                onResetCamera={
                    handleResetCamera
                }
                onClearSelection={() =>
                    setSelectedNode(null)
                }
            />

            <GraphLegend />

            <NodeDetailPanel
                node={
                    visibleSelectedNode
                }
                onClose={() =>
                    setSelectedNode(null)
                }
            />
        </Container>
    );
};

export default Graph3D;

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 680px;
    overflow: hidden;
    border: 1px solid #1e293b;
    border-radius: 16px;
    background: #081120;
`;

const EmptyContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 420px;
    border: 1px dashed #cbd5e1;
    border-radius: 16px;
    background: #f8fafc;
    color: #64748b;
    font-size: 15px;
`;