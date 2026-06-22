"use client";

import { API } from "./endpoints";
import type { DashboardUser } from "./protected";

const PROXY_BASE_URL = "/api/proxy";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    status: number;
}

function toProxyPath(apiPath: string) {
    return `${PROXY_BASE_URL}${apiPath.replace(/^\/api/, "")}`;
}

async function protectedClientFetch<T>(
    apiPath: string,
    init: RequestInit = {}
): Promise<T> {
    const headers = new Headers(init.headers);

    if (!(init.body instanceof FormData) && init.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(toProxyPath(apiPath), {
        ...init,
        headers,
        cache: "no-store",
    });

    const result = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Request failed");
    }

    return result.data;
}

export async function fetchCurrentUserClient() {
    return protectedClientFetch<DashboardUser>(API.AUTH.WHOAMI);
}

export async function updateUserProfileClient(formData: FormData) {
    return protectedClientFetch<DashboardUser>(API.AUTH.UPDATE, {
        method: "PATCH",
        body: formData,
    });
}
