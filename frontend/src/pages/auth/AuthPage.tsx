import "./auth-page.css";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";

export default function AuthPage() {
    return (
        <>
            <Signup />
            <h1>Or</h1>
            <Login />
        </>
    );
}
