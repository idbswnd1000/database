
import styled from "styled-components";

const legendItems = [
    {
        label: "Customer",
        color: "#38bdf8",
    },
    {
        label: "Sale",
        color: "#22c55e",
    },
    {
        label: "Product",
        color: "#f59e0b",
    },
    {
        label: "ProductCategory",
        color: "#a78bfa",
    },
    {
        label: "Category",
        color: "#ec4899",
    },
    {
        label: "Region",
        color: "#14b8a6",
    },
    {
        label: "Channel",
        color: "#06b6d4",
    },
    {
        label: "Promotion",
        color: "#f43f5e",
    },
    {
        label: "Date",
        color: "#94a3b8",
    },
];

const GraphLegend = () => {
    return (
        <Container>
            {legendItems.map((item) => (
                <Item key={item.label}>
                    <ColorDot $color={item.color} />
                    <span>{item.label}</span>
                </Item>
            ))}
        </Container>
    );
};

export default GraphLegend;

const Container = styled.div`
    position: absolute;
    bottom: 16px;
    left: 16px;
    z-index: 10;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 14px;
    max-width: calc(100% - 32px);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 10px;
    padding: 10px 12px;
    background: rgba(15, 23, 42, 0.86);
    color: #e2e8f0;
    font-size: 12px;
`;

const Item = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const ColorDot = styled.span`
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
`;