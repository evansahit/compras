import type { ItemWithProducts, UserOutput } from "../types";
import { API_URL_BASE } from "../constants";
import {
    transformToUserOutput,
    transformToItemWithProducts,
} from "../utils/data-transformation";

export async function getCurrentUser(): Promise<UserOutput> {
    const endpoint = "/users/me";
    const url = API_URL_BASE + endpoint;

    const response = await fetch(url, {
        headers: {
            Authorization: localStorage.getItem("jwt") as string,
        },
    });

    let json;
    try {
        json = await response.json();
    } catch {
        json = null;
    }

    if (!response.ok) {
        const error =
            json.detail || "Something went wrong getting your user information";
        throw new Error(error);
    }

    return transformToUserOutput(json);
}

export async function getItemsForCurrentUser(
    userId: string
): Promise<ItemWithProducts[]> {
    const endpoint = `/users/${userId}/items`;
    const url = API_URL_BASE + endpoint;

    const response = await fetch(url, {
        headers: {
            Authorization: localStorage.getItem("jwt") as string,
        },
    });

    let json;
    try {
        json = await response.json();
    } catch {
        json = null;
    }

    if (!response.ok) {
        const error =
            json.detail || "Something went wrong getting your shopping list.";

        throw new Error(error);
    }

    const items = json.map((item) => transformToItemWithProducts(item));

    return items;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
