import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { registerUser } from "../api/authApi";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");

    const handleRegister = async () => {
        if (!username || !password) {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        if (password !== passwordCheck) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await registerUser({
                username,
                password
            });

            alert("회원가입이 완료되었습니다.");
            navigate("/login");

        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "회원가입에 실패했습니다."
            );
        }
    };

    return (
        <Page>
            <Glow />

            <Card>
                <IconBox>✨</IconBox>

                <Title>계정을 만들어보세요</Title>

                <Description>
                    간단한 정보 입력으로 바로 시작할 수 있습니다.
                </Description>

                <Form>
                    <Field>
                        <Label>아이디</Label>

                        <Input
                            placeholder="사용할 아이디"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                        />
                    </Field>

                    <Field>
                        <Label>비밀번호</Label>

                        <Input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                    </Field>

                    <Field>
                        <Label>비밀번호 확인</Label>

                        <Input
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            value={passwordCheck}
                            onChange={(e) =>
                                setPasswordCheck(e.target.value)
                            }
                        />
                    </Field>

                    <RegisterButton onClick={handleRegister}>
                        회원가입
                    </RegisterButton>
                </Form>

                <BottomText>
                    이미 계정이 있으신가요?
                    <Link to="/login">
                        로그인
                    </Link>
                </BottomText>
            </Card>
        </Page>
    );
};

export default RegisterPage;

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

    bottom: -250px;
    right: -100px;

    border-radius: 50%;

    background: rgba(86, 119, 255, 0.15);
    filter: blur(90px);
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
`;

const Form = styled.div`
    margin-top: 32px;

    display: flex;
    flex-direction: column;
    gap: 18px;
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
    height: 48px;
    padding: 0 15px;

    border: 1px solid #dfe5ee;
    border-radius: 10px;

    background: #fbfcfe;

    outline: none;

    transition: 0.2s;

    &:focus {
        border-color: #7089f8;
        background: white;

        box-shadow: 0 0 0 4px rgba(79, 110, 247, 0.09);
    }
`;

const RegisterButton = styled.button`
    height: 50px;
    margin-top: 5px;

    border-radius: 11px;

    background: linear-gradient(135deg, #6785ff, #4f6ef7);
    color: white;

    font-weight: 650;
    cursor: pointer;

    box-shadow: 0 8px 20px rgba(79, 110, 247, 0.22);
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