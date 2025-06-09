import React from "react";
import "./button-primary.css";

type ButtonPrimaryProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

export default function ButtonPrimary({
    children,
    className = "",
    ...rest
}: ButtonPrimaryProps) {
    return (
        <button className={`btn-primary ${className}`} {...rest}>
            {children}
        </button>
    );
}
