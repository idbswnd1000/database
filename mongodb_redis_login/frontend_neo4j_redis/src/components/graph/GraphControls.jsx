import styled from "styled-components";

const GraphControls = ({
                           onZoomToFit,
                           onResetCamera,
                           onClearSelection,
                       }) => {
    return (
        <Container>
            <ControlButton
                type="button"
                onClick={onZoomToFit}
            >
                화면 맞춤
            </ControlButton>

            <ControlButton
                type="button"
                onClick={onResetCamera}
            >
                시점 초기화
            </ControlButton>

            <ControlButton
                type="button"
                onClick={onClearSelection}
            >
                선택 해제
            </ControlButton>
        </Container>
    );
};

export default GraphControls;

const Container = styled.div`
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 10;
    display: flex;
    gap: 8px;
`;

const ControlButton = styled.button`
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 9px 13px;
    background: rgba(15, 23, 42, 0.9);
    color: #f8fafc;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
        background: #1e293b;
    }
`;