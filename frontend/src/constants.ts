export const API_URL_BASE = "http://127.0.0.1:8000/api/v1";

export function getJsonAuthedHeaders() {
    return new Headers({
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt") as string,
    });
}

export const MIN_ITEM_NAME_LENGTH = 2;
