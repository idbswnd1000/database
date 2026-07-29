import {
    useMemo,
    useState,
} from "react";
import styled from "styled-components";

import GraphFilter from "../components/graphExplorer/GraphFilter";
import GraphStatistics from "../components/graphExplorer/GraphStatistics";
import GraphToolbar from "../components/graphExplorer/GraphToolbar";
import GraphViewer from "../components/graphExplorer/GraphViewer";

import {
    useGraphOverview,
} from "../hooks/useGraph";

import {
    filterGraphByLabels,
} from "../utils/graphLayoutUtils";

import {
    normalizeGraphData,
} from "../utils/graphUtils";

const GraphPage = () => {
    const [
        graphType,
        setGraphType,
    ] = useState("network");

    const [
        selectedLabels,
        setSelectedLabels,
    ] = useState(null);

    const {
        data,
        isLoading,
        isError,
        error,
    } = useGraphOverview();

    const graphData =
        useMemo(() => {
            return normalizeGraphData(
                data,
            );
        }, [data]);

    const labels =
        useMemo(() => {
            return [
                ...new Set(
                    graphData.nodes.map(
                        (node) =>
                            node.label ??
                            "Node",
                    ),
                ),
            ].sort();
        }, [graphData.nodes]);

    const activeLabels =
        useMemo(() => {
            if (
                selectedLabels === null
            ) {
                return labels;
            }

            return selectedLabels;
        }, [
            labels,
            selectedLabels,
        ]);

    const filteredGraph =
        useMemo(() => {
            return filterGraphByLabels(
                graphData,
                activeLabels,
            );
        }, [
            graphData,
            activeLabels,
        ]);

    const handleGraphTypeChange = (
        type,
    ) => {
        setGraphType(type);
    };

    const handleLabelChange = (
        nextLabels,
    ) => {
        setSelectedLabels(
            nextLabels,
        );
    };

    if (isLoading) {
        return (
            <Page>
                <StatusBox>
                    그래프 데이터를
                    불러오는 중입니다.
                </StatusBox>
            </Page>
        );
    }

    if (isError) {
        return (
            <Page>
                <ErrorBox>
                    {error?.response?.data
                            ?.detail ??
                        error?.message ??
                        "그래프를 불러오지 못했습니다."}
                </ErrorBox>
            </Page>
        );
    }

    return (
        <Page>
            <Header>
                <div>
                    <Title>
                        Graph Explorer
                    </Title>

                    <Description>
                        판매 데이터의 관계를
                        다양한 그래프 형태로
                        탐색합니다.
                    </Description>
                </div>

                <GraphToolbar
                    selectedType={
                        graphType
                    }
                    onChange={
                        handleGraphTypeChange
                    }
                />
            </Header>

            <GraphStatistics
                graphData={
                    filteredGraph
                }
            />

            <Content>
                <Sidebar>
                    <GraphFilter
                        labels={labels}
                        selectedLabels={
                            activeLabels
                        }
                        onChange={
                            handleLabelChange
                        }
                    />
                </Sidebar>

                <GraphArea>
                    {filteredGraph.nodes
                        .length ===
                    0 ? (
                        <EmptyBox>
                            표시할 노드를
                            선택해 주세요.
                        </EmptyBox>
                    ) : (
                        <GraphViewer
                            graphType={
                                graphType
                            }
                            graphData={
                                filteredGraph
                            }
                        />
                    )}
                </GraphArea>
            </Content>
        </Page>
    );
};

export default GraphPage;

const Page = styled.main`
    min-height: 100%;
    padding: 24px;
    background: #f4f7fb;
`;

const Header = styled.header`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 22px;
`;

const Title = styled.h1`
    margin: 0 0 8px;
    color: #0f172a;
    font-size: 29px;
`;

const Description = styled.p`
    margin: 0;
    color: #64748b;
    font-size: 15px;
`;

const Content = styled.div`
    display: grid;
    grid-template-columns:
        220px minmax(0, 1fr);
    gap: 18px;
    margin-top: 18px;

    @media (
        max-width: 1024px
    ) {
        grid-template-columns: 1fr;
    }
`;

const Sidebar = styled.aside`
    min-width: 0;
`;

const GraphArea = styled.section`
    min-width: 0;
`;

const StatusBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 500px;
    color: #64748b;
`;

const EmptyBox = styled(
    StatusBox,
)`
    border: 1px dashed #cbd5e1;
    border-radius: 16px;
    background: #ffffff;
`;

const ErrorBox = styled.div`
    margin: 24px 0;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 16px;
    background: #fef2f2;
    color: #b91c1c;
`;