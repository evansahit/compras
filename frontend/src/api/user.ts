import type {
    ItemWithProducts,
    UserOutput,
    UserUpdate,
    UserWithItemsAndProducts,
    UserWithJWT,
} from "../types";
import { API_URL_BASE, getJsonAuthedHeaders } from "../constants";
import {
    transformToUserOutput,
    transformToItemWithProducts,
    transformToUserWithItemsAndProducts,
    transformToUserWithJWT,
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

export async function updateUser(
    userId: string,
    user: UserUpdate
): Promise<UserOutput | UserWithJWT> {
    if (!userId || !user)
        throw Error(
            "Something went wrong updating your information. Please try again."
        );

    const endpoint = `${endpointPrefix}/${userId}`;
    const url = API_URL_BASE + endpoint;

    const data = {
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

    if ("jwt" in json) {
        localStorage.setItem("jwt", json.jwt);

        return transformToUserWithJWT(json);
    } else {
        return transformToUserOutput(json);
    }
}

export async function updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
): Promise<void> {
    if (!userId || !oldPassword || !newPassword)
        throw Error(
            "Something went wrong changing your password. Make sure you have filled in both your old and new passwords."
        );

    const endpoint = `${endpointPrefix}/${userId}/update-password`;
    const url = API_URL_BASE + endpoint;

    const data = {
        old_plain_password: oldPassword,
        new_plain_password: newPassword,
    };

    const response = await fetch(url, {
        method: "PUT",
        headers: getJsonAuthedHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.detail || "Something went wrong changing your password."
        );
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
