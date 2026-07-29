import styled from "styled-components";

const ChartCard = ({
                       title,
                       children,
                   }) => {
    return (
        <Card>
            <Title>{title}</Title>
            <Content>{children}</Content>
        </Card>
    );
};

export default ChartCard;

const Card = styled.section`
    min-width: 0;
    padding: 22px;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    background: #ffffff;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 18px;
`;

const Content = styled.div`
    height: 310px;
    margin-top: 20px;
`;