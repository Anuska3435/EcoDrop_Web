"use client";

import { API } from "./endpoints";
import type { DashboardUser, PaginatedUsersResponse } from "./protected";

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
        method: "PUT",
        body: formData,
    });
}

// Admin client functions
export async function adminGetUsersClient(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedUsersResponse> {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search) params.set("search", search);
    return protectedClientFetch<PaginatedUsersResponse>(`${API.ADMIN.USERS}?${params.toString()}`);
}

export async function adminCreateUserClient(userData: Partial<DashboardUser> & { password: string }): Promise<DashboardUser> {
    return protectedClientFetch<DashboardUser>(API.ADMIN.USERS, {
        method: "POST",
        body: JSON.stringify(userData)
    });
}

export async function adminUpdateUserClient(id: string, userData: Partial<DashboardUser> & { password?: string }): Promise<DashboardUser> {
    return protectedClientFetch<DashboardUser>(`${API.ADMIN.USERS}/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData)
    });
}

export async function adminDeleteUserClient(id: string): Promise<void> {
    return protectedClientFetch<void>(`${API.ADMIN.USERS}/${id}`, {
        method: "DELETE"
    });
}
