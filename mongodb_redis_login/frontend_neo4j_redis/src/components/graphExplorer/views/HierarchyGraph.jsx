import {
    useMemo,
    useState,
} from "react";
import Tree from "react-d3-tree";
import styled from "styled-components";

import {
    convertGraphToHierarchy,
} from "../../../utils/hierarchyUtils";

import NodeDetailPanel from "../NodeDetailPanel";

const HierarchyGraph = ({
                            graphData,
                        }) => {
    const [
        selectedRootId,
        setSelectedRootId,
    ] = useState(
        graphData?.nodes?.[0]?.id ??
        "",
    );

    const [
        selectedNode,
        setSelectedNode,
    ] = useState(null);

    const hierarchyData =
        useMemo(() => {
            return convertGraphToHierarchy(
                graphData,
                selectedRootId,
            );
        }, [
            graphData,
            selectedRootId,
        ]);

    if (!hierarchyData) {
        return (
            <EmptyBox>
                계층형으로 표시할
                데이터가 없습니다.
            </EmptyBox>
        );
    }

    return (
        <Container>
            <RootSelector>
                <span>중심 노드</span>

                <select
                    value={
                        selectedRootId
                    }
                    onChange={(event) =>
                        setSelectedRootId(
                            event.target
                                .value,
                        )
                    }
                >
                    {graphData.nodes.map(
                        (node) => (
                            <option
                                key={
                                    node.id
                                }
                                value={
                                    node.id
                                }
                            >
                                {node.label}
                                {" · "}
                                {node.title ??
                                    node.id}
                            </option>
                        ),
                    )}
                </select>
            </RootSelector>

            <Tree
                data={hierarchyData}
                orientation="horizontal"
                translate={{
                    x: 160,
                    y: 330,
                }}
                pathFunc="elbow"
                separation={{
                    siblings: 1.3,
                    nonSiblings: 1.7,
                }}
                collapsible
                zoomable
                draggable
                nodeSize={{
                    x: 220,
                    y: 90,
                }}
                renderCustomNodeElement={({
                                              nodeDatum,
                                              toggleNode,
                                          }) => {
                    const label =
                        nodeDatum
                            .attributes
                            ?.label ??
                        "Node";

                    return (
                        <g>
                            <circle
                                r={18}
                                fill="#38bdf8"
                                stroke="#ffffff"
                                strokeWidth={
                                    2
                                }
                                onClick={() => {
                                    toggleNode();

                                    setSelectedNode(
                                        nodeDatum.nodeData,
                                    );
                                }}
                            />

                            <text
                                x={28}
                                y={5}
                                fill="#e2e8f0"
                                stroke="none"
                                fontSize={
                                    13
                                }
                                onClick={() =>
                                    setSelectedNode(
                                        nodeDatum.nodeData,
                                    )
                                }
                            >
                                {
                                    nodeDatum.name
                                }
                            </text>

                            <text
                                x={28}
                                y={23}
                                fill="#94a3b8"
                                stroke="none"
                                fontSize={
                                    11
                                }
                            >
                                {label}
                            </text>
                        </g>
                    );
                }}
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

export default HierarchyGraph;

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 680px;
    overflow: hidden;
    border-radius: 16px;
    background: #081120;
`;

const RootSelector = styled.div`
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid #334155;
    border-radius: 10px;
    padding: 10px 12px;
    background: rgba(
        15,
        23,
        42,
        0.94
    );
    color: #e2e8f0;
    font-size: 13px;

    select {
        max-width: 260px;
        border: 1px solid #475569;
        border-radius: 7px;
        padding: 7px 9px;
        background: #1e293b;
        color: #f8fafc;
    }
`;

const EmptyBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 680px;
    border-radius: 16px;
    background: #ffffff;
    color: #64748b;
`;