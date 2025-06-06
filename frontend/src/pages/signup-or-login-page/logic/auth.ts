import type { UserOutput, UserInput } from "../../../types";
import { API_URL_BASE } from "../../../constants";
import { convertToUserOutput } from "../../../util";

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

    if (!response.ok) {
        throw new Error("Something went wrong creating a new user");
    }

    const json = await response.json();

    return convertToUserOutput(json);
}

export async function loginUser(formData: FormData): Promise<void> {
    const endpoint = "/token";
    const url = API_URL_BASE + endpoint;

    const response: Response = await fetch(url, {
        method: "POST",
        body: formData,
    });
    const json = await response.json();

    if (!response.ok) {
        const error = json.detail || "Login failed";
        throw new Error(error);
    }

    const jwt = `${json.token_type} ${json.access_token}`;

    localStorage.setItem("jwt", jwt);
}
