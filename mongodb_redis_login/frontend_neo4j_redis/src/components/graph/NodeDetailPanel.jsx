import styled from "styled-components";

const formatPropertyValue = (value) => {
    if (value === null || value === undefined) {
        return "-";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
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

    const properties = Object.entries(
        node.properties ?? {},
    );

    return (
        <Panel>
            <Header>
                <div>
                    <Label>{node.label}</Label>
                    <Title>{node.title}</Title>
                </div>

                <CloseButton
                    type="button"
                    onClick={onClose}
                >
                    ×
                </CloseButton>
            </Header>

            <PropertyList>
                <PropertyRow>
                    <PropertyName>ID</PropertyName>
                    <PropertyValue>
                        {node.id}
                    </PropertyValue>
                </PropertyRow>

                {properties.map(([key, value]) => (
                    <PropertyRow key={key}>
                        <PropertyName>
                            {key}
                        </PropertyName>

                        <PropertyValue>
                            {formatPropertyValue(value)}
                        </PropertyValue>
                    </PropertyRow>
                ))}
            </PropertyList>
        </Panel>
    );
};

export default NodeDetailPanel;

const Panel = styled.aside`
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 20;
    width: 320px;
    max-height: calc(100% - 32px);
    overflow-y: auto;
    border: 1px solid #334155;
    border-radius: 14px;
    padding: 18px;
    background: rgba(15, 23, 42, 0.96);
    color: #f8fafc;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
`;

const Header = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
`;

const Label = styled.div`
    margin-bottom: 6px;
    color: #38bdf8;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
`;

const Title = styled.h3`
    margin: 0;
    font-size: 20px;
`;

const CloseButton = styled.button`
    border: none;
    background: transparent;
    color: #cbd5e1;
    font-size: 25px;
    cursor: pointer;
`;

const PropertyList = styled.div`
    display: flex;
    flex-direction: column;
`;

const PropertyRow = styled.div`
    display: grid;
    grid-template-columns: 105px 1fr;
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
    color: #f1f5f9;
    font-size: 13px;
`;