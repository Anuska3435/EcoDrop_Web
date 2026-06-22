"use server";

import { revalidatePath } from "next/cache";
import { updateUserProfile } from "@/lib/api/protected";
import { storeUserData } from "@/lib/cookies";

export async function handleUpdateProfile(formData: FormData) {
    try {
        const firstName = String(formData.get("firstName") ?? "").trim();
        const lastName = String(formData.get("lastName") ?? "").trim();
        const username = String(formData.get("username") ?? "").trim();
        const gender = String(formData.get("gender") ?? "").trim();
        const profileImage = formData.get("profileImage");

        if (!firstName || !lastName || !username || !gender) {
            return { success: false, message: "All profile fields are required" };
        }

        const payload = new FormData();
        payload.append("firstName", firstName);
        payload.append("lastName", lastName);
        payload.append("username", username);
        payload.append("gender", gender);

        if (profileImage instanceof File && profileImage.size > 0) {
            payload.append("profileImage", profileImage);
        }

        const updatedUser = await updateUserProfile(payload);
        await storeUserData(updatedUser);
        revalidatePath("/dashboard/profile");
        revalidatePath("/dashboard");

        return {
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        };
    } catch (error: unknown) {
        const err = error as { message?: string };
        return {
            success: false,
            message: err.message || "Failed to update profile",
        };
    }
}

export async function handleUpdatePassword(formData: FormData) {
    try {
        const currentPassword = String(formData.get("currentPassword") ?? "");
        const newPassword = String(formData.get("newPassword") ?? "");
        const confirmPassword = String(formData.get("confirmPassword") ?? "");

        if (!currentPassword || !newPassword || !confirmPassword) {
            return { success: false, message: "All password fields are required" };
        }

        if (newPassword !== confirmPassword) {
            return { success: false, message: "New passwords do not match" };
        }

        const payload = new FormData();
        payload.append("currentPassword", currentPassword);
        payload.append("newPassword", newPassword);
        payload.append("confirmPassword", confirmPassword);

        await updateUserProfile(payload);

        return {
            success: true,
            message: "Password updated successfully",
        };
    } catch (error: unknown) {
        const err = error as { message?: string };
        return {
            success: false,
            message: err.message || "Failed to update password",
        };
    }
}
