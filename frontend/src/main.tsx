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
import ItemDetail from "./pages/home-page/components/item-detail/ItemDetail.tsx";
import ProfilePage from "./pages/profile-page/ProfilePage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<LandingPage />} />

                    {/* auth */}
                    <Route
                        path="/signup-or-login"
                        element={<SignupOrLoginPage />}
                    />
                    <Route path="/login" element={<LoginPage />} />

                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="home/items/:itemId"
                        element={
                            <ProtectedRoute>
                                <ItemDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
