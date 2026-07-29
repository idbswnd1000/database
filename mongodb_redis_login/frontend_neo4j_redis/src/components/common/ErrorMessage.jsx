import styled from "styled-components";

const ErrorMessage = ({
                          error,
                      }) => {
    const message =
        error?.response?.data?.detail ||
        error?.message ||
        "데이터를 불러오지 못했습니다.";

    return (
        <Container>
            <Title>
                요청 처리 실패
            </Title>

            <Message>{message}</Message>
        </Container>
    );
};

export default ErrorMessage;

const Container = styled.div`
    padding: 20px;
    border: 1px solid #fecaca;
    border-radius: 14px;
    background: #fef2f2;
`;

const Title = styled.strong`
    color: #b91c1c;
`;

const Message = styled.p`
    margin: 8px 0 0;
    color: #7f1d1d;
`;