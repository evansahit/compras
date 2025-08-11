import type {
    ItemWithProducts,
    UserOutput,
    UserUpdate,
    UserWithItemsAndProducts,
} from "../types";
import { API_URL_BASE, getJsonAuthedHeaders } from "../constants";
import {
    transformToUserOutput,
    transformToItemWithProducts,
    transformToUserWithItemsAndProducts,
} from "./utils";

const endpointPrefix = "/users";

export async function getCurrentUser(): Promise<UserOutput> {
    const endpoint = `${endpointPrefix}/me`;
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

export async function getCurrentUserWithItemsAndProducts(): Promise<UserWithItemsAndProducts> {
    const endpoint = `${endpointPrefix}/current-user-with-items-and-products`;
    const url = API_URL_BASE + endpoint;

    const response = await fetch(url, {
        headers: {
            Authorization: localStorage.getItem("jwt") as string,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.detail ||
                "Something went wrong getting user and item information"
        );
    }

    const json = await response.json();

    return transformToUserWithItemsAndProducts(json);
}

export async function getItemsByUserId(
    userId: string
): Promise<ItemWithProducts[]> {
    const endpoint = `${endpointPrefix}/${userId}/items`;
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

    const json: unknown[] = await response.json();

    return json.map((item) => transformToItemWithProducts(item));
}

export async function updateUser(user: UserUpdate) {
    const endpoint = `${endpointPrefix}/${user.id}`;
    const url = API_URL_BASE + endpoint;

    const data = {
        id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
    };

    const response = await fetch(url, {
        method: "PUT",
        headers: getJsonAuthedHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.detail || "Something went wrong updating your information."
        );
    }

    const json = await response.json();

    return transformToUserOutput(json);
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
