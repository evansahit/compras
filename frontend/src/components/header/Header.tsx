import { Link } from "react-router";
import "./header.css";
import ButtonPrimary from "../atoms/button/button-primary/ButtonPrimary";
import { useLocation } from "react-router";
import ProfileIcon from "../../assets/icons/profile-icon/ProfileIcon";

export default function Header() {
    const location = useLocation();
    const jwt = localStorage.getItem("jwt");

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
                    <ProfileIcon
                        id="profile-icon"
                        color="var(--primary-color)"
                    />
                )}
            </header>
        </>
    );
}
