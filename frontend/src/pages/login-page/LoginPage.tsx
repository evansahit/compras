import "./login-page.css";
import LoginForm from "../../components/login-form/LoginForm";

export default function LoginPage() {
    return (
        <div className="login-wrapper">
            <h1>Please login with your new account</h1>
            <LoginForm />
        </div>
    );
}
