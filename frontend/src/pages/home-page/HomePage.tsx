import "./home-page.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentUser, getItemsForCurrentUser } from "../../api/user";
import type { ItemWithProducts, UserOutput, ItemOutput } from "../../types";
import ShoppingList from "./components/ShoppingList";
import { createNewItem } from "../../api/item";

// TODO: need to find a more secure for storing JWTs
//       can someone fake having a JWT token by creating a localstorage entry named "jwt"?
export default function HomePage() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<UserOutput>();
    const [items, setItems] = useState<ItemWithProducts[] | []>([]);
    const [isItemsLoading, setIsItemsLoading] = useState(true);
    const [itemsError, setItemsError] = useState("");

    function handleAddNewItem(newItem: ItemWithProducts) {
        setItems((prev) => [...prev, newItem]);
    }

    function handleUpdateItem(newItem: ItemOutput) {
        setItems((prev) =>
            prev.map((itemWithProducts) =>
                itemWithProducts.item.id === newItem.id
                    ? { ...itemWithProducts, item: { ...newItem } }
                    : itemWithProducts
            )
        );
    }

    function handleDeleteItem(itemId: string) {
        setItems((prev) =>
            prev.filter(
                (itemWithProducts) => itemWithProducts.item.id !== itemId
            )
        );
    }

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
                // remove invalid jwt
                if (jwt) localStorage.removeItem("jwt");
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
            {!currentUser ? (
                <h1 id="page-loading">Loading...</h1>
            ) : (
                <>
                    <span id="greeting">
                        Hey {currentUser ? currentUser.firstName : "User"}
                    </span>
                    <h1 id="home-page-title">Shopping list</h1>
                    <p id="home-page-message">
                        Products will be searched and matched based on the names
                        of your items.
                    </p>

                    {isItemsLoading && (
                        <span id="list-loading">Loading shopping list...</span>
                    )}

                    {currentUser && (
                        <ShoppingList
                            userId={currentUser.id}
                            items={items}
                            itemsError={itemsError}
                            createItem={handleAddNewItem}
                            updateItem={handleUpdateItem}
                            deleteItem={handleDeleteItem}
                        />
                    )}
                </>
            )}
        </>
    );
}
