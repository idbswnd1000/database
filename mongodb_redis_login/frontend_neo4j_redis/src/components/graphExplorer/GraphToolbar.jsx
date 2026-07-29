import styled from "styled-components";

export const GRAPH_TYPES = [
    {
        id: "network",
        name: "네트워크",
    },
    {
        id: "radial",
        name: "방사형",
    },
    {
        id: "cluster",
        name: "클러스터",
    },
    {
        id: "timeline",
        name: "타임라인",
    },
    {
        id: "hierarchy",
        name: "계층형",
    },
];

const GraphToolbar = ({
                          selectedType,
                          onChange,
                      }) => {
    return (
        <Container>
            {GRAPH_TYPES.map(
                (type) => (
                    <TabButton
                        key={type.id}
                        type="button"
                        $active={
                            selectedType ===
                            type.id
                        }
                        onClick={() =>
                            onChange(
                                type.id,
                            )
                        }
                    >
                        {type.name}
                    </TabButton>
                ),
            )}
        </Container>
    );
};

export default GraphToolbar;

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const TabButton = styled.button`
    border: 1px solid
        ${({ $active }) =>
    $active
        ? "#0284c7"
        : "#cbd5e1"};
    border-radius: 10px;
    padding: 10px 15px;
    background: ${({ $active }) =>
    $active
        ? "#0284c7"
        : "#ffffff"};
    color: ${({ $active }) =>
    $active
        ? "#ffffff"
        : "#475569"};
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
`;