import {
    useMemo,
    useState,
} from "react";
import styled from "styled-components";

import ErrorMessage from "../components/common/ErrorMessage";
import Loading from "../components/common/Loading";
import PageHeader from "../components/common/PageHeader";
import SelectPanel from "../components/common/SelectPanel";
import Graph3D from "../components/graph/Graph3D";

import {
    useSaleGraph,
    useSales,
} from "../hooks/useSale";

import {
    normalizeGraphData,
} from "../utils/graphUtils";

const SalePage = () => {
    const [keyword, setKeyword] =
        useState("");

    const [
        selectedSale,
        setSelectedSale,
    ] = useState("");

    const saleQuery =
        useSales(keyword);

    const sales =
        saleQuery.data ?? [];

    const activeSale =
        selectedSale ||
        sales[0]?.saleId ||
        "";

    const graphQuery =
        useSaleGraph(
            activeSale,
        );

    const graphData = useMemo(() => {
        return normalizeGraphData(
            graphQuery.data,
        );
    }, [graphQuery.data]);

    if (saleQuery.isLoading) {
        return <Loading />;
    }

    if (saleQuery.error) {
        return (
            <ErrorMessage
                error={saleQuery.error}
            />
        );
    }

    return (
        <>
            <PageHeader
                title="Sale Graph"
                description="판매 건을 선택하면 고객·상품·날짜·채널 관계를 조회합니다."
            />

            <PageLayout>
                <SelectPanel
                    title="판매 목록"
                    items={sales}
                    selectedId={
                        activeSale
                    }
                    onSelect={
                        setSelectedSale
                    }
                    keyword={keyword}
                    onKeywordChange={
                        setKeyword
                    }
                    getId={(item) =>
                        item.saleId
                    }
                    getTitle={(item) =>
                        item.saleId
                    }
                    getDescription={(
                        item,
                    ) => {
                        const amount =
                            item.salesAmount
                                ? `${Number(
                                    item.salesAmount,
                                ).toLocaleString(
                                    "ko-KR",
                                )}원`
                                : "";

                        return [
                            item.saleDate ??
                            "",
                            amount,
                        ]
                            .filter(Boolean)
                            .join(" · ");
                    }}
                />

                <GraphSection>
                    {!activeSale && (
                        <Empty>
                            판매를 선택해 주세요.
                        </Empty>
                    )}

                    {activeSale &&
                        graphQuery.isLoading && (
                            <Loading />
                        )}

                    {activeSale &&
                        graphQuery.error && (
                            <ErrorMessage
                                error={
                                    graphQuery.error
                                }
                            />
                        )}

                    {activeSale &&
                        !graphQuery.isLoading &&
                        !graphQuery.error &&
                        graphData.nodes.length >
                        0 && (
                            <Graph3D
                                graphData={
                                    graphData
                                }
                            />
                        )}

                    {activeSale &&
                        !graphQuery.isLoading &&
                        !graphQuery.error &&
                        graphData.nodes.length ===
                        0 && (
                            <Empty>
                                해당 판매의 관계
                                그래프 데이터가
                                없습니다.
                            </Empty>
                        )}
                </GraphSection>
            </PageLayout>
        </>
    );
};

export default SalePage;

const PageLayout = styled.div`
    display: flex;
    gap: 18px;

    @media (max-width: 1024px) {
        flex-direction: column;
    }
`;

const GraphSection = styled.section`
    min-width: 0;
    flex: 1;
`;

const Empty = styled.div`
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #cbd5e1;
    border-radius: 18px;
    background: #ffffff;
    color: #94a3b8;
`;