import "./footer.css";

export default function Footer() {
    const linkedInUrl = "https://www.linkedin.com/in/evan-sahit-703598151/";

    return (
        <footer>
            <h2>Compras+</h2>
            <p>
                Developed by{" "}
                <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
                    Evan Sahit
                </a>
            </p>
        </footer>
    );
}
