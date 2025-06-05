import "./home-page.css";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function HomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");

        if (!jwt) navigate("/signup-or-login");
    }, [navigate]);

    return (
        <>
            <h1>Home page</h1>
        </>
    );
}
