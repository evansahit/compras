import "./auth-page.css";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";

export default function AuthPage() {
    return (
        <>
            <h1>Sign up or log in</h1>
            <Signup />
            <Login />
        </>
    );
}
