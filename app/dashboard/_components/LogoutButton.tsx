"use client";

import { useAuth } from "@/context/AuthProvider";
import { handleLogoutUser } from "@/lib/actions/dashboard-action";

export default function LogoutButton() {
    const { clearUser } = useAuth();

    return (
        <form
            action={async () => {
                clearUser();
                await handleLogoutUser();
            }}
        >
            <button
                type="submit"
                className="rounded-full border border-sage-200 px-4 py-2 text-sm font-medium text-sage-700 transition-colors hover:border-sage-300 hover:bg-sage-50"
            >
                Sign Out
            </button>
        </form>
    );
}
