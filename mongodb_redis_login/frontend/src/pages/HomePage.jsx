import { useEffect, useState } from "react";
import styled from "styled-components";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

import {
    getDashboard,
    getTopProducts,
    getCategorySales
} from "../api/salesApi";


const PIE_COLORS = [
    "#4F6EF7",
    "#6E8BFF",
    "#8BA2FF",
    "#A9B9FF",
    "#C5D0FF"
];


const HomePage = () => {
    const [dashboard, setDashboard] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [categorySales, setCategorySales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const username = localStorage.getItem("username");


    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [
                    dashboardData,
                    productData,
                    categoryData
                ] = await Promise.all([
                    getDashboard(),
                    getTopProducts(),
                    getCategorySales()
                ]);

                setDashboard(dashboardData);
                setTopProducts(productData);
                setCategorySales(categoryData);

            } catch (error) {
                console.error(
                    "대시보드 데이터 조회 실패:",
                    error
                );

                setError(true);

            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);


    const formatNumber = (value) => {
        return Number(value || 0).toLocaleString("ko-KR");
    };


    const formatMoney = (value) => {
        return `${Math.round(
            Number(value || 0)
        ).toLocaleString("ko-KR")}원`;
    };


    const formatShortMoney = (value) => {
        const number = Number(value || 0);

        if (number >= 100000000) {
            return `${(number / 100000000).toFixed(1)}억`;
        }

        if (number >= 10000) {
            return `${(number / 10000).toFixed(0)}만`;
        }

        return formatNumber(number);
    };


    if (loading) {
        return (
            <LoadingPage>
                <Spinner />
                <LoadingText>
                    판매 데이터를 불러오는 중...
                </LoadingText>
            </LoadingPage>
        );
    }


    if (error) {
        return (
            <LoadingPage>
                <ErrorTitle>
                    데이터를 불러오지 못했습니다.
                </ErrorTitle>

                <ErrorText>
                    FastAPI와 MongoDB가 실행 중인지 확인해주세요.
                </ErrorText>
            </LoadingPage>
        );
    }


    return (
        <Page>
            <Container>

                <PageHeader>
                    <div>
                        <Eyebrow>
                            SALES ANALYTICS
                        </Eyebrow>

                        <Title>
                            Sales Dashboard
                        </Title>

                        <Description>
                            안녕하세요, {username}님.
                            판매 현황을 한눈에 확인하세요.
                        </Description>
                    </div>

                    <ConnectionBadge>
                        <StatusDot />
                        MongoDB Connected
                    </ConnectionBadge>
                </PageHeader>


                <KpiGrid>

                    <KpiCard>
                        <KpiHeader>
                            <KpiIcon>
                                ₩
                            </KpiIcon>

                            <KpiLabel>
                                총 매출액
                            </KpiLabel>
                        </KpiHeader>

                        <KpiValue>
                            {formatMoney(
                                dashboard?.total_sales
                            )}
                        </KpiValue>

                        <KpiDescription>
                            전체 판매 매출
                        </KpiDescription>
                    </KpiCard>


                    <KpiCard>
                        <KpiHeader>
                            <KpiIcon>
                                #
                            </KpiIcon>

                            <KpiLabel>
                                총 판매수량
                            </KpiLabel>
                        </KpiHeader>

                        <KpiValue>
                            {formatNumber(
                                dashboard?.total_quantity
                            )}
                            <Unit>개</Unit>
                        </KpiValue>

                        <KpiDescription>
                            판매된 전체 상품 수량
                        </KpiDescription>
                    </KpiCard>


                    <KpiCard>
                        <KpiHeader>
                            <KpiIcon>
                                O
                            </KpiIcon>

                            <KpiLabel>
                                주문건수
                            </KpiLabel>
                        </KpiHeader>

                        <KpiValue>
                            {formatNumber(
                                dashboard?.total_orders
                            )}
                            <Unit>건</Unit>
                        </KpiValue>

                        <KpiDescription>
                            전체 주문 건수
                        </KpiDescription>
                    </KpiCard>


                    <KpiCard>
                        <KpiHeader>
                            <KpiIcon>
                                U
                            </KpiIcon>

                            <KpiLabel>
                                고객 수
                            </KpiLabel>
                        </KpiHeader>

                        <KpiValue>
                            {formatNumber(
                                dashboard?.customer_count
                            )}
                            <Unit>명</Unit>
                        </KpiValue>

                        <KpiDescription>
                            구매 고객 수
                        </KpiDescription>
                    </KpiCard>

                </KpiGrid>


                <ChartGrid>

                    <ChartCard>
                        <ChartHeader>
                            <div>
                                <ChartTitle>
                                    Top 5 제품
                                </ChartTitle>

                                <ChartDescription>
                                    매출액 기준 상위 제품
                                </ChartDescription>
                            </div>

                            <ChartBadge>
                                TOP 5
                            </ChartBadge>
                        </ChartHeader>


                        <ChartArea>
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={topProducts}
                                    layout="vertical"
                                    margin={{
                                        top: 10,
                                        right: 25,
                                        bottom: 10,
                                        left: 20
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        horizontal={false}
                                        stroke="#EEF1F6"
                                    />

                                    <XAxis
                                        type="number"
                                        tickFormatter={
                                            formatShortMoney
                                        }
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: "#94A3B8",
                                            fontSize: 11
                                        }}
                                    />

                                    <YAxis
                                        type="category"
                                        dataKey="product_name"
                                        width={110}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: "#64748B",
                                            fontSize: 11
                                        }}
                                    />

                                    <Tooltip
                                        formatter={(value) => [
                                            formatMoney(value),
                                            "매출액"
                                        ]}
                                        contentStyle={{
                                            border: "1px solid #E7EBF2",
                                            borderRadius: "10px",
                                            boxShadow:
                                                "0 8px 25px rgba(15,23,42,0.08)"
                                        }}
                                    />

                                    <Bar
                                        dataKey="sales"
                                        fill="#5B78F6"
                                        radius={[0, 7, 7, 0]}
                                        barSize={24}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartArea>
                    </ChartCard>


                    <ChartCard>
                        <ChartHeader>
                            <div>
                                <ChartTitle>
                                    카테고리별 매출
                                </ChartTitle>

                                <ChartDescription>
                                    제품 분류별 매출 비중
                                </ChartDescription>
                            </div>
                        </ChartHeader>


                        <PieSection>

                            <PieWrapper>
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <PieChart>
                                        <Pie
                                            data={categorySales}
                                            dataKey="sales"
                                            nameKey="category"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={95}
                                            paddingAngle={3}
                                        >
                                            {categorySales.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={
                                                            entry.category
                                                        }
                                                        fill={
                                                            PIE_COLORS[
                                                            index %
                                                            PIE_COLORS.length
                                                                ]
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>

                                        <Tooltip
                                            formatter={(value) => [
                                                formatMoney(value),
                                                "매출액"
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                <PieCenter>
                                    <PieCenterLabel>
                                        CATEGORY
                                    </PieCenterLabel>

                                    <PieCenterValue>
                                        {categorySales.length}
                                    </PieCenterValue>
                                </PieCenter>
                            </PieWrapper>


                            <Legend>
                                {categorySales.map(
                                    (item, index) => (
                                        <LegendItem
                                            key={item.category}
                                        >
                                            <LegendLeft>
                                                <LegendDot
                                                    $color={
                                                        PIE_COLORS[
                                                        index %
                                                        PIE_COLORS.length
                                                            ]
                                                    }
                                                />

                                                <LegendName>
                                                    {item.category}
                                                </LegendName>
                                            </LegendLeft>

                                            <LegendValue>
                                                {formatMoney(
                                                    item.sales
                                                )}
                                            </LegendValue>
                                        </LegendItem>
                                    )
                                )}
                            </Legend>

                        </PieSection>

                    </ChartCard>

                </ChartGrid>


                <TableCard>

                    <ChartHeader>
                        <div>
                            <ChartTitle>
                                인기 제품 순위
                            </ChartTitle>

                            <ChartDescription>
                                매출액 기준 Top 5 상세 현황
                            </ChartDescription>
                        </div>
                    </ChartHeader>


                    <Table>

                        <thead>
                        <tr>
                            <th>순위</th>
                            <th>제품명</th>
                            <th>판매수량</th>
                            <th>매출액</th>
                        </tr>
                        </thead>

                        <tbody>
                        {topProducts.map(
                            (product, index) => (
                                <tr key={product.product_name}>
                                    <td>
                                        <Rank $top={index === 0}>
                                            {index + 1}
                                        </Rank>
                                    </td>

                                    <td>
                                        <ProductName>
                                            {product.product_name}
                                        </ProductName>
                                    </td>

                                    <td>
                                        {formatNumber(
                                            product.quantity
                                        )}개
                                    </td>

                                    <td>
                                        <SalesValue>
                                            {formatMoney(
                                                product.sales
                                            )}
                                        </SalesValue>
                                    </td>
                                </tr>
                            )
                        )}
                        </tbody>

                    </Table>

                </TableCard>

            </Container>
        </Page>
    );
};

export default HomePage;


const Page = styled.main`
    min-height: calc(100vh - 72px);
    background: #f7f9fc;
    padding: 42px 24px 70px;
`;

const Container = styled.div`
    width: 100%;
    max-width: 1180px;
    margin: 0 auto;
`;

const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 20px;
    margin-bottom: 30px;
`;

const Eyebrow = styled.div`
    margin-bottom: 7px;
    color: #647cf4;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.5px;
`;

const Title = styled.h1`
    color: #172033;
    font-size: 30px;
    font-weight: 750;
    letter-spacing: -1.3px;
`;

const Description = styled.p`
    margin-top: 8px;
    color: #8a96a8;
    font-size: 14px;
`;

const ConnectionBadge = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    padding: 9px 13px;

    border: 1px solid #e4e9f1;
    border-radius: 100px;

    background: white;

    color: #64748b;
    font-size: 12px;
    font-weight: 600;
`;

const StatusDot = styled.span`
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
`;

const KpiGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 550px) {
        grid-template-columns: 1fr;
    }
`;

const KpiCard = styled.div`
    padding: 22px;

    border: 1px solid #e7ebf2;
    border-radius: 16px;

    background: white;

    box-shadow: 0 5px 20px rgba(15, 23, 42, 0.035);

    transition: 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.07);
    }
`;

const KpiHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const KpiIcon = styled.div`
    width: 32px;
    height: 32px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 9px;

    background: #eef2ff;
    color: #5873ef;

    font-size: 13px;
    font-weight: 800;
`;

const KpiLabel = styled.div`
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
`;

const KpiValue = styled.div`
    margin-top: 18px;

    color: #182235;

    font-size: 25px;
    font-weight: 750;
    letter-spacing: -1px;
`;

const Unit = styled.span`
    margin-left: 3px;
    color: #7c899b;
    font-size: 13px;
    font-weight: 500;
`;

const KpiDescription = styled.div`
    margin-top: 7px;

    color: #a0aaba;
    font-size: 11px;
`;

const ChartGrid = styled.div`
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 18px;

    margin-top: 18px;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

const ChartCard = styled.div`
    min-width: 0;
    padding: 23px;

    border: 1px solid #e7ebf2;
    border-radius: 16px;

    background: white;

    box-shadow: 0 5px 20px rgba(15, 23, 42, 0.035);
`;

const ChartHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const ChartTitle = styled.h2`
    color: #253044;
    font-size: 15px;
    font-weight: 700;
`;

const ChartDescription = styled.p`
    margin-top: 5px;

    color: #9aa5b5;
    font-size: 11px;
`;

const ChartBadge = styled.span`
    padding: 5px 9px;

    border-radius: 7px;

    background: #f0f3ff;
    color: #6178e7;

    font-size: 10px;
    font-weight: 700;
`;

const ChartArea = styled.div`
    width: 100%;
    height: 310px;
    margin-top: 25px;
`;

const PieSection = styled.div`
    margin-top: 15px;
`;

const PieWrapper = styled.div`
    position: relative;

    width: 100%;
    height: 220px;
`;

const PieCenter = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);

    text-align: center;
    pointer-events: none;
`;

const PieCenterLabel = styled.div`
    color: #a0aaba;
    font-size: 9px;
    font-weight: 700;
`;

const PieCenterValue = styled.div`
    margin-top: 2px;

    color: #283449;
    font-size: 22px;
    font-weight: 750;
`;

const Legend = styled.div`
    display: flex;
    flex-direction: column;
    gap: 9px;
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 7px 0;

    border-bottom: 1px solid #f0f2f6;
`;

const LegendLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const LegendDot = styled.div`
    width: 8px;
    height: 8px;

    border-radius: 50%;

    background: ${({ $color }) => $color};
`;

const LegendName = styled.span`
    color: #64748b;
    font-size: 11px;
`;

const LegendValue = styled.span`
    color: #475569;
    font-size: 11px;
    font-weight: 650;
`;

const TableCard = styled.div`
    margin-top: 18px;
    padding: 23px;

    overflow-x: auto;

    border: 1px solid #e7ebf2;
    border-radius: 16px;

    background: white;

    box-shadow: 0 5px 20px rgba(15, 23, 42, 0.035);
`;

const Table = styled.table`
    width: 100%;
    margin-top: 20px;

    border-collapse: collapse;

    th {
        padding: 12px 15px;

        border-bottom: 1px solid #e8edf3;

        color: #94a3b8;
        font-size: 11px;
        font-weight: 600;

        text-align: left;
    }

    td {
        padding: 14px 15px;

        border-bottom: 1px solid #f0f2f5;

        color: #64748b;
        font-size: 12px;
    }

    tbody tr:last-child td {
        border-bottom: none;
    }

    tbody tr:hover {
        background: #fafbfe;
    }
`;

const Rank = styled.div`
    width: 27px;
    height: 27px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 8px;

    background: ${({ $top }) =>
    $top ? "#eef2ff" : "#f5f7fa"};

    color: ${({ $top }) =>
    $top ? "#536ff0" : "#7c899b"};

    font-weight: 700;
`;

const ProductName = styled.span`
    color: #334155;
    font-weight: 600;
`;

const SalesValue = styled.span`
    color: #536ff0;
    font-weight: 650;
`;

const LoadingPage = styled.div`
    min-height: calc(100vh - 72px);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background: #f7f9fc;
`;

const Spinner = styled.div`
    width: 30px;
    height: 30px;

    border: 3px solid #e4e8f0;
    border-top-color: #5b78f6;
    border-radius: 50%;

    animation: spin 0.8s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

const LoadingText = styled.div`
    margin-top: 15px;
    color: #8491a5;
    font-size: 13px;
`;

const ErrorTitle = styled.h2`
    color: #334155;
    font-size: 18px;
`;

const ErrorText = styled.p`
    margin-top: 8px;
    color: #94a3b8;
    font-size: 13px;
`;