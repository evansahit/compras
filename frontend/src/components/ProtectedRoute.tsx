import { Navigate, useLocation } from "react-router";
import type React from "react";
import { isAuthed } from "../api/auth";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isUserLoggedIn = isAuthed();

    const location = useLocation();

    if (!isUserLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
