import type { ItemWithProducts, UserOutput } from "../types";
import { API_URL_BASE } from "../constants";
import { transformToUserOutput, transformToItemWithProducts } from "./utils";

export async function getCurrentUser(): Promise<UserOutput> {
    const endpoint = "/users/me";
    const url = API_URL_BASE + endpoint;

    const response = await fetch(url, {
        headers: {
            Authorization: localStorage.getItem("jwt") as string,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.detail || "Something went wrong getting your user information"
        );
    }

    const json = await response.json();

    return transformToUserOutput(json);
}

export async function getItemsByUserId(
    userId: string
): Promise<ItemWithProducts[]> {
    const endpoint = `/users/${userId}/items`;
    const url = API_URL_BASE + endpoint;

    const response = await fetch(url, {
        headers: {
            Authorization: localStorage.getItem("jwt") as string,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.detail || "Something went wrong getting your shopping list."
        );
    }

    const json = await response.json();

    return json.map((item) => transformToItemWithProducts(item));
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
