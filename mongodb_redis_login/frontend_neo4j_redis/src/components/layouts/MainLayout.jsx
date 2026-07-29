import {
    NavLink,
    Outlet,
    useNavigate,
} from "react-router-dom";

import styled from "styled-components";

import {
    useLogout,
    useMe,
} from "../../hooks/useAuth";

const menuItems = [
    {
        to: "/dashboard",
        label: "Dashboard",
    },
    {
        to: "/graph",
        label: "Graph",
    },
    {
        to: "/customers",
        label: "Customer",
    },
    {
        to: "/products",
        label: "Product",
    },
    {
        to: "/sales",
        label: "Sale",
    },
    {
        to: "/cypher",
        label: "Cypher",
    },
];

const MainLayout = () => {
    const navigate =
        useNavigate();

    const {
        data: user,
    } = useMe();

    const logoutMutation =
        useLogout();

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();

        navigate(
            "/login",
            {
                replace: true,
            },
        );
    };

    return (
        <Layout>
            <Sidebar>
                <Logo>Neo Graph</Logo>

                <Navigation>
                    {menuItems.map(
                        (item) => (
                            <MenuLink
                                key={item.to}
                                to={item.to}
                            >
                                {item.label}
                            </MenuLink>
                        ),
                    )}
                </Navigation>
            </Sidebar>

            <ContentArea>
                <Header>
                    <UserInfo>
                        {user?.username ||
                            "사용자"}
                    </UserInfo>

                    <LogoutButton
                        type="button"
                        onClick={
                            handleLogout
                        }
                    >
                        로그아웃
                    </LogoutButton>
                </Header>

                <Main>
                    <Outlet />
                </Main>
            </ContentArea>
        </Layout>
    );
};

export default MainLayout;

const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  background: #f4f8fc;
`;

const Sidebar = styled.aside`
  width: 240px;
  padding: 28px 18px;
  background: #0f172a;
`;

const Logo = styled.h1`
  margin: 0 12px 32px;
  color: #ffffff;
  font-size: 24px;
`;

const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuLink = styled(NavLink)`
  padding: 13px 16px;
  border-radius: 11px;
  color: #94a3b8;
  text-decoration: none;
  font-weight: 700;

  &.active {
    background: #0284c7;
    color: #ffffff;
  }
`;

const ContentArea = styled.div`
  min-width: 0;
  flex: 1;
`;

const Header = styled.header`
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
  padding: 0 32px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
`;

const UserInfo = styled.span`
  color: #334155;
  font-weight: 700;
`;

const LogoutButton =
    styled.button`
    padding: 10px 16px;
    border: none;
    border-radius: 10px;
    background: #e0f2fe;
    color: #0369a1;
    font-weight: 800;
    cursor: pointer;
  `;

const Main = styled.main`
  padding: 30px;
`;