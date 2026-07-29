import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "./components/layouts/MainLayout";
import ProtectedRoute from "./components/routes/ProtectedRoute";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import CustomerPage from "./pages/CustomerPage";
import CypherPage from "./pages/CypherPage";
import DashboardPage from "./pages/DashboardPage";
import GraphPage from "./pages/GraphPage";
import ProductPage from "./pages/ProductPage";
import SalePage from "./pages/SalePage";

const App = () => {
  return (
      <Routes>
        <Route
            path="/login"
            element={<LoginPage />}
        />

        <Route
            path="/register"
            element={<RegisterPage />}
        />

        <Route
            element={<ProtectedRoute />}
        >
          <Route
              element={<MainLayout />}
          >
            <Route
                path="/dashboard"
                element={
                  <DashboardPage />
                }
            />

            <Route
                path="/graph"
                element={<GraphPage />}
            />

            <Route
                path="/customers"
                element={
                  <CustomerPage />
                }
            />

            <Route
                path="/products"
                element={
                  <ProductPage />
                }
            />

            <Route
                path="/sales"
                element={<SalePage />}
            />

            <Route
                path="/cypher"
                element={
                  <CypherPage />
                }
            />
          </Route>
        </Route>

        <Route
            path="/"
            element={
              <Navigate
                  to="/dashboard"
                  replace
              />
            }
        />

        <Route
            path="*"
            element={
              <Navigate
                  to="/dashboard"
                  replace
              />
            }
        />
      </Routes>
  );
};

export default App;