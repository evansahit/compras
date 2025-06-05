import { Link } from "react-router";
import "./header.css";
import ButtonPrimary from "../button/button-primary/ButtonPrimary";
import { useLocation } from "react-router";

export default function Header() {
    const location = useLocation();

    return (
        <>
            <header>
                <Link
                    to="/"
                    style={
                        location.pathname !== "/"
                            ? {
                                  margin: "0 auto",
                              }
                            : undefined
                    }
                >
                    <span className="website-title">Compras+</span>
                </Link>
                {location.pathname === "/" && (
                    <Link to="signup-or-login">
                        <ButtonPrimary>Sign up or Login</ButtonPrimary>
                    </Link>
                )}
            </header>
        </>
    );
}
