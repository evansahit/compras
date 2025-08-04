import type { UserOutput, UserInput } from "../types";
import { API_URL_BASE } from "../constants";
import { transformToUserOutput } from "./utils";
import type { NavigateFunction } from "react-router";

export async function createUser(formData: FormData): Promise<UserOutput> {
    const endpoint = "/users";
    const url = API_URL_BASE + endpoint;

    const userInput: UserInput = {
        first_name: formData.get("first-name") as string,
        last_name: formData.get("last-name") as string,
        email: formData.get("email") as string,
        plain_password: formData.get("password") as string,
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
    });

    let json;
    try {
        json = await response.json();
    } catch {
        json = null;
    }

    if (!response.ok) {
        const error = json.detail || "Something went wrong creating a new user";
        throw new Error(error);
    }

    return transformToUserOutput(json);
}

export async function login(formData: FormData): Promise<void> {
    const endpoint = "/token";
    const url = API_URL_BASE + endpoint;

    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Your email or password is incorrect.");
    }

    const json = await response.json();

    const jwt = `${json.token_type} ${json.access_token}`;

    localStorage.setItem("jwt", jwt);
}

export async function logout(navigate: NavigateFunction): Promise<void> {
    localStorage.removeItem("jwt");
    navigate("/");
}

export function isAuthed(): boolean {
    return Boolean(localStorage.getItem("jwt"));
}
