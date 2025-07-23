import type React from "react";
import "./error.css";

interface ErrorProps {
    children: React.ReactNode;
    className?: string;
}

export default function Error({ children, className }: ErrorProps) {
    return (
        <h1 id="error" className={`${className}`}>
            {children}
        </h1>
    );
}
