import type { ItemOutput, UserOutput } from "../../../types";
import { API_URL_BASE } from "../../../constants";
import { convertToUserOutput, convertToItemOutput } from "../../../util";

export async function getCurrentUser(): Promise<UserOutput> {
    const endpoint = "/users/me";
    const url = API_URL_BASE + endpoint;

    const response = await fetch(url, {
        headers: {
            Authorization: localStorage.getItem("jwt") as string,
        },
    });

    const json = await response.json();

    if (!response.ok) {
        const error =
            json.detail || "Something went wrong getting your user data";
        throw new Error(error);
    }

    return convertToUserOutput(json);
}

export async function getItemsForCurrentUser(
    userId: string
): Promise<ItemOutput[]> {
    const endpoint = `/${userId}/items`;
    const url = API_URL_BASE + endpoint;

    const response = await fetch(url, {
        headers: {
            Authorization: localStorage.getItem("jwt") as string,
        },
    });

    const json = await response.json();

    if (!response) {
        const error =
            json.detail || "Something went wrong retrieving your items";
        throw new Error(error);
    }

    if (response.status === 404) {
        const error = json.detail || "This user does not exist";
        throw new Error(error);
    }

    const items = json.map((item) => {
        convertToItemOutput(item);
    });

    return items;
}
