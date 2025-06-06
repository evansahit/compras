import "./home-page.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentUser, getItemsForCurrentUser } from "./logic/user";
import type { ItemOutput, UserOutput } from "../../types";

export default function HomePage() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<UserOutput>();
    const [items, setItems] = useState<ItemOutput[] | undefined | null>();
    const [isItemsLoading, setIsItemsLoading] = useState(true);

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
                const items: ItemOutput[] = await getItemsForCurrentUser(
                    userId
                );
                setItems(items);
                setIsItemsLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        if (currentUser) getItemDataForCurrentUser(currentUser.id);
    }, [currentUser]);

    return (
        <>
            <span className="greeting">
                Hey {currentUser ? currentUser.firstName : "User"}
            </span>
            <h1>Shopping list</h1>
            {isItemsLoading && "Loading shopping list..."}
            {items ? (
                <ul>
                    {items.map((item: ItemOutput) => (
                        <>
                            <li>{item.id}</li>
                            <li>{item.name}</li>
                            <li>{item.groceryStore}</li>
                            <li>{item.lowestPrice}</li>
                            <li>{item.isCompleted}</li>
                            <li>{item.isArchived}</li>
                            <li>{item.createdAt.toDateString()}</li>
                            <li>{item.updatedAt.toDateString()}</li>
                        </>
                    ))}
                </ul>
            ) : (
                <p>There are no items in your shopping list.</p>
            )}
        </>
    );
}
