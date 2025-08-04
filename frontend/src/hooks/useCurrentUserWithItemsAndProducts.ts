import { useCallback, useEffect, useState } from "react";
import type {
    ItemOutput,
    ItemUpdate,
    ItemWithProducts,
    UserWithItemsAndProducts,
} from "../types";
import { getCurrentUserWithItemsAndProducts } from "../api/user";
import { handleDefaultErrors } from "../api/utils";
// import { logout } from "../api/auth";
// import { useNavigate } from "react-router";
import { createNewItem, deleteItem, updateItem } from "../api/item";

export default function useCurrentUserWithItemsAndProducts() {
    // const navigate = useNavigate();
    const [data, setData] = useState<UserWithItemsAndProducts | undefined>(
        undefined
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

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

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await getCurrentUserWithItemsAndProducts();
            setData(res);
        } catch (error) {
            setError(handleDefaultErrors(error));
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
        handleCreateNewItem,
        handleUpdateItem,
        handleDeleteItem,
        refreshData: fetchData,
    };
}
