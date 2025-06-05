import "./layout.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { Outlet } from "react-router";

export default function Layout() {
    return (
        <>
            <main>
                <Header />
                <div className="content">
                    <Outlet />
                </div>
                <Footer />
            </main>
        </>
    );
}
