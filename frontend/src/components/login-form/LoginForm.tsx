import "./login-form.css";
import ButtonPrimary from "../button/button-primary/ButtonPrimary";
import React, { useState, useEffect } from "react";
import { validateEmail, validatePassword } from "../../utils/form-validation";
import { loginUser } from "../../api/auth";
import { useNavigate } from "react-router";

export default function LoginForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [isEmailTouched, setIsEmailTouched] = useState(false);
    const [isPasswordTouched, setIsPasswordTouched] = useState(false);

    const [isFormLoading, setIsFormLoading] = useState(false);
    const [formError, setFormError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsFormLoading(true);
        setFormError("");

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            await loginUser(formData);
            navigate("/home");
        } catch (error) {
            setFormError(error as string);
        } finally {
            setIsFormLoading(false);
        }
    }

    useEffect(() => {
        if (isEmailTouched) setEmailError(validateEmail(email));
        if (isPasswordTouched) setPasswordError(validatePassword(password));

        if (
            emailError.length !== 0 ||
            passwordError.length !== 0 ||
            email.length === 0 ||
            password.length === 0 ||
            isFormLoading
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
        isFormLoading,
    ]);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <span className="form-title">Login</span>

                <div className="input-container">
                    <div className="input-group">
                        <label htmlFor="login-input-email">Email*</label>
                        <input
                            type="email"
                            name="username"
                            id="login-input-email"
                            placeholder="your@email.com"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => setIsEmailTouched(true)}
                        />
                        <span className="input-error">{emailError}</span>
                    </div>

                    <div className="input-group">
                        <label htmlFor="login-input-password">Password*</label>
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

                <span className="form-error">{formError}</span>

                <ButtonPrimary type="submit" disabled={isSubmitButtonDisabled}>
                    {isFormLoading ? "Working on it..." : "Log in"}
                </ButtonPrimary>
            </form>
        </>
    );
}
