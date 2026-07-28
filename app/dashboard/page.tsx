import { redirect } from "next/navigation";
import DashboardOverview from "@/app/dashboard/_components/DashboardOverview";
import { getDashboardSummary, getCurrentUserProfile, getUserReports } from "@/lib/api/protected";
import { getTokenCookie } from "@/lib/cookies";

async function loadDashboardData() {
    try {
        const [user, summary, reports] = await Promise.all([
            getCurrentUserProfile(),
            getDashboardSummary(),
            getUserReports()
        ]);

        return { user, summary, reports, error: null };
    } catch (error: unknown) {
        const err = error as { message?: string };

        if (err.message?.toLowerCase().includes("unauthorized")) {
            redirect("/login");
        }

        return {
            user: null,
            summary: null,
            reports: [],
            error: err.message || "Please check that the backend server is running and try again."
        };
    }
}

export default async function DashboardPage() {
    const token = await getTokenCookie();
    if (!token) {
        redirect("/login");
    }

    const { user, summary, reports, error } = await loadDashboardData();

    if (error || !user || !summary) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-sage-50 px-6">
                <div className="max-w-lg rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-sm font-medium text-red-600">Dashboard unavailable</p>
                    <h1 className="mt-2 text-2xl font-semibold text-gray-900">
                        We could not load your dashboard data.
                    </h1>
                    <p className="mt-3 text-sm text-gray-600">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return <DashboardOverview user={user} summary={summary} reports={reports} />;
}
