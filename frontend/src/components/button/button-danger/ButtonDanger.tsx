import React from "react";
import "./button-danger.css";

type ButtonDangerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    isloading?: boolean;
};

export default function ButtonDanger({
    children,
    isloading,
    className = "",
    ...rest
}: ButtonDangerProps) {
    return (
        <button className={`btn-danger ${className}`} {...rest}>
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
