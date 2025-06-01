import React from "react";
import "./button-primary.css";

type ButtonPrimaryProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

export default function ButtonPrimary(props: ButtonPrimaryProps) {
    return <button className="btn-primary">{props.children}</button>;
}
