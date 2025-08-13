import { useCallback, useEffect, useState } from "react";
import type {
    ItemOutput,
    ItemUpdate,
    ItemWithProducts,
    UserUpdate,
    UserWithItemsAndProducts,
} from "../types";
import {
    getCurrentUserWithItemsAndProducts,
    updatePassword,
    updateUser,
} from "../api/user";
import { handleDefaultErrors } from "../api/utils";
import { createNewItem, deleteItem, updateItem } from "../api/item";

export default function useCurrentUserWithItemsAndProducts() {
    const [data, setData] = useState<UserWithItemsAndProducts | undefined>(
        undefined
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleCreateNewItem(userId: string, itemName: string) {
        try {
            setIsLoading(true);
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
        } catch (error) {
            setError(handleDefaultErrors(error));
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUpdateItem(item: ItemUpdate) {
        try {
            setIsLoading(true);
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
        } catch (error) {
            setError(handleDefaultErrors(error));
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDeleteItem(itemId: string) {
        try {
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
        } catch (error) {
            setError(handleDefaultErrors(error));
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUpdateUser(userId: string, user: UserUpdate) {
        try {
            setIsLoading(true);
            const updatedUser = await updateUser(userId, user);

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

    async function handlePasswordUpdate(
        userId: string,
        oldPassword: string,
        newPassword: string
    ) {
        try {
            setIsLoading(true);
            await updatePassword(userId, oldPassword, newPassword);
        } catch (error) {
            setError(handleDefaultErrors(error));
        } finally {
            setIsLoading(false);
        }
    }

    function handleClearError() {
        setError("");
    }

    function handleSetError(errorMessage: string) {
        setError(errorMessage);
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
        handlePasswordUpdate,
        handleUpdateItem,
        handleDeleteItem,
        handleClearError,
        handleSetError,
        refreshData: fetchData,
    };
}
