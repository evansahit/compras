import "./home-page.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentUser, getItemsForCurrentUser } from "../../api/user";
import type { ItemWithProducts, UserOutput } from "../../types";
import ShoppingList from "./components/ShoppingList";

export default function HomePage() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<UserOutput>();
    const [items, setItems] = useState<ItemWithProducts[] | []>([]);
    const [isItemsLoading, setIsItemsLoading] = useState(true);
    const [itemsError, setItemsError] = useState("");

    // make a request to get the current user to get their name
    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) navigate("/signup-or-login");

        async function getCurrentUserData() {
            try {
                const user: UserOutput = await getCurrentUser();
                setCurrentUser(user);
            } catch (error) {
                console.log(error);
                navigate("/signup-or-login");
            }
        }

        getCurrentUserData();
    }, [navigate]);

    // make a request to get all the items belonging to this user
    useEffect(() => {
        if (!currentUser) return;

        async function getItemDataForCurrentUser(userId: string) {
            try {
                const items: ItemWithProducts[] = await getItemsForCurrentUser(
                    userId
                );
                setItems(items);
                setIsItemsLoading(false);
            } catch (error) {
                setItemsError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong retrieving your shopping list."
                );
            }
        }

        getItemDataForCurrentUser(currentUser.id);
    }, [currentUser]);

    return (
        <>
            {!currentUser && <h1>Loading...</h1>}

            <span className="greeting">
                Hey {currentUser ? currentUser.firstName : "User"}
            </span>
            <h1 className="home-title">Shopping list</h1>

            {isItemsLoading && (
                <span className="list-loading">Loading shopping list...</span>
            )}

            {currentUser && (
                <ShoppingList
                    userId={currentUser.id}
                    items={items}
                    itemsError={itemsError}
                    createItem={(newItem: ItemWithProducts) => {
                        setItems((prev) => [...prev, newItem]);
                    }}
                />
            )}
        </>
    );
}
