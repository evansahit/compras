import "./signup.css";
import { useState, useEffect } from "react";
import ButtonPrimary from "../../../../components/button/button-primary/ButtonPrimary";
import {
    validateEmail,
    validatePassword,
    validatePasswordsMatch,
} from "../../util";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");

    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordRepeatError, setPasswordRepeatError] = useState("");

    const [isEmailTouched, setIsEmailTouched] = useState(false);
    const [isPasswordTouched, setIsPasswordTouched] = useState(false);
    const [isPasswordRepeatTouched, setIsPasswordRepeatTouched] =
        useState(false);

    useEffect(() => {
        if (isEmailTouched) setEmailError(validateEmail(email));
        if (isPasswordTouched) setPasswordError(validatePassword(password));
        if (isPasswordRepeatTouched)
            setPasswordRepeatError(validatePassword(passwordRepeat));
        if (
            isPasswordTouched &&
            isPasswordRepeatTouched &&
            passwordError.length === 0 &&
            passwordRepeat.length !== 0
        ) {
            setPasswordRepeatError(
                validatePasswordsMatch(password, passwordRepeat)
            );
        }

        if (
            emailError.length !== 0 ||
            passwordError.length !== 0 ||
            passwordRepeatError.length !== 0 ||
            email.length === 0 ||
            password.length === 0 ||
            passwordRepeat.length === 0
        ) {
            setIsSubmitButtonDisabled(true);
        } else {
            setIsSubmitButtonDisabled(false);
        }
    }, [
        email,
        emailError,
        password,
        passwordRepeat,
        isEmailTouched,
        isPasswordTouched,
        isPasswordRepeatTouched,
        passwordError.length,
        passwordRepeatError.length,
    ]);

    return (
        <>
            <form>
                <span className="form-title">
                    Sign up for <span className="accent">Compras+</span>{" "}
                </span>

                <div className="input-container">
                    <div className="input-group">
                        <label htmlFor="email">Email*</label>
                        <input
                            type="email"
                            name="email"
                            id="input-email"
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
                            id="input-password"
                            placeholder="supersecurepassword"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => setIsPasswordTouched(true)}
                        />
                        <span className="input-error">{passwordError}</span>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Repeat password*</label>
                        <input
                            type="password"
                            name="password-repeat"
                            id="input-password-repeat"
                            placeholder="supersecurepassword"
                            required
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                            onBlur={() => setIsPasswordRepeatTouched(true)}
                        />
                        <span className="input-error">
                            {passwordRepeatError}
                        </span>
                    </div>
                </div>

                <ButtonPrimary type="submit" disabled={isSubmitButtonDisabled}>
                    Sign up
                </ButtonPrimary>
            </form>
        </>
    );
}
