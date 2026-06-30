import { redirect } from "next/navigation";
import ProfileUpdateForm from "@/app/dashboard/profile/_components/ProfileUpdateForm";
import { getCurrentUserProfile } from "@/lib/api/protected";
import { getTokenCookie } from "@/lib/cookies";

export default async function ProfilePage() {
    const token = await getTokenCookie();
    if (!token) {
        redirect("/login");
    }

    try {
        const user = await getCurrentUserProfile();

        if (user.role === "admin") {
            redirect("/dashboard");
        }

        return (
            <main className="mx-auto max-w-3xl px-6 py-12">
                <ProfileUpdateForm user={user} />
            </main>
        );
    } catch (error: unknown) {
        const err = error as { message?: string };

        if (err.message?.toLowerCase().includes("unauthorized")) {
            redirect("/login");
        }

        return (
            <main className="mx-auto max-w-3xl px-6 py-12">
                <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-sm font-medium text-red-600">Profile unavailable</p>
                    <h1 className="mt-2 text-2xl font-semibold text-gray-900">
                        We could not load your profile.
                    </h1>
                    <p className="mt-3 text-sm text-gray-600">
                        {err.message || "Please try again later."}
                    </p>
                </div>
            </main>
        );
    }
}
