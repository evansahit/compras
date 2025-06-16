import React from "react";
import "./button-primary.css";

type ButtonPrimaryProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    isLoading?: boolean;
};

export default function ButtonPrimary({
    children,
    isLoading,
    className = "",
    ...rest
}: ButtonPrimaryProps) {
    return (
        <button className={`btn-primary ${className}`} {...rest}>
            {isLoading ? (
                <span>
                    {children} <span className="loading-spinner" />
                </span>
            ) : (
                children
            )}
        </button>
    );
}
