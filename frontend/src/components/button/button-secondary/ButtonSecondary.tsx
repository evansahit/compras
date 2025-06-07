import React from "react";
import "./button-secondary.css";

type ButtonSecondaryProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

export default function ButtonSecondary({
    children,
    className = "",
    ...rest
}: ButtonSecondaryProps) {
    return (
        <button className={`btn-secondary ${className}`} {...rest}>
            {children}
        </button>
    );
}
