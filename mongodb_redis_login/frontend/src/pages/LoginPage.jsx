import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { loginUser } from "../api/authApi";

const LoginPage = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        try {
            setLoading(true);

            const data = await loginUser({
                username,
                password
            });

            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            localStorage.setItem("username", username);

            navigate("/");
            window.location.reload();
        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "로그인에 실패했습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page>
            <Glow />

            <Card>
                <IconBox>🔐</IconBox>

                <Title>다시 만나서 반가워요</Title>

                <Description>
                    계정에 로그인하여 서비스를 계속 이용하세요.
                </Description>

                <Form>
                    <Field>
                        <Label>아이디</Label>

                        <Input
                            value={username}
                            placeholder="아이디를 입력하세요"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Field>

                    <Field>
                        <Label>비밀번호</Label>

                        <Input
                            type="password"
                            value={password}
                            placeholder="비밀번호를 입력하세요"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleLogin();
                                }
                            }}
                        />
                    </Field>

                    <LoginButton
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </LoginButton>
                </Form>

                <BottomText>
                    아직 계정이 없으신가요?
                    <Link to="/register">
                        회원가입
                    </Link>
                </BottomText>
            </Card>
        </Page>
    );
};

export default LoginPage;

const Page = styled.main`
    position: relative;

    min-height: calc(100vh - 72px);

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 40px 20px;

    overflow: hidden;
`;

const Glow = styled.div`
    position: absolute;

    width: 500px;
    height: 500px;

    top: -230px;
    left: 50%;

    transform: translateX(-50%);

    border-radius: 50%;

    background: rgba(99, 132, 255, 0.16);
    filter: blur(80px);
`;

const Card = styled.div`
    position: relative;
    z-index: 1;

    width: 100%;
    max-width: 430px;

    padding: 42px 38px;

    border: 1px solid #e7ebf2;
    border-radius: 22px;

    background: rgba(255, 255, 255, 0.95);

    box-shadow:
        0 20px 50px rgba(15, 23, 42, 0.08),
        0 3px 10px rgba(15, 23, 42, 0.03);
`;

const IconBox = styled.div`
    width: 52px;
    height: 52px;

    margin: 0 auto 22px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 15px;

    background: #eef2ff;

    font-size: 23px;
`;

const Title = styled.h1`
    text-align: center;

    font-size: 26px;
    font-weight: 750;
    letter-spacing: -1px;

    color: #172033;
`;

const Description = styled.p`
    margin-top: 9px;

    text-align: center;
    color: #8792a5;

    font-size: 14px;
    line-height: 1.6;
`;

const Form = styled.div`
    margin-top: 32px;

    display: flex;
    flex-direction: column;

    gap: 19px;
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 13px;
    font-weight: 600;

    color: #475569;
`;

const Input = styled.input`
    width: 100%;
    height: 48px;

    padding: 0 15px;

    border: 1px solid #dfe5ee;
    border-radius: 10px;

    outline: none;

    background: #fbfcfe;
    color: #1e293b;

    transition: 0.2s;

    &::placeholder {
        color: #adb7c5;
    }

    &:focus {
        border-color: #7089f8;
        background: white;

        box-shadow: 0 0 0 4px rgba(79, 110, 247, 0.09);
    }
`;

const LoginButton = styled.button`
    height: 50px;
    margin-top: 4px;

    border-radius: 11px;

    background: linear-gradient(135deg, #6785ff, #4f6ef7);
    color: white;

    font-weight: 650;

    cursor: pointer;

    box-shadow: 0 8px 20px rgba(79, 110, 247, 0.22);

    transition: 0.2s;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 11px 24px rgba(79, 110, 247, 0.3);
    }

    &:disabled {
        opacity: 0.6;
        cursor: default;
        transform: none;
    }
`;

const BottomText = styled.p`
    margin-top: 25px;

    text-align: center;

    font-size: 13px;
    color: #8b96a8;

    a {
        margin-left: 7px;

        color: #4f6ef7;
        font-weight: 650;

        text-decoration: none;
    }
`;