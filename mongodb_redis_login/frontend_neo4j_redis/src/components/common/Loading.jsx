import styled from "styled-components";

const Loading = ({
                     message = "데이터를 불러오는 중입니다.",
                 }) => {
    return (
        <Container>
            <Spinner />
            <span>{message}</span>
        </Container>
    );
};

export default Loading;

const Container = styled.div`
    min-height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    color: #64748b;
`;

const Spinner = styled.div`
    width: 36px;
    height: 36px;
    border: 4px solid #dbeafe;
    border-top-color: #0284c7;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;