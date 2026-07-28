import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import GlobalStyle from "./styles/GlobalStyle";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
    return (
        <BrowserRouter>
            <GlobalStyle />

            <Header />

            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;