import "./landing-page.css";
import Hero from "./components/hero/Hero";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import ShoppingList from "../home-page/components/shopping-list/ShoppingList";
import { generateTestData } from "../../utils/test-data";

export default function LandingPage() {
    const navigate = useNavigate();
    const items = generateTestData();

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) navigate("/home");
    }, [navigate]);

    return (
        <div id="landing-page-container">
            {/* <div className="blob"></div> */}
            <Hero />
            <div id="demo-container">
                <span id="demo-title">check it out</span>
                <ShoppingList
                    userId="test"
                    items={items}
                    createItem={() => null}
                    updateItem={() => null}
                    deleteItem={() => null}
                    demoMode
                />
            </div>
        </div>
    );
}
