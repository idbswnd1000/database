import styled from "styled-components";

const KpiCard = ({
                     title,
                     value,
                     description,
                 }) => {
    return (
        <Card>
            <Title>{title}</Title>
            <Value>{value}</Value>

            {description && (
                <Description>
                    {description}
                </Description>
            )}
        </Card>
    );
};

export default KpiCard;

const Card = styled.article`
    padding: 22px;
    border: 1px solid #dbe7f3;
    border-radius: 18px;
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #f0f9ff
        );
    box-shadow:
        0 10px 28px
        rgba(15, 23, 42, 0.06);
`;

const Title = styled.div`
    color: #64748b;
    font-size: 14px;
    font-weight: 700;
`;

const Value = styled.div`
    margin-top: 12px;
    color: #0f172a;
    font-size: 28px;
    font-weight: 900;
`;

const Description = styled.div`
    margin-top: 8px;
    color: #94a3b8;
    font-size: 12px;
`;