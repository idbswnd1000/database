import { useRef } from "react";
import styled from "styled-components";


const MenuImagePanel = ({
                            imageUrl,
                            menus,
                            selectedMenu,
                            onImageChange,
                            onMenuSelect,
                            isAnalyzing,
                        }) => {
    const inputRef = useRef(null);

    const validateAndUpload = (file) => {
        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드할 수 있습니다.");
            return;
        }

        onImageChange(file);
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        validateAndUpload(file);
        event.target.value = "";
    };

    const handleDrop = (event) => {
        event.preventDefault();

        const file = event.dataTransfer.files?.[0];

        validateAndUpload(file);
    };

    return (
        <Container>
            <Header>
                <div>
                    <Title>메뉴판 이미지</Title>

                    <Description>
                        메뉴판 분석이 끝나면 원하는 메뉴 이름 영역을
                        클릭하세요.
                    </Description>
                </div>

                {imageUrl && (
                    <ChangeButton
                        type="button"
                        disabled={isAnalyzing}
                        onClick={() => inputRef.current?.click()}
                    >
                        이미지 변경
                    </ChangeButton>
                )}
            </Header>

            <ImageArea
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
            >
                {!imageUrl ? (
                    <EmptyState>
                        <UploadIcon>＋</UploadIcon>

                        <EmptyTitle>
                            메뉴판 이미지 업로드
                        </EmptyTitle>

                        <EmptyText>
                            메뉴 이름과 가격이 선명하게 보이는 이미지를
                            선택하세요.
                        </EmptyText>

                        <UploadButton
                            type="button"
                            onClick={() => inputRef.current?.click()}
                        >
                            이미지 선택
                        </UploadButton>
                    </EmptyState>
                ) : (
                    <PreviewContainer>
                        <ImageWrapper>
                            <PreviewImage
                                src={imageUrl}
                                alt="업로드한 메뉴판"
                                draggable={false}
                            />

                            {!isAnalyzing &&
                                menus.map((menu) => {
                                    const left = menu.box.x / 10;
                                    const top = menu.box.y / 10;
                                    const width = menu.box.width / 10;
                                    const height = menu.box.height / 10;

                                    return (
                                        <MenuAreaButton
                                            key={menu.id}
                                            type="button"
                                            $selected={
                                                selectedMenu?.id === menu.id
                                            }
                                            style={{
                                                left: `${left}%`,
                                                top: `${top}%`,
                                                width: `${width}%`,
                                                height: `${height}%`,
                                            }}
                                            onClick={() => onMenuSelect(menu)}
                                            title={`${menu.menuName} ${menu.price.toLocaleString(
                                                "ko-KR",
                                            )}원`}
                                        >
                                            <MenuAreaLabel>
                                                {menu.menuName}
                                            </MenuAreaLabel>
                                        </MenuAreaButton>
                                    );
                                })}

                            {isAnalyzing && (
                                <AnalyzingOverlay>
                                    <Spinner />

                                    <strong>메뉴판 분석 중</strong>

                                    <span>
                    모든 메뉴 이름, 가격, 위치를 찾고
                    있습니다.
                  </span>
                                </AnalyzingOverlay>
                            )}
                        </ImageWrapper>

                        {!isAnalyzing && menus.length > 0 && (
                            <Guide>
                                파란색 영역 중 원하는 메뉴를 클릭하세요.
                                총 {menus.length}개 메뉴를 찾았습니다.
                            </Guide>
                        )}

                        {!isAnalyzing &&
                            imageUrl &&
                            menus.length === 0 && (
                                <Guide $error>
                                    메뉴 영역을 찾지 못했습니다. 더 선명한
                                    이미지로 다시 시도해주세요.
                                </Guide>
                            )}
                    </PreviewContainer>
                )}

                <HiddenInput
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </ImageArea>
        </Container>
    );
};

export default MenuImagePanel;

const Container = styled.div`
    overflow: hidden;
    min-height: calc(100vh - 116px);
    border: 1px solid #e0e6ef;
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 12px 30px rgba(34, 55, 88, 0.08);
`;

const Header = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 22px;
    border-bottom: 1px solid #e8edf4;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 19px;
`;

const Description = styled.p`
    margin: 7px 0 0;
    color: #758198;
    font-size: 14px;
`;

const ChangeButton = styled.button`
    flex-shrink: 0;
    padding: 10px 14px;
    border-radius: 10px;
    background: #edf4ff;
    color: #1769d2;
    font-weight: 700;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

const ImageArea = styled.div`
    display: grid;
    min-height: calc(100vh - 225px);
    padding: 22px;
    place-items: center;
    background: #f7f9fc;
`;

const PreviewContainer = styled.div`
    display: flex;
    width: 100%;
    min-height: 500px;
    flex-direction: column;
    align-items: center;
    gap: 16px;
`;

const ImageWrapper = styled.div`
    position: relative;
    display: inline-block;
    max-width: 100%;
`;

const PreviewImage = styled.img`
    display: block;
    width: auto;
    max-width: 100%;
    max-height: calc(100vh - 320px);
    border-radius: 14px;
    object-fit: contain;
    user-select: none;
`;

const MenuAreaButton = styled.button`
    position: absolute;
    z-index: 2;
    min-width: 16px;
    min-height: 14px;
    padding: 0;
    border: 2px solid
    ${({ $selected }) =>
            $selected ? "#ff8a00" : "#287de5"};
    border-radius: 4px;
    background: ${({ $selected }) =>
            $selected
                    ? "rgba(255, 138, 0, 0.22)"
                    : "rgba(40, 125, 229, 0.14)"};

    &:hover {
        z-index: 3;
        border-color: #ff8a00;
        background: rgba(255, 138, 0, 0.22);
    }
`;

const MenuAreaLabel = styled.span`
    position: absolute;
    top: -25px;
    left: -2px;
    max-width: 180px;
    overflow: hidden;
    padding: 4px 7px;
    border-radius: 5px 5px 5px 0;
    background: #287de5;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const AnalyzingOverlay = styled.div`
    position: absolute;
    inset: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    background: rgba(17, 31, 52, 0.72);
    color: #ffffff;

    span {
        margin-top: 8px;
        font-size: 13px;
        opacity: 0.85;
    }
`;

const Spinner = styled.div`
    width: 42px;
    height: 42px;
    margin-bottom: 16px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

const Guide = styled.div`
    width: 100%;
    padding: 13px 16px;
    border: 1px solid
    ${({ $error }) => ($error ? "#ffd4d4" : "#cfe1ff")};
    border-radius: 12px;
    background: ${({ $error }) =>
            $error ? "#fff1f1" : "#edf5ff"};
    color: ${({ $error }) =>
            $error ? "#ba4141" : "#225da7"};
    font-size: 14px;
    text-align: center;
`;

const EmptyState = styled.div`
    display: flex;
    max-width: 430px;
    flex-direction: column;
    align-items: center;
    padding: 50px 30px;
    border: 2px dashed #cbd5e4;
    border-radius: 20px;
    background: #ffffff;
    text-align: center;
`;

const UploadIcon = styled.div`
    display: grid;
    width: 58px;
    height: 58px;
    margin-bottom: 18px;
    place-items: center;
    border-radius: 18px;
    background: #eaf3ff;
    color: #277ae3;
    font-size: 31px;
`;

const EmptyTitle = styled.h3`
    margin: 0;
    font-size: 20px;
`;

const EmptyText = styled.p`
    margin: 12px 0 22px;
    color: #7b879c;
    line-height: 1.6;
`;

const UploadButton = styled.button`
    padding: 12px 20px;
    border-radius: 11px;
    background: #287de5;
    color: #ffffff;
    font-weight: 700;
`;

const HiddenInput = styled.input`
    display: none;
`;