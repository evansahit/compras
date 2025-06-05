import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import SignupOrLoginPage from "./pages/signup-or-login-page/SignupOrLoginPage.tsx";
import LandingPage from "./pages/landing-page/LandingPage.tsx";
import Layout from "./components/layout/Layout.tsx";
import NotFound from "./components/404/NotFound.tsx";
import LoginPage from "./pages/login-page/LoginPage.tsx";
import HomePage from "./pages/home-page/HomePage.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<LandingPage />} />
                    {/* auth */}
                    <Route
                        path="signup-or-login"
                        element={<SignupOrLoginPage />}
                    />
                    <Route path="login" element={<LoginPage />} />

                    <Route path="home" element={<HomePage />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
