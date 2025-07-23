import { Link } from "react-router";
import ButtonPrimary from "../button/button-primary/ButtonPrimary";
import "./not-found.css";

export default function NotFound() {
    return (
        <div className="not-found">
            <h1>We're in the wrong part of town...</h1>
            <p>Sorry, we couldn't find this page.</p>

            <Link to="/home">
                <ButtonPrimary>Go back home</ButtonPrimary>
            </Link>
        </div>
    );
}
