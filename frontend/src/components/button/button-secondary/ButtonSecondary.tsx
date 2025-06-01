import React from "react";
import "./button-secondary.css";

type ButtonSecondaryProps = {
    children: React.ReactNode;
};

export default function ButtonSecondary(props: ButtonSecondaryProps) {
    return <button className="btn-secondary">{props.children}</button>;
}
