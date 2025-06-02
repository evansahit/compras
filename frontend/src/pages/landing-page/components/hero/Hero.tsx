import "./hero.css";
// import ButtonPrimary from "../../../../components/button/button-primary/ButtonPrimary";
// import ButtonSecondary from "../../../../components/button/button-secondary/ButtonSecondary";
// import { Link } from "react-router";

export default function Hero() {
    return (
        <div className="hero-container">
            <h1>
                A grocery list with a{" "}
                <span className="heading-accent">tWist</span>
            </h1>
            <p>
                On a budget or just want a clear overview on the prices of your
                groceries?
            </p>
            <p>
                <span className="accent">Compras+</span> allows you to see what
                each grocery store charges for each item on your grocery list.
            </p>
            {/* <div className="hero-btn-row">
                <Link to="/auth">
                    <ButtonPrimary>Sign up</ButtonPrimary>
                </Link>
                <Link to="/auth">
                    <ButtonSecondary>Log in</ButtonSecondary>
                </Link>
            </div> */}
        </div>
    );
}
