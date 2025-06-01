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
                        location.pathname === "/auth"
                            ? {
                                  margin: "0 auto",
                              }
                            : undefined
                    }
                >
                    <span className="website-title">Compras+</span>
                </Link>
                {location.pathname !== "/auth" && (
                    <Link to="/auth">
                        <ButtonPrimary>Sign up or Login</ButtonPrimary>
                    </Link>
                )}
            </header>
        </>
    );
}
