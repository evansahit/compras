import "./signuporlogin-page.css";
import SignupForm from "./components/signup-form/SignupForm";
import LoginForm from "./components/login-form/LoginForm";

export default function SignupOrLoginPage() {
    return (
        <>
            <SignupForm />
            <h1>Or</h1>
            <LoginForm />
        </>
    );
}
