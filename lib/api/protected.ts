import "server-only";

import { API } from "@/lib/api/endpoints";
import { getTokenCookie } from "@/lib/cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    status: number;
}

export interface DashboardUser {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    gender: string;
    role: string;
    profileImageUrl?: string | null;
    profileImagePath?: string | null;
    originalProfileFileName?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ReportRecord {
    _id: string;
    userId: string;
    title: string;
    category: string;
    description: string;
    imageUrl: string;
    imagePath: string;
    originalFileName: string;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardSummary {
    totalReports: number;
    categoriesTracked: number;
    mostUsedCategory: string;
    latestReportAt: string | null;
    recentReports: ReportRecord[];
}

async function authenticatedFetch<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
    const token = await getTokenCookie();

    if (!token) {
        throw new Error("Unauthorized");
    }

    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);

    if (!(init.body instanceof FormData) && init.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...init,
        headers,
        cache: "no-store"
    });

    const result = await response.json() as ApiResponse<T>;

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Request failed");
    }

    return result.data;
}

export async function getCurrentUserProfile() {
    return authenticatedFetch<DashboardUser>(API.AUTH.WHOAMI);
}

export async function updateUserProfile(formData: FormData) {
    return authenticatedFetch<DashboardUser>(API.AUTH.UPDATE, {
        method: "PATCH",
        body: formData
    });
}

export async function getDashboardSummary() {
    return authenticatedFetch<DashboardSummary>(API.REPORTS.SUMMARY);
}

export async function getUserReports() {
    return authenticatedFetch<ReportRecord[]>(API.REPORTS.ROOT);
}

export async function createUserReport(formData: FormData) {
    return authenticatedFetch<ReportRecord>(API.REPORTS.ROOT, {
        method: "POST",
        body: formData
    });
}
