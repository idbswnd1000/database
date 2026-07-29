import styled from "styled-components";

const SelectPanel = ({
                         title,
                         items = [],
                         selectedId,
                         onSelect,
                         getId,
                         getTitle,
                         getDescription,
                         keyword,
                         onKeywordChange,
                     }) => {
    return (
        <Container>
            <Header>
                <Title>{title}</Title>

                <SearchInput
                    value={keyword}
                    onChange={(event) =>
                        onKeywordChange(
                            event.target.value,
                        )
                    }
                    placeholder="검색"
                />
            </Header>

            <List>
                {items.map((item) => {
                    const id = getId(item);

                    return (
                        <ItemButton
                            key={id}
                            type="button"
                            $active={
                                selectedId === id
                            }
                            onClick={() =>
                                onSelect(id)
                            }
                        >
                            <ItemTitle>
                                {getTitle(item)}
                            </ItemTitle>

                            {getDescription && (
                                <ItemDescription>
                                    {getDescription(
                                        item,
                                    )}
                                </ItemDescription>
                            )}
                        </ItemButton>
                    );
                })}

                {items.length === 0 && (
                    <EmptyMessage>
                        표시할 데이터가 없습니다.
                    </EmptyMessage>
                )}
            </List>
        </Container>
    );
};

export default SelectPanel;

const Container = styled.aside`
    width: 310px;
    min-width: 310px;
    height: calc(100vh - 160px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    background: #ffffff;
`;

const Header = styled.div`
    padding: 18px;
    border-bottom: 1px solid #e2e8f0;
`;

const Title = styled.h2`
    margin: 0 0 14px;
    font-size: 18px;
`;

const SearchInput = styled.input`
    width: 100%;
    height: 42px;
    padding: 0 13px;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    outline: none;

    &:focus {
        border-color: #38bdf8;
    }
`;

const List = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 10px;
`;

const ItemButton = styled.button`
    width: 100%;
    padding: 13px;
    border: none;
    border-radius: 11px;
    background: ${({ $active }) =>
    $active
        ? "#e0f2fe"
        : "transparent"};
    text-align: left;
    cursor: pointer;

    &:hover {
        background: #f1f5f9;
    }
`;

const ItemTitle = styled.div`
    color: #0f172a;
    font-weight: 700;
`;

const ItemDescription = styled.div`
    margin-top: 5px;
    color: #64748b;
    font-size: 13px;
`;

const EmptyMessage = styled.p`
    padding: 18px;
    color: #94a3b8;
    text-align: center;
`;