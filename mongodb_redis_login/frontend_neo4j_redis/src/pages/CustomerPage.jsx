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
    useCustomerGraph,
    useCustomers,
} from "../hooks/useCustomer";

import {
    normalizeGraphData,
} from "../utils/graphUtils";

const CustomerPage = () => {
    const [keyword, setKeyword] =
        useState("");

    const [
        selectedCustomer,
        setSelectedCustomer,
    ] = useState("");

    const customerQuery =
        useCustomers(keyword);

    const customers =
        customerQuery.data ?? [];

    const activeCustomer =
        selectedCustomer ||
        customers[0]?.customerCode ||
        "";

    const graphQuery =
        useCustomerGraph(
            activeCustomer,
        );

    const graphData = useMemo(() => {
        return normalizeGraphData(
            graphQuery.data,
        );
    }, [graphQuery.data]);

    if (customerQuery.isLoading) {
        return <Loading />;
    }

    if (customerQuery.error) {
        return (
            <ErrorMessage
                error={
                    customerQuery.error
                }
            />
        );
    }

    return (
        <>
            <PageHeader
                title="Customer Graph"
                description="고객을 선택하면 구매한 판매·상품 관계를 확인할 수 있습니다."
            />

            <PageLayout>
                <SelectPanel
                    title="고객 목록"
                    items={customers}
                    selectedId={
                        activeCustomer
                    }
                    onSelect={
                        setSelectedCustomer
                    }
                    keyword={keyword}
                    onKeywordChange={
                        setKeyword
                    }
                    getId={(item) =>
                        item.customerCode
                    }
                    getTitle={(item) =>
                        item.customerName ||
                        item.customerCode
                    }
                    getDescription={(
                        item,
                    ) =>
                        item.customerCode
                    }
                />

                <GraphSection>
                    {!activeCustomer && (
                        <Empty>
                            고객을 선택해 주세요.
                        </Empty>
                    )}

                    {activeCustomer &&
                        graphQuery.isLoading && (
                            <Loading />
                        )}

                    {activeCustomer &&
                        graphQuery.error && (
                            <ErrorMessage
                                error={
                                    graphQuery.error
                                }
                            />
                        )}

                    {activeCustomer &&
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

                    {activeCustomer &&
                        !graphQuery.isLoading &&
                        !graphQuery.error &&
                        graphData.nodes.length ===
                        0 && (
                            <Empty>
                                해당 고객의 관계
                                그래프 데이터가
                                없습니다.
                            </Empty>
                        )}
                </GraphSection>
            </PageLayout>
        </>
    );
};

export default CustomerPage;

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