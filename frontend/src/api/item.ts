import { API_URL_BASE, getJsonAuthedHeaders } from "../constants";
import type {
    ItemInput,
    ItemWithProducts,
    ItemUpdate,
    ItemOutput,
    ProductOutput,
} from "../types";
import {
    transformToItemOutput,
    transformToItemWithProducts,
    transformToProductOutput,
} from "./utils";

export async function createNewItem(
    newItem: ItemInput
): Promise<ItemWithProducts> {
    const endpoint = "/items";
    const url = API_URL_BASE + endpoint;

    const data = {
        user_id: newItem.userId,
        name: newItem.name,
    };

    const response = await fetch(url, {
        method: "POST",
        headers: getJsonAuthedHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.detail || "Something went wrong creating a new item."
        );
    }

    const json = await response.json();

    return transformToItemWithProducts(json);
}

export async function getProductsForItemByItemId(
    itemId: string
): Promise<ProductOutput[]> {
    const endpoint = `/items/${itemId}/products`;
    const url = API_URL_BASE + endpoint;

    const response = await fetch(url, {
        headers: {
            Authorization: localStorage.getItem("jwt") as string,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.detail || "Something went wrong creating a new item."
        );
    }

    const json = await response.json();
    const products = json.map((product) => transformToProductOutput(product));

    return products;
}

export async function updateItem(newItem: ItemUpdate): Promise<ItemOutput> {
    const endpoint = `/items/${newItem.id}`;
    const url = API_URL_BASE + endpoint;

    const data = {
        id: newItem.id,
        name: newItem.name,
        is_completed: newItem.isCompleted,
        is_archived: newItem.isArchived,
    };

    const response = await fetch(url, {
        method: "PUT",
        headers: getJsonAuthedHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.detail || "Something went wrong creating a new item."
        );
    }

    const json = await response.json();

    return transformToItemOutput(json);
}

export async function deleteItem(itemId: string): Promise<ItemOutput> {
    const endpoint = `/items/${itemId}`;
    const url = API_URL_BASE + endpoint;

    const response = await fetch(url, {
        method: "DELETE",
        headers: getJsonAuthedHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.detail || "Something went wrong creating a new item."
        );
    }

    const json = await response.json();

    return transformToItemOutput(json);
}
