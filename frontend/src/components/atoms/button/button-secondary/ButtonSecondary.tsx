import React from "react";
import "./button-secondary.css";

type ButtonSecondaryProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    isloading?: boolean;
};

export default function ButtonSecondary({
    children,
    isloading,
    className = "",
    ...rest
}: ButtonSecondaryProps) {
    return (
        <button className={`btn-secondary ${className}`} {...rest}>
            {isloading ? (
                <span>
                    {children} <span className="loading-spinner" />
                </span>
            ) : (
                children
            )}
        </button>
    );
}
