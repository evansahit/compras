import React from "react";
import "./button-secondary.css";

type ButtonSecondaryProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    isLoading: boolean;
};

export default function ButtonSecondary({
    children,
    isLoading,
    className = "",
    ...rest
}: ButtonSecondaryProps) {
    return (
        <button className={`btn-secondary ${className}`} {...rest}>
            <span>
                {children} {isLoading && <span className="loading-spinner" />}
            </span>
        </button>
    );
}
