"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAuthCookies } from "@/lib/cookies";
import { createUserReport } from "@/lib/api/protected";

import type { ReportRecord } from "@/lib/api/protected";

export async function handleCreateReport(formData: FormData): Promise<{ success: boolean; message: string; report?: ReportRecord }> {
    try {
        const title = String(formData.get("title") ?? "").trim();
        const category = String(formData.get("category") ?? "").trim();
        const description = String(formData.get("description") ?? "").trim();
        const image = formData.get("image");

        if (!title || !category || !description) {
            return { success: false, message: "All fields are required" };
        }

        if (!(image instanceof File) || image.size === 0) {
            return { success: false, message: "Please choose an image to upload" };
        }

        const payload = new FormData();
        payload.append("title", title);
        payload.append("category", category);
        payload.append("description", description);
        payload.append("image", image);

        const created = await createUserReport(payload);
        revalidatePath("/dashboard");

        return { success: true, message: "Report submitted successfully", report: created };
    } catch (error: unknown) {
        const err = error as { message?: string };
        return {
            success: false,
            message: err.message || "Failed to submit report"
        };
    }
}

export async function handleLogoutUser() {
    await clearAuthCookies();
    redirect("/login");
}
