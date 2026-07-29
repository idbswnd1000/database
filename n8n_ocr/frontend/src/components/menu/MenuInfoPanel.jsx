import styled from "styled-components";
import MenuChat from "./MenuChat";
const MenuInfoPanel = ({
                           menu,
                           isLoading,
                           onAddOrder,
                       }) => {
    if (isLoading) {
        return (
            <LoadingState>
                <Spinner />

                <LoadingTitle>
                    메뉴 상세정보 분석 중
                </LoadingTitle>

                <LoadingText>
                    번역, 설명, 재료, 알레르기 및 영양정보를
                    가져오고 있습니다.
                </LoadingText>
            </LoadingState>
        );
    }

    if (!menu) {
        return (
            <EmptyState>
                <EmptyIcon>🍽️</EmptyIcon>

                <EmptyTitle>
                    메뉴를 선택해주세요
                </EmptyTitle>

                <EmptyText>
                    메뉴판 분석이 끝나면 이미지 위에 표시된 메뉴
                    영역을 클릭하세요.
                </EmptyText>
            </EmptyState>
        );
    }

    return (
        <Container>
            <TopSection>
                <Label>선택한 메뉴</Label>

                <MenuName>{menu.menuName}</MenuName>

                <Price>
                    {menu.price.toLocaleString("ko-KR")}원
                </Price>
            </TopSection>

            <TranslationGrid>
                <TranslationCard>
                    <TranslationLabel>English</TranslationLabel>
                    <TranslationValue>
                        {menu.translations?.english || "정보 없음"}
                    </TranslationValue>
                </TranslationCard>

                <TranslationCard>
                    <TranslationLabel>中文</TranslationLabel>
                    <TranslationValue>
                        {menu.translations?.chinese || "信息不可用"}
                    </TranslationValue>
                </TranslationCard>

                <TranslationCard>
                    <TranslationLabel>日本語</TranslationLabel>
                    <TranslationValue>
                        {menu.translations?.japanese || "情報なし"}
                    </TranslationValue>
                </TranslationCard>
            </TranslationGrid>

            <Section>
                <SectionTitle>음식 설명</SectionTitle>

                <Description>
                    {menu.description ||
                        "일반적인 음식 설명을 찾지 못했습니다."}
                </Description>
            </Section>

            <InformationGrid>
                <InfoCard>
                    <InfoLabel>맛</InfoLabel>

                    <TagList>
                        {(menu.flavor || []).length > 0 ? (
                            menu.flavor.map((item) => (
                                <Tag key={item}>{item}</Tag>
                            ))
                        ) : (
                            <EmptyValue>정보 없음</EmptyValue>
                        )}
                    </TagList>
                </InfoCard>

                <InfoCard>
                    <InfoLabel>조리 방식</InfoLabel>

                    <InfoValue>
                        {menu.cookingMethod || "정보 없음"}
                    </InfoValue>
                </InfoCard>
            </InformationGrid>

            <Details open>
                <summary>일반적인 재료</summary>

                <List>
                    {(menu.ingredients || []).length > 0 ? (
                        menu.ingredients.map((item) => (
                            <li key={item}>{item}</li>
                        ))
                    ) : (
                        <li>정보 없음</li>
                    )}
                </List>
            </Details>

            <Details open>
                <summary>가능한 알레르기 성분</summary>

                <List>
                    {(menu.allergens || []).length > 0 ? (
                        menu.allergens.map((item) => (
                            <li key={item}>{item}</li>
                        ))
                    ) : (
                        <li>확인된 정보 없음</li>
                    )}
                </List>
            </Details>

            <Details open>
                <summary>예상 영양정보</summary>

                <NutritionList>
                    <span>열량</span>
                    <strong>
                        {menu.nutrition?.calories || "정보 없음"}
                    </strong>

                    <span>단백질</span>
                    <strong>
                        {menu.nutrition?.protein || "정보 없음"}
                    </strong>

                    <span>탄수화물</span>
                    <strong>
                        {menu.nutrition?.carbohydrates ||
                            "정보 없음"}
                    </strong>

                    <span>지방</span>
                    <strong>
                        {menu.nutrition?.fat || "정보 없음"}
                    </strong>
                </NutritionList>
            </Details>

            <Notice>
                재료, 알레르기 및 영양정보는 일반적인 조리법을
                바탕으로 한 예상 정보입니다. 필요한 경우
                음식점에 직접 확인해주세요.
            </Notice>

            <AddButton
                type="button"
                onClick={() => onAddOrder(menu)}
            >
                주문 목록에 추가
            </AddButton>
            <MenuChat menu={menu} />
        </Container>
    );
};

export default MenuInfoPanel;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
`;

const TopSection = styled.div`
  padding-bottom: 17px;
  border-bottom: 1px solid #e5eaf1;
`;

const Label = styled.span`
  display: block;
  margin-bottom: 8px;
  color: #7b879c;
  font-size: 13px;
`;

const MenuName = styled.h2`
  margin: 0;
  color: #172033;
  font-size: 28px;
`;

const Price = styled.strong`
  display: block;
  margin-top: 12px;
  color: #287de5;
  font-size: 24px;
`;

const TranslationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 9px;
`;

const TranslationCard = styled.div`
  padding: 13px 14px;
  border: 1px solid #e1e7ef;
  border-radius: 11px;
  background: #f8fafc;
`;

const TranslationLabel = styled.span`
  display: block;
  margin-bottom: 5px;
  color: #7b879c;
  font-size: 11px;
  font-weight: 700;
`;

const TranslationValue = styled.strong`
  color: #273349;
  font-size: 14px;
`;

const Section = styled.section``;

const SectionTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 15px;
`;

const Description = styled.p`
  margin: 0;
  color: #566176;
  font-size: 14px;
  line-height: 1.7;
`;

const InformationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const InfoCard = styled.div`
  padding: 14px;
  border: 1px solid #e3e8f0;
  border-radius: 12px;
  background: #f8fafc;
`;

const InfoLabel = styled.div`
  margin-bottom: 9px;
  color: #7c8799;
  font-size: 12px;
`;

const InfoValue = styled.strong`
  font-size: 14px;
`;

const EmptyValue = styled.span`
  color: #8b96a8;
  font-size: 13px;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span`
  padding: 5px 8px;
  border-radius: 999px;
  background: #e7f1ff;
  color: #2568ba;
  font-size: 11px;
`;

const Details = styled.details`
  padding: 14px 15px;
  border: 1px solid #e3e8f0;
  border-radius: 12px;
  background: #ffffff;

  summary {
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
  }
`;

const List = styled.ul`
  margin: 13px 0 0;
  padding-left: 20px;
  color: #596579;
  font-size: 13px;
  line-height: 1.8;
`;

const NutritionList = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  margin-top: 14px;
  color: #596579;
  font-size: 13px;
`;

const Notice = styled.p`
  margin: 0;
  padding: 12px;
  border-radius: 10px;
  background: #fff7e6;
  color: #826119;
  font-size: 12px;
  line-height: 1.6;
`;

const AddButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: #287de5;
  color: #ffffff;
  font-weight: 800;
`;

const EmptyState = styled.div`
  display: flex;
  min-height: 520px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 35px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  margin-bottom: 16px;
  font-size: 52px;
`;

const EmptyTitle = styled.h3`
  margin: 0;
  font-size: 21px;
`;

const EmptyText = styled.p`
  max-width: 350px;
  margin: 12px 0 0;
  color: #7d899c;
  line-height: 1.7;
`;

const LoadingState = styled.div`
  display: flex;
  min-height: 520px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Spinner = styled.div`
  width: 44px;
  height: 44px;
  margin-bottom: 18px;
  border: 5px solid #dceaff;
  border-top-color: #287de5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingTitle = styled.h3`
  margin: 0;
  font-size: 20px;
`;

const LoadingText = styled.p`
  max-width: 340px;
  margin: 10px 0 0;
  color: #7b879c;
  font-size: 14px;
  line-height: 1.7;
`;