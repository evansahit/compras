import { API_URL_BASE, jsonAuthedHeaders } from "../constants";
import type { ItemInput, ItemOutput } from "../types";
import { convertToItemOutput } from "../utils/data-transformation";

export async function createNewItem(newItem: ItemInput): Promise<void> {
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

    // let json;

    // try {
    //     json = await response.json();
    // } catch {
    //     json = null;
    // }

    // if (!response.ok) {
    //     const error =
    //         json.detail || "Something went wrong creating a new item.";

    //     throw new Error(error);
    // }

    // return convertToItemOutput(json);
}
