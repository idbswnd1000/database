import {
    useMemo,
    useState,
} from "react";
import styled from "styled-components";

import Graph3D from "../components/graph/Graph3D";
import { CYPHER_EXAMPLES } from "../data/cypherExamples";
import { useExecuteCypher } from "../hooks/useCypher";
import { normalizeGraphData } from "../utils/graphUtils";

const initialExample =
    CYPHER_EXAMPLES[0];

const CypherPage = () => {
    const [selectedExampleId, setSelectedExampleId] =
        useState(initialExample.id);

    const [query, setQuery] = useState(
        initialExample.query,
    );

    const executeMutation =
        useExecuteCypher();

    const graphData = useMemo(() => {
        return normalizeGraphData(
            executeMutation.data,
        );
    }, [executeMutation.data]);

    const handleExampleChange = (event) => {
        const exampleId = event.target.value;

        const selectedExample =
            CYPHER_EXAMPLES.find(
                (example) =>
                    example.id === exampleId,
            );

        setSelectedExampleId(exampleId);

        if (selectedExample) {
            setQuery(selectedExample.query);
        }
    };

    const handleExecute = () => {
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            alert("Cypher 쿼리를 입력해 주세요.");
            return;
        }

        executeMutation.mutate(
            trimmedQuery,
        );
    };

    return (
        <Page>
            <Header>
                <div>
                    <Title>Cypher Playground</Title>

                    <Description>
                        읽기 전용 Cypher 쿼리를
                        선택하거나 직접 수정한 뒤
                        3D 그래프로 확인합니다.
                    </Description>
                </div>

                <ExecuteButton
                    type="button"
                    onClick={handleExecute}
                    disabled={
                        executeMutation.isPending
                    }
                >
                    {executeMutation.isPending
                        ? "실행 중..."
                        : "실행"}
                </ExecuteButton>
            </Header>

            <EditorSection>
                <Toolbar>
                    <SelectGroup>
                        <SelectLabel>
                            쿼리 예제
                        </SelectLabel>

                        <ExampleSelect
                            value={
                                selectedExampleId
                            }
                            onChange={
                                handleExampleChange
                            }
                        >
                            {CYPHER_EXAMPLES.map(
                                (example) => (
                                    <option
                                        key={
                                            example.id
                                        }
                                        value={
                                            example.id
                                        }
                                    >
                                        {
                                            example.name
                                        }
                                    </option>
                                ),
                            )}
                        </ExampleSelect>
                    </SelectGroup>

                    <QueryInfo>
                        읽기 전용 쿼리만 실행할 수
                        있습니다.
                    </QueryInfo>
                </Toolbar>

                <QueryTextarea
                    value={query}
                    onChange={(event) =>
                        setQuery(
                            event.target.value,
                        )
                    }
                    spellCheck={false}
                />
            </EditorSection>

            <ResultHeader>
                <ResultTitle>실행 결과</ResultTitle>

                <ResultCount>
                    {graphData.nodes.length}개 노드
                    {" · "}
                    {graphData.links.length}개 관계
                </ResultCount>
            </ResultHeader>

            {executeMutation.isError && (
                <ErrorBox>
                    {executeMutation.error
                            ?.response?.data?.detail ??
                        executeMutation.error
                            ?.message ??
                        "쿼리 실행에 실패했습니다."}
                </ErrorBox>
            )}

            {!executeMutation.data &&
            !executeMutation.isPending ? (
                <BeforeExecute>
                    예제를 선택하고 실행 버튼을
                    눌러 주세요.
                </BeforeExecute>
            ) : executeMutation.isPending ? (
                <LoadingBox>
                    그래프 데이터를 불러오는
                    중입니다.
                </LoadingBox>
            ) : (
                <Graph3D
                    graphData={graphData}
                />
            )}
        </Page>
    );
};

export default CypherPage;

const Page = styled.main`
    min-height: 100%;
    padding: 24px;
    background: #f4f7fb;
`;

const Header = styled.header`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 26px;
`;

const Title = styled.h1`
    margin: 0 0 8px;
    color: #0f172a;
    font-size: 29px;
`;

const Description = styled.p`
    margin: 0;
    color: #64748b;
    font-size: 15px;
`;

const ExecuteButton = styled.button`
    min-width: 86px;
    border: none;
    border-radius: 12px;
    padding: 14px 20px;
    background: #0284c7;
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;

    &:hover:not(:disabled) {
        background: #0369a1;
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.65;
    }
`;

const EditorSection = styled.section`
    overflow: hidden;
    margin-bottom: 28px;
    border-radius: 16px;
    background: #0f172a;
`;

const Toolbar = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 18px;
    border-bottom: 1px solid #25324a;
    padding: 15px 18px;
`;

const SelectGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const SelectLabel = styled.label`
    color: #cbd5e1;
    font-size: 13px;
    font-weight: 600;
`;

const ExampleSelect = styled.select`
    min-width: 220px;
    border: 1px solid #475569;
    border-radius: 8px;
    padding: 9px 12px;
    background: #1e293b;
    color: #f8fafc;
    outline: none;
`;

const QueryInfo = styled.span`
    color: #94a3b8;
    font-size: 12px;
`;

const QueryTextarea = styled.textarea`
    display: block;
    width: 100%;
    min-height: 230px;
    resize: vertical;
    border: none;
    padding: 22px;
    background: #0f172a;
    color: #f8fafc;
    font-family:
        "Consolas",
        "Courier New",
        monospace;
    font-size: 14px;
    line-height: 1.7;
    outline: none;
`;

const ResultHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 14px;
`;

const ResultTitle = styled.h2`
    margin: 0;
    color: #0f172a;
    font-size: 24px;
`;

const ResultCount = styled.div`
    border-radius: 999px;
    padding: 8px 13px;
    background: #e0f2fe;
    color: #0369a1;
    font-size: 13px;
    font-weight: 700;
`;

const BeforeExecute = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 420px;
    border: 1px dashed #cbd5e1;
    border-radius: 16px;
    background: #ffffff;
    color: #64748b;
`;

const LoadingBox = styled(BeforeExecute)``;

const ErrorBox = styled.div`
    margin-bottom: 16px;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 14px 16px;
    background: #fef2f2;
    color: #b91c1c;
    font-size: 14px;
`;