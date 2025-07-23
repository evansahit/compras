import { Link } from "react-router";
import "./header.css";
import ButtonPrimary from "../button/button-primary/ButtonPrimary";
import ButtonDanger from "../button/button-danger/ButtonDanger";
import { useLocation, useNavigate } from "react-router";
import { logout } from "../../api/auth";
import { useState } from "react";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");
    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <header>
                <Link
                    to="/"
                    style={
                        location.pathname !== "/" && !jwt
                            ? {
                                  margin: "0 auto",
                              }
                            : undefined
                    }
                >
                    <span id="website-title">Compras+</span>
                </Link>
                {location.pathname === "/" && (
                    <Link to="signup-or-login">
                        <ButtonPrimary>Sign up or Login</ButtonPrimary>
                    </Link>
                )}
                {jwt && (
                    <ButtonDanger
                        onClick={() => {
                            logout(navigate);
                        }}
                        isloading={isLoading}
                    >
                        Logout
                    </ButtonDanger>
                )}
            </header>
        </>
    );
}
