import styled from "styled-components";

const MainLayout = ({ left, right }) => {
    return (
        <Container>
            <LeftSection>{left}</LeftSection>
            <RightSection>{right}</RightSection>
        </Container>
    );
};

export default MainLayout;

const Container = styled.main`
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(360px, 2fr);
  gap: 20px;
  width: 100%;
  max-width: 1500px;
  min-height: calc(100vh - 76px);
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const LeftSection = styled.section`
  min-width: 0;
`;

const RightSection = styled.section`
  min-width: 0;
`;