import React from "react";
import "./button-primary.css";

type ButtonPrimaryProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    isloading?: boolean;
};

export default function ButtonPrimary({
    children,
    isloading,
    className = "",
    ...rest
}: ButtonPrimaryProps) {
    return (
        <button className={`btn-primary ${className}`} {...rest}>
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
