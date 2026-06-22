import { API } from "./endpoints";

const PROXY_BASE_URL = "/api/proxy";
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    status: number;
}

function toProxyPath(apiPath: string) {
    return `${PROXY_BASE_URL}${apiPath.replace(/^\/api/, "")}`;
}

function resolveProxyUrl(apiPath: string) {
    const proxyPath = toProxyPath(apiPath);
    if (typeof window === "undefined") {
        return `${APP_BASE_URL}${proxyPath}`;
    }
    return proxyPath;
}

async function publicFetch<T>(
    apiPath: string,
    init: RequestInit = {}
): Promise<ApiResponse<T>> {
    const headers = new Headers(init.headers);

    if (!(init.body instanceof FormData) && init.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(resolveProxyUrl(apiPath), {
        ...init,
        headers,
        cache: "no-store",
    });

    const result = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Request failed");
    }

    return result;
}

export async function registerUser(data: Record<string, unknown>) {
    return publicFetch<Record<string, unknown>>(API.AUTH.REGISTER, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function loginUser(data: Record<string, unknown>) {
    return publicFetch<{ user: Record<string, unknown>; token: string }>(API.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify(data),
    });
}
