import "./login-page.css";
import LoginForm from "../../components/login-form/LoginForm";
import { useLocation } from "react-router";

export default function LoginPage() {
    const location = useLocation();
    // console.log("[debug] location:", location);
    const from = location.state?.from?.pathname || "/";
    // console.log("[debug] from:", from);

    return (
        <div className="login-wrapper">
            {from ? (
                <h1>You need to login to see this page.</h1>
            ) : (
                <h1>Please login with your new account</h1>
            )}

            <LoginForm fromUrl={from} />
        </div>
    );
}
