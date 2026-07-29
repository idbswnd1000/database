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
    useProductGraph,
    useProducts,
} from "../hooks/useProduct";

import {
    normalizeGraphData,
} from "../utils/graphUtils";

const ProductPage = () => {
    const [keyword, setKeyword] =
        useState("");

    const [
        selectedProduct,
        setSelectedProduct,
    ] = useState("");

    const productQuery =
        useProducts(keyword);

    const products =
        productQuery.data ?? [];

    const activeProduct =
        selectedProduct ||
        products[0]?.productCode ||
        "";

    const graphQuery =
        useProductGraph(
            activeProduct,
        );

    const graphData = useMemo(() => {
        return normalizeGraphData(
            graphQuery.data,
        );
    }, [graphQuery.data]);

    if (productQuery.isLoading) {
        return <Loading />;
    }

    if (productQuery.error) {
        return (
            <ErrorMessage
                error={productQuery.error}
            />
        );
    }

    return (
        <>
            <PageHeader
                title="Product Graph"
                description="상품을 선택하면 판매·고객·카테고리 관계를 조회합니다."
            />

            <PageLayout>
                <SelectPanel
                    title="상품 목록"
                    items={products}
                    selectedId={
                        activeProduct
                    }
                    onSelect={
                        setSelectedProduct
                    }
                    keyword={keyword}
                    onKeywordChange={
                        setKeyword
                    }
                    getId={(item) =>
                        item.productCode
                    }
                    getTitle={(item) =>
                        item.productName ||
                        item.productCode
                    }
                    getDescription={(
                        item,
                    ) =>
                        item.productCode
                    }
                />

                <GraphSection>
                    {!activeProduct && (
                        <Empty>
                            상품을 선택해 주세요.
                        </Empty>
                    )}

                    {activeProduct &&
                        graphQuery.isLoading && (
                            <Loading />
                        )}

                    {activeProduct &&
                        graphQuery.error && (
                            <ErrorMessage
                                error={
                                    graphQuery.error
                                }
                            />
                        )}

                    {activeProduct &&
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

                    {activeProduct &&
                        !graphQuery.isLoading &&
                        !graphQuery.error &&
                        graphData.nodes.length ===
                        0 && (
                            <Empty>
                                해당 상품의 관계
                                그래프 데이터가
                                없습니다.
                            </Empty>
                        )}
                </GraphSection>
            </PageLayout>
        </>
    );
};

export default ProductPage;

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