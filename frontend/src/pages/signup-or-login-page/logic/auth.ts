import type { UserOutput, UserInput } from "../../../types";
import { API_URL_BASE } from "../../../constants";

async function createUser(formData: FormData): Promise<UserOutput> {
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

    const data = await response.json();
    console.log("data from backend:");
    console.table(data);

    const res: UserOutput = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };

    console.log("transformed data from backend:");
    console.table(res);

    return res;
}

export { createUser };
