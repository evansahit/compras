import "./signuporlogin-page.css";
import SignupForm from "../../components/signup-form/SignupForm";
import LoginForm from "../../components/login-form/LoginForm";

// TODO: handle default errors / errors relating to not being able to connect to the backend server.
export default function SignupOrLoginPage() {
    return (
        <>
            <LoginForm />
            <h1 className="text-seperator">Or</h1>
            <SignupForm />
        </>
    );
}
