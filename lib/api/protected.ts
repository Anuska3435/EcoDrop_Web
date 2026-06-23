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

function toUploadsRoute(urlOrPath: string | null | undefined) {
    if (!urlOrPath) return "";

    // Backend sometimes returns a Windows filesystem path like:
    // "C:\\...\\uploads\\file.jpg" or "C:/.../uploads/file.jpg".
    // Convert it into our Next.js route: `/uploads/file.jpg`
    {
        const normalized = urlOrPath.replace(/\\/g, "/");
        const idx = normalized.toLowerCase().lastIndexOf("/uploads/");
        if (idx !== -1) {
            const uploadsPath = normalized.slice(idx); // "/uploads/...."
            return uploadsPath;
        }
    }

    // If API returns a relative uploads path like "/uploads/xxx.jpg", keep it.
    if (urlOrPath.startsWith("/")) {
        return urlOrPath;
    }

    // If API returns a full URL, extract its pathname (we will serve it via our `/uploads/*` route).
    try {
        const u = new URL(urlOrPath);
        return u.pathname + u.search;
    } catch {
        // Fallback: treat as a path without leading slash.
        return urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
    }
}

function normalizeReport(record: ReportRecord): ReportRecord {
    // Prefer imagePath when present; it's usually more reliable than a pre-built imageUrl from the backend.
    const stableUrl = record.imagePath ? toUploadsRoute(record.imagePath) : toUploadsRoute(record.imageUrl);
    return {
        ...record,
        imageUrl: stableUrl
    };
}

function normalizeUser(user: DashboardUser): DashboardUser {
    const stableProfileUrl = user.profileImagePath
        ? toUploadsRoute(user.profileImagePath)
        : toUploadsRoute(user.profileImageUrl ?? "");

    return {
        ...user,
        profileImageUrl: stableProfileUrl || user.profileImageUrl,
    };
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
    const user = await authenticatedFetch<DashboardUser>(API.AUTH.WHOAMI);
    return normalizeUser(user);
}

export async function updateUserProfile(formData: FormData) {
    const updated = await authenticatedFetch<DashboardUser>(API.AUTH.UPDATE, {
        method: "PUT",
        body: formData
    });
    return normalizeUser(updated);
}

export async function getDashboardSummary() {
    const summary = await authenticatedFetch<DashboardSummary>(API.REPORTS.SUMMARY);
    return {
        ...summary,
        recentReports: summary.recentReports.map(normalizeReport)
    };
}

export async function getUserReports() {
    const reports = await authenticatedFetch<ReportRecord[]>(API.REPORTS.ROOT);
    return reports.map(normalizeReport);
}

export async function createUserReport(formData: FormData) {
    const created = await authenticatedFetch<ReportRecord>(API.REPORTS.ROOT, {
        method: "POST",
        body: formData
    });
    return normalizeReport(created);
}
