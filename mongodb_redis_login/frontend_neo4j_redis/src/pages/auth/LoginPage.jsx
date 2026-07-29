import {
    useState,
} from "react";

import {
    Link,
    Navigate,
    useNavigate,
} from "react-router-dom";

import styled from "styled-components";

import {
    useLogin,
} from "../../hooks/useAuth";

import {
    getAccessToken,
} from "../../store/authStorage";

const initialState = {
    username: "",
    password: "",
};

const LoginPage = () => {
    const [form, setForm] =
        useState(initialState);

    const navigate =
        useNavigate();

    const loginMutation =
        useLogin();

    const accessToken =
        getAccessToken();

    if (accessToken) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    const handleChange = (
        event,
    ) => {
        const {
            name,
            value,
        } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        event,
    ) => {
        event.preventDefault();

        if (!form.username.trim()) {
            alert(
                "아이디를 입력해주세요.",
            );
            return;
        }

        if (!form.password.trim()) {
            alert(
                "비밀번호를 입력해주세요.",
            );
            return;
        }

        try {
            await loginMutation.mutateAsync({
                username:
                    form.username.trim(),
                password: form.password,
            });

            navigate(
                "/dashboard",
                {
                    replace: true,
                },
            );
        } catch (error) {
            const message =
                error.response?.data
                    ?.detail ||
                "로그인에 실패했습니다.";

            alert(message);
        }
    };

    return (
        <Page>
            <Card>
                <Title>Neo4j Dashboard</Title>

                <Description>
                    계정에 로그인하세요.
                </Description>

                <Form
                    onSubmit={handleSubmit}
                >
                    <Label>
                        아이디
                        <Input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={
                                handleChange
                            }
                            autoComplete="username"
                            placeholder="아이디"
                        />
                    </Label>

                    <Label>
                        비밀번호
                        <Input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={
                                handleChange
                            }
                            autoComplete={
                                "current-password"
                            }
                            placeholder="비밀번호"
                        />
                    </Label>

                    <SubmitButton
                        type="submit"
                        disabled={
                            loginMutation.isPending
                        }
                    >
                        {loginMutation.isPending
                            ? "로그인 중..."
                            : "로그인"}
                    </SubmitButton>
                </Form>

                <RegisterText>
                    계정이 없나요?
                    <RegisterLink
                        to="/register"
                    >
                        회원가입
                    </RegisterLink>
                </RegisterText>
            </Card>
        </Page>
    );
};

export default LoginPage;

const Page = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(
      circle at top left,
      rgba(56, 189, 248, 0.22),
      transparent 32%
    ),
    #f5f9ff;
`;

const Card = styled.section`
  width: 100%;
  max-width: 420px;
  padding: 38px;
  border: 1px solid #dbe7f3;
  border-radius: 24px;
  background: #ffffff;
  box-shadow:
    0 24px 70px
    rgba(15, 23, 42, 0.12);
`;

const Title = styled.h1`
  margin: 0;
  color: #0f172a;
  font-size: 30px;
`;

const Description = styled.p`
  margin: 10px 0 30px;
  color: #64748b;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
`;

const Input = styled.input`
  height: 48px;
  padding: 0 14px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  outline: none;
  font-size: 15px;

  &:focus {
    border-color: #38bdf8;
    box-shadow:
      0 0 0 4px
      rgba(56, 189, 248, 0.14);
  }
`;

const SubmitButton =
    styled.button`
    height: 50px;
    margin-top: 6px;
    border: none;
    border-radius: 12px;
    background: #0284c7;
    color: #ffffff;
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: wait;
    }
  `;

const RegisterText = styled.p`
  margin: 24px 0 0;
  text-align: center;
  color: #64748b;
`;

const RegisterLink = styled(Link)`
  margin-left: 8px;
  color: #0284c7;
  font-weight: 800;
  text-decoration: none;
`;