import styled from "styled-components";

const PageHeader = ({
                        title,
                        description,
                        children,
                    }) => {
    return (
        <Container>
            <TextArea>
                <Title>{title}</Title>

                {description && (
                    <Description>
                        {description}
                    </Description>
                )}
            </TextArea>

            {children && (
                <ActionArea>
                    {children}
                </ActionArea>
            )}
        </Container>
    );
};

export default PageHeader;

const Container = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 24px;
`;

const TextArea = styled.div`
    min-width: 0;
`;

const Title = styled.h1`
    margin: 0;
    color: #0f172a;
    font-size: 28px;
`;

const Description = styled.p`
    margin: 8px 0 0;
    color: #64748b;
`;

const ActionArea = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;