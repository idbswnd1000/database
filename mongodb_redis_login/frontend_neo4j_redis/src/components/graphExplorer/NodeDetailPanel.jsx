import styled from "styled-components";

const formatValue = (value) => {
    if (
        value === null ||
        value === undefined
    ) {
        return "-";
    }

    if (
        typeof value === "object"
    ) {
        return JSON.stringify(
            value,
        );
    }

    return String(value);
};

const NodeDetailPanel = ({
                             node,
                             onClose,
                         }) => {
    if (!node) {
        return null;
    }

    const properties =
        node.properties ?? {};

    return (
        <Panel>
            <Header>
                <div>
                    <Label>
                        {node.label ??
                            "Node"}
                    </Label>

                    <Title>
                        {node.title ??
                            properties.name ??
                            node.id}
                    </Title>
                </div>

                <CloseButton
                    type="button"
                    onClick={onClose}
                >
                    ×
                </CloseButton>
            </Header>

            <PropertyRow>
                <PropertyName>
                    ID
                </PropertyName>

                <PropertyValue>
                    {node.id}
                </PropertyValue>
            </PropertyRow>

            {Object.entries(
                properties,
            ).map(
                ([key, value]) => (
                    <PropertyRow
                        key={key}
                    >
                        <PropertyName>
                            {key}
                        </PropertyName>

                        <PropertyValue>
                            {formatValue(
                                value,
                            )}
                        </PropertyValue>
                    </PropertyRow>
                ),
            )}
        </Panel>
    );
};

export default NodeDetailPanel;

const Panel = styled.aside`
    position: absolute;
    top: 18px;
    right: 18px;
    z-index: 20;
    width: 310px;
    max-height: calc(100% - 36px);
    overflow-y: auto;
    border: 1px solid #334155;
    border-radius: 14px;
    padding: 18px;
    background: rgba(15, 23, 42, 0.96);
    color: #f8fafc;
    box-shadow: 0 18px 45px
        rgba(0, 0, 0, 0.35);
`;

const Header = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
`;

const Label = styled.div`
    margin-bottom: 6px;
    color: #38bdf8;
    font-size: 12px;
    font-weight: 700;
`;

const Title = styled.h3`
    margin: 0;
    font-size: 19px;
`;

const CloseButton = styled.button`
    border: none;
    background: transparent;
    color: #cbd5e1;
    font-size: 24px;
    cursor: pointer;
`;

const PropertyRow = styled.div`
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 12px;
    border-top: 1px solid #273449;
    padding: 11px 0;
`;

const PropertyName = styled.div`
    color: #94a3b8;
    font-size: 13px;
`;

const PropertyValue = styled.div`
    overflow-wrap: anywhere;
    font-size: 13px;
`;