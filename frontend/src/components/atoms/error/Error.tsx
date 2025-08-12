import "./error.css";
import type React from "react";
import CancelIcon from "../../../assets/icons/CancelIcon";

interface ErrorProps {
    children: React.ReactNode;
    handleClearError?: () => void;
    className?: string;
}

export default function Error({
    children,
    handleClearError,
    className,
}: ErrorProps) {
    return (
        <div id="error-container">
            <h1 id="error-message" className={`${className}`}>
                {children}
            </h1>
            <CancelIcon
                className="error-close-icon"
                color="var(--background-color)"
                onClick={
                    handleClearError ? () => handleClearError() : undefined
                }
            />
        </div>
    );
}
