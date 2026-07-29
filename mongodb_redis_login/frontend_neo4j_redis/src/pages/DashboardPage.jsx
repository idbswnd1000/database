import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import styled from "styled-components";

import ChartCard from "../components/dashboard/ChartCard";
import KpiCard from "../components/dashboard/KpiCard";

import ErrorMessage from "../components/common/ErrorMessage";
import Loading from "../components/common/Loading";
import PageHeader from "../components/common/PageHeader";

import {
    useCategorySales,
    useDashboardKpi,
    useMonthlySales,
    useTopProducts,
} from "../hooks/useDashboard";

const formatNumber = (
    value,
) => {
    return Number(
        value ?? 0,
    ).toLocaleString("ko-KR");
};

const formatCurrency = (
    value,
) => {
    return `${formatNumber(value)}원`;
};

const DashboardPage = () => {
    const kpiQuery =
        useDashboardKpi();

    const monthlyQuery =
        useMonthlySales();

    const productQuery =
        useTopProducts(10);

    const categoryQuery =
        useCategorySales();

    const isLoading =
        kpiQuery.isLoading ||
        monthlyQuery.isLoading ||
        productQuery.isLoading ||
        categoryQuery.isLoading;

    const error =
        kpiQuery.error ||
        monthlyQuery.error ||
        productQuery.error ||
        categoryQuery.error;

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <ErrorMessage
                error={error}
            />
        );
    }

    const kpi = kpiQuery.data ?? {};

    return (
        <>
            <PageHeader
                title="Dashboard"
                description="Neo4j 판매 데이터를 요약한 대시보드입니다."
            />

            <KpiGrid>
                <KpiCard
                    title="총 매출"
                    value={formatCurrency(
                        kpi.totalSalesAmount,
                    )}
                />

                <KpiCard
                    title="판매 건수"
                    value={formatNumber(
                        kpi.totalSalesCount,
                    )}
                />

                <KpiCard
                    title="판매 수량"
                    value={formatNumber(
                        kpi.totalQuantity,
                    )}
                />

                <KpiCard
                    title="고객 수"
                    value={formatNumber(
                        kpi.customerCount,
                    )}
                />

                <KpiCard
                    title="상품 수"
                    value={formatNumber(
                        kpi.productCount,
                    )}
                />
            </KpiGrid>

            <ChartGrid>
                <ChartCard title="월별 매출">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <LineChart
                            data={
                                monthlyQuery.data
                            }
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="period"
                            />

                            <YAxis
                                tickFormatter={
                                    formatNumber
                                }
                            />

                            <Tooltip
                                formatter={(
                                    value,
                                ) =>
                                    formatCurrency(
                                        value,
                                    )
                                }
                            />

                            <Line
                                type="monotone"
                                dataKey="salesAmount"
                                stroke="#0284c7"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="상품별 매출 Top 10">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart
                            data={
                                productQuery.data
                            }
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="productName"
                            />

                            <YAxis
                                tickFormatter={
                                    formatNumber
                                }
                            />

                            <Tooltip
                                formatter={(
                                    value,
                                ) =>
                                    formatCurrency(
                                        value,
                                    )
                                }
                            />

                            <Bar
                                dataKey="salesAmount"
                                fill="#38bdf8"
                                radius={[
                                    8,
                                    8,
                                    0,
                                    0,
                                ]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="카테고리별 매출">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart
                            data={
                                categoryQuery.data
                            }
                            layout="vertical"
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                type="number"
                                tickFormatter={
                                    formatNumber
                                }
                            />

                            <YAxis
                                type="category"
                                dataKey="categoryName"
                                width={100}
                            />

                            <Tooltip
                                formatter={(
                                    value,
                                ) =>
                                    formatCurrency(
                                        value,
                                    )
                                }
                            />

                            <Bar
                                dataKey="salesAmount"
                                fill="#8b5cf6"
                                radius={[
                                    0,
                                    8,
                                    8,
                                    0,
                                ]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </ChartGrid>
        </>
    );
};

export default DashboardPage;

const KpiGrid = styled.section`
    display: grid;
    grid-template-columns:
        repeat(
            5,
            minmax(0, 1fr)
        );
    gap: 16px;

    @media (
        max-width: 1300px
    ) {
        grid-template-columns:
            repeat(
                3,
                minmax(0, 1fr)
            );
    }
`;

const ChartGrid = styled.section`
    display: grid;
    grid-template-columns:
        repeat(
            2,
            minmax(0, 1fr)
        );
    gap: 18px;
    margin-top: 20px;

    > :last-child {
        grid-column: 1 / -1;
    }

    @media (
        max-width: 1000px
    ) {
        grid-template-columns: 1fr;
    }
`;