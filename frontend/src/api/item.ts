import { API_URL_BASE, jsonAuthedHeaders } from "../constants";
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
} from "../utils/data-transformation";

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
        headers: jsonAuthedHeaders,
        body: JSON.stringify(data),
    });

    let json;
    try {
        json = await response.json();
    } catch {
        json = null;
    }

    if (!response.ok) {
        const error =
            json.detail || "Something went wrong creating a new item.";

        throw new Error(error);
    }

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

    console.log("response:");
    console.log(response);

    let json;
    try {
        json = await response.json();
    } catch {
        json = null;
    }

    console.log("json:");
    console.log(json);

    if (!response.ok) {
        const error =
            json.detail || "Something went wrong retrieving the products";
        throw new Error(error);
    }

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
        headers: jsonAuthedHeaders,
        body: JSON.stringify(data),
    });

    let json;
    try {
        json = await response.json();
    } catch {
        json = null;
    }

    if (!response.ok) {
        const error =
            json.detail || `Something went wrong updating item ${newItem.name}`;
        throw new Error(error);
    }

    return transformToItemOutput(json);
}

export async function deleteItem(itemId: string): Promise<ItemOutput> {
    const endpoint = `/items/${itemId}`;
    const url = API_URL_BASE + endpoint;

    const response = await fetch(url, {
        method: "DELETE",
        headers: jsonAuthedHeaders,
    });

    let json;
    try {
        json = await response.json();
    } catch {
        json = null;
    }

    if (!response.ok) {
        const error = json.detail || `Something went wrong deleting item`;
        throw new Error(error);
    }

    return transformToItemOutput(json);
}
