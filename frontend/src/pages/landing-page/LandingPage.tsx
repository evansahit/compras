import Hero from "./components/hero/Hero";
import Demo from "./components/demo/Demo";
import { useNavigate } from "react-router";
import { useEffect } from "react";

// TODO: need to find a more secure for storing JWTs
//       can someone fake having a JWT token by creating a localstorage entry named "jwt"?
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
