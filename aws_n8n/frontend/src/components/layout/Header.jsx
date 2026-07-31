import styled from "styled-components";

const Header = () => {
    return (
        <Container>
            <Brand>
                <Logo>MA</Logo>

                <BrandText>
                    <Title>Menu Assistant</Title>
                    <Subtitle>Understand menus and prepare your order</Subtitle>
                </BrandText>
            </Brand>

            <LanguageButton type="button">English</LanguageButton>
        </Container>
    );
};

export default Header;

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76px;
  padding: 14px 28px;
  border-bottom: 1px solid #e1e7f0;
  background: #ffffff;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.div`
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, #3389ff, #7aaeff);
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const Title = styled.h1`
  margin: 0;
  color: #172033;
  font-size: 20px;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #7b879c;
  font-size: 13px;
`;

const LanguageButton = styled.button`
  padding: 10px 14px;
  border: 1px solid #dce3ed;
  border-radius: 10px;
  background: #ffffff;
  color: #344054;
`;