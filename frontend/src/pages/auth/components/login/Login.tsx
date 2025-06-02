import "./login.css";
import ButtonPrimary from "../../../../components/button/button-primary/ButtonPrimary";
import { useState, useEffect } from "react";
import { validateEmail, validatePassword } from "../../util";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [isEmailTouched, setIsEmailTouched] = useState(false);
    const [isPasswordTouched, setIsPasswordTouched] = useState(false);

    useEffect(() => {
        if (isEmailTouched) setEmailError(validateEmail(email));
        if (isPasswordTouched) setPasswordError(validatePassword(password));

        if (
            emailError.length !== 0 ||
            passwordError.length !== 0 ||
            email.length === 0 ||
            password.length === 0
        ) {
            setIsSubmitButtonDisabled(true);
        } else {
            setIsSubmitButtonDisabled(false);
        }
    }, [
        email,
        emailError,
        password,
        isEmailTouched,
        isPasswordTouched,
        passwordError.length,
    ]);

    return (
        <>
            <form>
                <span className="form-title">Login</span>

                <div className="input-container">
                    <div className="input-group">
                        <label htmlFor="email">Email*</label>
                        <input
                            type="email"
                            name="email"
                            id="login-input-email"
                            placeholder="your@email.com"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => setIsEmailTouched(true)}
                        />
                        <span className="input-error">{emailError}</span>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password*</label>
                        <input
                            type="password"
                            name="password"
                            id="login-input-password"
                            placeholder="supersecurepassword"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => setIsPasswordTouched(true)}
                        />
                        <span className="input-error">{passwordError}</span>
                    </div>
                </div>

                <ButtonPrimary type="submit" disabled={isSubmitButtonDisabled}>
                    Sign up
                </ButtonPrimary>
            </form>
        </>
    );
}
