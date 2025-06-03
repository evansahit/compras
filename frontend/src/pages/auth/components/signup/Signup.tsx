import "./signup.css";
import { useState, useEffect } from "react";
import ButtonPrimary from "../../../../components/button/button-primary/ButtonPrimary";
import {
    validateFirstName,
    validateEmail,
    validatePassword,
    validatePasswordsMatch,
} from "../../logic/form-validation";

export default function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");

    const [firstNameError, setFirstNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordRepeatError, setPasswordRepeatError] = useState("");
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

    const [isFirstNameTouched, setIsFirstNameTouched] = useState(false);
    const [isEmailTouched, setIsEmailTouched] = useState(false);
    const [isPasswordTouched, setIsPasswordTouched] = useState(false);
    const [isPasswordRepeatTouched, setIsPasswordRepeatTouched] =
        useState(false);

    useEffect(() => {
        if (isFirstNameTouched) setFirstNameError(validateFirstName(firstName));
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

        // disable submit button on any error
        if (
            firstNameError.length !== 0 ||
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
        firstName,
        email,
        password,
        passwordRepeat,
        isFirstNameTouched,
        isEmailTouched,
        isPasswordTouched,
        isPasswordRepeatTouched,
        firstNameError,
        emailError,
        passwordError.length,
        passwordRepeatError.length,
    ]);

    return (
        <>
            <form id="signup-form">
                <span className="form-title">Sign up</span>

                <div className="input-container">
                    <div className="input-group">
                        <label htmlFor="first-name">First name*</label>
                        <input
                            type="text"
                            name="first-name"
                            placeholder="Your first name"
                            required
                            onChange={(e) => setFirstName(e.target.value)}
                            onBlur={() => setIsFirstNameTouched(true)}
                        />
                        <span className="input-error">{firstNameError}</span>
                    </div>
                    <div className="input-group">
                        <label htmlFor="last-name">Last name</label>
                        <input
                            type="text"
                            name="last-name"
                            placeholder="Your last name"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email*</label>
                        <input
                            type="email"
                            name="email"
                            id="signup-input-email"
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
                            id="signup-input-password"
                            placeholder="supersecurepassword"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => setIsPasswordTouched(true)}
                        />
                        <span className="input-error">{passwordError}</span>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password-repeat">
                            Confirm password*
                        </label>
                        <input
                            type="password"
                            name="password-repeat"
                            id="signup-input-password-repeat"
                            placeholder="supersecurepassword"
                            required
                            onChange={(e) => {
                                setPasswordRepeat(e.target.value);
                                setIsPasswordRepeatTouched(true);
                            }}
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
