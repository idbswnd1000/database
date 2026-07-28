import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Header = () => {
    const navigate = useNavigate();

    const username = localStorage.getItem("username");
    const isLogin = !!localStorage.getItem("access_token");

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");

        navigate("/");
        window.location.reload();
    };

    return (
        <HeaderWrapper>
            <HeaderInner>
                <Logo onClick={() => navigate("/")}>
                    AuthFlow
                </Logo>

                <RightSection>
                    {isLogin ? (
                        <>
                            <LoginStatus>
                                <StatusDot />
                                <strong>{username}</strong>
                                <span>님 로그인 중</span>
                            </LoginStatus>

                            <OutlineButton onClick={handleLogout}>
                                로그아웃
                            </OutlineButton>
                        </>
                    ) : (
                        <>
                            <TextButton onClick={() => navigate("/login")}>
                                로그인
                            </TextButton>

                            <PrimaryButton onClick={() => navigate("/register")}>
                                회원가입
                            </PrimaryButton>
                        </>
                    )}
                </RightSection>
            </HeaderInner>
        </HeaderWrapper>
    );
};

export default Header;

const HeaderWrapper = styled.header`
    position: sticky;
    top: 0;
    z-index: 100;

    width: 100%;
    height: 72px;

    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(15px);

    border-bottom: 1px solid #e8edf5;
`;

const HeaderInner = styled.div`
    max-width: 1180px;
    height: 100%;
    margin: 0 auto;
    padding: 0 28px;

    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Logo = styled.div`
    font-size: 22px;
    font-weight: 800;
    color: #4f6ef7;
    letter-spacing: -0.8px;
    cursor: pointer;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const LoginStatus = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;

    margin-right: 10px;
    font-size: 14px;
    color: #64748b;

    strong {
        color: #1e293b;
    }
`;

const StatusDot = styled.div`
    width: 8px;
    height: 8px;
    margin-right: 5px;

    border-radius: 50%;
    background: #22c55e;
`;

const TextButton = styled.button`
    padding: 9px 16px;
    border-radius: 9px;

    background: transparent;
    color: #475569;

    cursor: pointer;
    transition: 0.2s;

    &:hover {
        background: #f1f5f9;
        color: #1e293b;
    }
`;

const PrimaryButton = styled.button`
    padding: 10px 18px;
    border-radius: 9px;

    color: white;
    background: linear-gradient(135deg, #6684ff, #4f6ef7);

    font-weight: 600;
    cursor: pointer;

    box-shadow: 0 5px 15px rgba(79, 110, 247, 0.22);

    transition: 0.2s;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 20px rgba(79, 110, 247, 0.3);
    }
`;

const OutlineButton = styled.button`
    padding: 9px 16px;
    border: 1px solid #dbe2ea;
    border-radius: 9px;

    color: #475569;
    background: white;

    cursor: pointer;

    &:hover {
        background: #f8fafc;
    }
`;