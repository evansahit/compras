import "./hero.css";

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
                <span className="paragraph-accent">Compras+</span> allows you to
                see what different grocery stores charge for each item on your
                grocery list.
            </p>
        </div>
    );
}
