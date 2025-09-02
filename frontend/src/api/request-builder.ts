// TODO
export default async function requestBuilder<T>(
    url: string,
    method: "POST" | "PUT" | "DELETE",
    defaultErrorMessage: string,
    headers?: Record<string, string>,
    body?: string | FormData,
    transformFunction?: (arg: any) => Promise<T>
): Promise<T | void> {
    const response = await fetch(url, {
        method: method,
        headers: headers,
        body: body,
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.detail || defaultErrorMessage);
    }

    const json = await response.json();
    let res;
    if (transformFunction) res = transformFunction(json);

    if (res) return res;
}
