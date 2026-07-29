import {
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import styled from "styled-components";

import {
    useRegister,
} from "../../hooks/useAuth";

const initialState = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
};

const RegisterPage = () => {
    const [form, setForm] =
        useState(initialState);

    const navigate =
        useNavigate();

    const registerMutation =
        useRegister();

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

        if (
            !form.username.trim() ||
            !form.email.trim() ||
            !form.password
        ) {
            alert(
                "모든 항목을 입력해주세요.",
            );
            return;
        }

        if (
            form.password !==
            form.passwordConfirm
        ) {
            alert(
                "비밀번호가 일치하지 않습니다.",
            );
            return;
        }

        try {
            await registerMutation.mutateAsync({
                username:
                    form.username.trim(),
                email:
                    form.email.trim(),
                password: form.password,
            });

            alert(
                "회원가입이 완료되었습니다.",
            );

            navigate(
                "/login",
                {
                    replace: true,
                },
            );
        } catch (error) {
            const data =
                error.response?.data;

            const message =
                data?.username?.[0] ||
                data?.email?.[0] ||
                data?.password?.[0] ||
                data?.detail ||
                "회원가입에 실패했습니다.";

            alert(message);
        }
    };

    return (
        <Page>
            <Card>
                <Title>회원가입</Title>

                <Form
                    onSubmit={handleSubmit}
                >
                    <Input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="아이디"
                    />

                    <Input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="이메일"
                    />

                    <Input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="비밀번호"
                    />

                    <Input
                        type="password"
                        name="passwordConfirm"
                        value={
                            form.passwordConfirm
                        }
                        onChange={handleChange}
                        placeholder={
                            "비밀번호 확인"
                        }
                    />

                    <Button
                        type="submit"
                        disabled={
                            registerMutation.isPending
                        }
                    >
                        {registerMutation.isPending
                            ? "가입 중..."
                            : "회원가입"}
                    </Button>
                </Form>

                <LoginLink to="/login">
                    로그인으로 돌아가기
                </LoginLink>
            </Card>
        </Page>
    );
};

export default RegisterPage;

const Page = styled.main`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: #f5f9ff;
`;

const Card = styled.section`
  width: 100%;
  max-width: 440px;
  padding: 38px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow:
    0 24px 70px
    rgba(15, 23, 42, 0.12);
`;

const Title = styled.h1`
  margin: 0 0 28px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  height: 48px;
  padding: 0 14px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  outline: none;

  &:focus {
    border-color: #38bdf8;
  }
`;

const Button = styled.button`
  height: 50px;
  border: none;
  border-radius: 12px;
  background: #0284c7;
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
`;

const LoginLink = styled(Link)`
  display: block;
  margin-top: 22px;
  color: #0284c7;
  text-align: center;
  text-decoration: none;
`;