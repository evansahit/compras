import "./signup.css";
import { useState } from "react";
import ButtonPrimary from "../../../../components/button/button-primary/ButtonPrimary";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");

    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

    return (
        <>
            <form>
                <span className="form-title">
                    Sign up for <span className="accent">Compras+</span>{" "}
                </span>

                <div className="input-container">
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="input-email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="input-password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Repeat password</label>
                        <input
                            type="password-repeat"
                            name="password-repeat"
                            id="input-password-repeat"
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                        />
                    </div>
                </div>

                <ButtonPrimary type="submit" disabled={isSubmitButtonDisabled}>
                    Sign up
                </ButtonPrimary>
            </form>
        </>
    );
}
