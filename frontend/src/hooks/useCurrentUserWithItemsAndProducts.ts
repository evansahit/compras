import { useCallback, useEffect, useState } from "react";
import type {
    ItemOutput,
    ItemUpdate,
    ItemWithProducts,
    UserOutput,
    UserUpdate,
    UserWithItemsAndProducts,
} from "../types";
import { getCurrentUserWithItemsAndProducts, updateUser } from "../api/user";
import { handleDefaultErrors } from "../api/utils";
import { createNewItem, deleteItem, updateItem } from "../api/item";
// import { logout } from "../api/auth";
// import { useNavigate } from "react-router";

export default function useCurrentUserWithItemsAndProducts() {
    const [data, setData] = useState<UserWithItemsAndProducts | undefined>(
        undefined
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    // const navigate = useNavigate();

    async function handleCreateNewItem(userId: string, itemName: string) {
        const newItem: ItemWithProducts = await createNewItem({
            userId: userId,
            name: itemName,
        });

        setData((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                itemsWithProducts: [...prev.itemsWithProducts, newItem],
            };
        });
    }

    async function handleUpdateItem(item: ItemUpdate) {
        const updatedItem: ItemOutput = await updateItem(item);

        setData((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                itemsWithProducts: prev.itemsWithProducts.map((i) =>
                    i.item.id === updatedItem.id
                        ? { ...i, item: { ...updatedItem } }
                        : i
                ),
            };
        });
    }

    async function handleDeleteItem(itemId: string) {
        await deleteItem(itemId);
        setData((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                itemsWithProducts: prev.itemsWithProducts.filter(
                    (i) => i.item.id !== itemId
                ),
            };
        });
    }

    async function handleUpdateUser(user: UserUpdate) {
        console.log("[debug] user:", user);

        try {
            setIsLoading(true);
            const updatedUser = await updateUser(user);

            setData((prev) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    updatedAt: updatedUser.updatedAt,
                };
            });
        } catch (error) {
            setError(handleDefaultErrors(error));
        } finally {
            setIsLoading(false);
        }
    }

    function handleClearError() {
        setError("");
    }

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await getCurrentUserWithItemsAndProducts();
            setData(res);
        } catch (error) {
            setError(handleDefaultErrors(error));
            // if jwt is bad, throw it away and log out
            // logout(navigate);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        isLoading,
        error,
        handleUpdateUser,
        handleCreateNewItem,
        handleUpdateItem,
        handleDeleteItem,
        handleClearError,
        refreshData: fetchData,
    };
}
