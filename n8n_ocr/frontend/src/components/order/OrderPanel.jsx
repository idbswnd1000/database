import styled from "styled-components";

const OrderPanel = ({
                        orderItems,
                        onIncrease,
                        onDecrease,
                        onRemove,
                        onClear,
                    }) => {
    const totalPrice = orderItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0,
    );

    if (orderItems.length === 0) {
        return (
            <EmptyState>
                <EmptyIcon>🛒</EmptyIcon>

                <EmptyTitle>
                    주문 목록이 비어 있습니다
                </EmptyTitle>

                <EmptyText>
                    메뉴 정보를 확인한 후 주문 목록에 추가하세요.
                </EmptyText>
            </EmptyState>
        );
    }

    return (
        <Container>
            <OrderHeader>
                <Title>주문 목록</Title>

                <ClearButton
                    type="button"
                    onClick={onClear}
                >
                    전체 삭제
                </ClearButton>
            </OrderHeader>

            <ItemList>
                {orderItems.map((item) => (
                    <OrderItem key={item.id}>
                        <ItemInformation>
                            <ItemName>
                                {item.menuName}
                            </ItemName>

                            <TranslatedName>
                                {item.translatedName}
                            </TranslatedName>

                            <ItemPrice>
                                {item.price.toLocaleString("ko-KR")}원
                            </ItemPrice>
                        </ItemInformation>

                        <ItemActions>
                            <QuantityControl>
                                <QuantityButton
                                    type="button"
                                    onClick={() =>
                                        onDecrease(item.id)
                                    }
                                >
                                    −
                                </QuantityButton>

                                <Quantity>
                                    {item.quantity}
                                </Quantity>

                                <QuantityButton
                                    type="button"
                                    onClick={() =>
                                        onIncrease(item.id)
                                    }
                                >
                                    +
                                </QuantityButton>
                            </QuantityControl>

                            <RemoveButton
                                type="button"
                                onClick={() =>
                                    onRemove(item.id)
                                }
                            >
                                삭제
                            </RemoveButton>
                        </ItemActions>
                    </OrderItem>
                ))}
            </ItemList>

            <TotalSection>
                <TotalLabel>총금액</TotalLabel>

                <TotalPrice>
                    {totalPrice.toLocaleString("ko-KR")}원
                </TotalPrice>
            </TotalSection>
        </Container>
    );
};

export default OrderPanel;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const EmptyState = styled.div`
    display: flex;
    min-height: 520px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    margin: 10px 0 0;
    color: #7b879a;
`;

const OrderHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 22px;
`;

const ClearButton = styled.button`
    padding: 8px 10px;
    border-radius: 8px;
    background: #fff0f0;
    color: #d94c4c;
    font-size: 12px;
`;

const ItemList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const OrderItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 14px;
    border: 1px solid #e3e8f0;
    border-radius: 13px;
    background: #ffffff;
`;

const ItemInformation = styled.div`
    min-width: 0;
`;

const ItemName = styled.strong`
    display: block;
    font-size: 15px;
`;

const TranslatedName = styled.span`
    display: block;
    margin-top: 4px;
    color: #8791a2;
    font-size: 12px;
`;

const ItemPrice = styled.span`
    display: block;
    margin-top: 7px;
    color: #256fce;
    font-size: 13px;
    font-weight: 700;
`;

const ItemActions = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
`;

const QuantityControl = styled.div`
    display: flex;
    align-items: center;
    overflow: hidden;
    border: 1px solid #dce3ed;
    border-radius: 9px;
`;

const QuantityButton = styled.button`
    width: 31px;
    height: 31px;
    background: #f5f7fa;
    color: #344054;
`;

const Quantity = styled.span`
    display: grid;
    width: 32px;
    height: 31px;
    place-items: center;
    font-size: 13px;
`;

const RemoveButton = styled.button`
    background: transparent;
    color: #d64d4d;
    font-size: 11px;
`;

const TotalSection = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: 5px;
    padding: 18px 4px 4px;
    border-top: 1px solid #dfe5ed;
`;

const TotalLabel = styled.span`
    color: #667085;
`;

const TotalPrice = styled.strong`
    color: #172033;
    font-size: 26px;
`;