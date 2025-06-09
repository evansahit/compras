import React from "react";
import "./button-danger.css";

type ButtonDangerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

export default function ButtonDanger({
    children,
    className = "",
    ...rest
}: ButtonDangerProps) {
    return (
        <button className={`btn-danger ${className}`} {...rest}>
            {children}
        </button>
    );
}
