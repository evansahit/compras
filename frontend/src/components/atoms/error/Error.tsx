import type React from "react";
import "./error.css";
import BackIcon from "../../../assets/icons/BackIcon";
import { useNavigate } from "react-router";
import CancelIcon from "../../../assets/icons/CancelIcon";

interface ErrorProps {
    children: React.ReactNode;
    handleClearError: () => void;
    className?: string;
}

export default function Error({
    children,
    handleClearError,
    className,
}: ErrorProps) {
    const navigate = useNavigate();

    return (
        <div id="error-container">
            <h1 id="error-message" className={`${className}`}>
                {children}
            </h1>
            <CancelIcon
                className="error-close-icon"
                color="var(--background-color)"
                onClick={() => handleClearError()}
            />
        </div>
    );
}
