import { Link } from "react-router";
import "./header.css";
import ButtonPrimary from "../button/button-primary/ButtonPrimary";

export default function Header() {
    return (
        <>
            <header>
                <Link to="/">
                    <span className="website-title">Compras+</span>
                </Link>
                <Link to="/auth">
                    <ButtonPrimary>Sign up or Login</ButtonPrimary>
                </Link>
            </header>
        </>
    );
}
