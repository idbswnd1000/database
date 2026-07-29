import styled from "styled-components";

const GraphFilter = ({
                         labels,
                         selectedLabels,
                         onChange,
                     }) => {
    const handleToggle = (
        label,
    ) => {
        if (
            selectedLabels.includes(
                label,
            )
        ) {
            onChange(
                selectedLabels.filter(
                    (item) =>
                        item !== label,
                ),
            );

            return;
        }

        onChange([
            ...selectedLabels,
            label,
        ]);
    };

    const allSelected =
        labels.length > 0 &&
        selectedLabels.length ===
        labels.length;

    return (
        <Container>
            <Header>
                <Title>
                    노드 필터
                </Title>

                <ToggleButton
                    type="button"
                    onClick={() =>
                        onChange(
                            allSelected
                                ? []
                                : labels,
                        )
                    }
                >
                    {allSelected
                        ? "전체 해제"
                        : "전체 선택"}
                </ToggleButton>
            </Header>

            <LabelList>
                {labels.map(
                    (label) => (
                        <LabelItem
                            key={label}
                        >
                            <input
                                type="checkbox"
                                checked={selectedLabels.includes(
                                    label,
                                )}
                                onChange={() =>
                                    handleToggle(
                                        label,
                                    )
                                }
                            />

                            <span>
                                {label}
                            </span>
                        </LabelItem>
                    ),
                )}
            </LabelList>
        </Container>
    );
};

export default GraphFilter;

const Container = styled.aside`
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 16px;
    background: #ffffff;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
`;

const Title = styled.h3`
    margin: 0;
    color: #0f172a;
    font-size: 15px;
`;

const ToggleButton = styled.button`
    border: none;
    background: transparent;
    color: #0284c7;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
`;

const LabelList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const LabelItem = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #475569;
    font-size: 13px;
    cursor: pointer;
`;