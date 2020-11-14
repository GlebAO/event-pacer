export async function getResource(url: string, method: "POST" | "GET" = "GET", body?: any) {
    if (!process.env.REACT_APP_API_URL) {
        throw new Error(`No API URL`);
    }
    const endpoint = `${process.env.REACT_APP_API_URL}${url}`;
    const headers:{[x:string]: string} = {
        "Content-Type": "application/json;charset=utf-8",
    };
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const params = {
        method,
        headers,
        body: body && JSON.stringify(body),
    };

    const res = await fetch(endpoint, params);

    if(res.status >= 500) {
        new Error(`Could not fetch ${url}, received ${res.status}`)
    }

    if (!res.ok) {
        throw await res.json();
    }

    return await res.json();
}