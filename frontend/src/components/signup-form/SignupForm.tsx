import "./signup-form.css";
import { useState, useEffect, type FormEvent } from "react";
import ButtonPrimary from "../button/button-primary/ButtonPrimary";
import {
    validateFirstName,
    validateEmail,
    validatePassword,
    validatePasswordsMatch,
} from "../../utils/form-validation";
import { useNavigate } from "react-router";

import { createUser } from "../../api/auth";

export default function SignUpForm() {
    const navigate = useNavigate();

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

    const [isFormLoading, setIsFormLoading] = useState(false);
    const [formError, setFormError] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        setIsFormLoading(true);
        setFormError("");
        e.preventDefault();
        const formElement = e.currentTarget;
        const formData = new FormData(formElement);

        try {
            await createUser(formData);
            navigate("/login");
        } catch (error) {
            setFormError(
                error instanceof Error ? error.message : "Unknown error"
            );
        } finally {
            setIsFormLoading(false);
        }
    }

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
            passwordRepeat.length === 0 ||
            isFormLoading
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
        isFormLoading,
    ]);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <span className="form-title">Sign up</span>

                <div className="input-container">
                    <div className="input-group">
                        <label htmlFor="signup-input-first-name">
                            First name*
                        </label>
                        <input
                            type="text"
                            name="first-name"
                            id="signup-input-first-name"
                            placeholder="Your first name"
                            required
                            onChange={(e) => setFirstName(e.target.value)}
                            onBlur={() => setIsFirstNameTouched(true)}
                        />
                        <span className="input-error">{firstNameError}</span>
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-input-last-name">
                            Last name
                        </label>
                        <input
                            type="text"
                            name="last-name"
                            id="signup-input-last-name"
                            placeholder="Your last name"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="signup-input-email">Email*</label>
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
                        <label htmlFor="signup-input-password">Password*</label>
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
                        <label htmlFor="signup-input-password-repeat">
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

                {formError && <span className="form-error">{formError}</span>}

                <ButtonPrimary
                    type="submit"
                    disabled={isSubmitButtonDisabled}
                    isloading={isFormLoading}
                >
                    Sign up
                </ButtonPrimary>
            </form>
        </>
    );
}
