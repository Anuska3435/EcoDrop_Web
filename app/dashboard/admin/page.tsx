import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/api/protected";
import AdminUsersClient from "./_components/AdminUsersClient";

async function checkAdminAccess() {
    try {
        const user = await getCurrentUserProfile();
        if (user.role !== "admin") {
            redirect("/dashboard");
        }
        return user;
    } catch {
        redirect("/login");
    }
}

export default async function AdminUsersPage() {
    await checkAdminAccess();
    return <AdminUsersClient />;
}
