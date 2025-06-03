const API_URL_BASE = "http://localhost:8000";

async function createUser(formData: FormData, endpoint = "/users") {
    const url = API_URL_BASE + endpoint;

    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });
}

export { createUser };
