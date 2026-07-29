import {
    useMemo,
} from "react";
import styled from "styled-components";

const GraphStatistics = ({
                             graphData,
                         }) => {
    const statistics =
        useMemo(() => {
            const nodeCount =
                graphData?.nodes
                    ?.length ?? 0;

            const linkCount =
                graphData?.links
                    ?.length ?? 0;

            const averageDegree =
                nodeCount === 0
                    ? 0
                    : (linkCount * 2) /
                    nodeCount;

            const maxLinks =
                nodeCount <= 1
                    ? 0
                    : (nodeCount *
                        (nodeCount -
                            1)) /
                    2;

            const density =
                maxLinks === 0
                    ? 0
                    : linkCount /
                    maxLinks;

            return {
                nodeCount,
                linkCount,
                averageDegree,
                density,
            };
        }, [graphData]);

    return (
        <Container>
            <Card>
                <Label>
                    노드
                </Label>

                <Value>
                    {
                        statistics.nodeCount
                    }
                </Value>
            </Card>

            <Card>
                <Label>
                    관계
                </Label>

                <Value>
                    {
                        statistics.linkCount
                    }
                </Value>
            </Card>

            <Card>
                <Label>
                    평균 연결 수
                </Label>

                <Value>
                    {statistics.averageDegree.toFixed(
                        2,
                    )}
                </Value>
            </Card>

            <Card>
                <Label>
                    밀도
                </Label>

                <Value>
                    {(
                        statistics.density *
                        100
                    ).toFixed(2)}
                    %
                </Value>
            </Card>
        </Container>
    );
};

export default GraphStatistics;

const Container = styled.div`
    display: grid;
    grid-template-columns:
        repeat(4, minmax(0, 1fr));
    gap: 14px;
`;

const Card = styled.div`
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 16px 18px;
    background: #ffffff;
`;

const Label = styled.div`
    margin-bottom: 7px;
    color: #64748b;
    font-size: 13px;
`;

const Value = styled.div`
    color: #0f172a;
    font-size: 23px;
    font-weight: 800;
`;