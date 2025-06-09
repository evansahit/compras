import Hero from "./components/hero/Hero";
import Demo from "./components/demo/Demo";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) navigate("/home");
    }, [navigate]);

    return (
        <>
            <Hero />
            <Demo />
        </>
    );
}
