import Image from "next/image";
import { redirect } from "next/navigation";
import ReportUploadForm from "@/app/dashboard/_components/ReportUploadForm";
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

    const name =
        user.firstName || user.username || user.email || "User";

    const statCards = [
        {
            title: "Total reports",
            value: String(summary.totalReports),
            description: "All e-waste reports you have submitted."
        },
        {
            title: "Categories tracked",
            value: String(summary.categoriesTracked),
            description: "Different report categories in your account."
        },
        {
            title: "Top category",
            value: summary.mostUsedCategory,
            description: "Your most frequently reported item type."
        },
        {
            title: "Latest activity",
            value: summary.latestReportAt
                ? new Date(summary.latestReportAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                })
                : "No reports yet",
            description: "Date of your most recent report."
        }
    ];

    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
                <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-medium text-sage-600">Dashboard</p>
                        <h1 className="mt-1 text-3xl font-bold text-gray-900 sm:text-4xl">
                            Welcome back, {name}
                        </h1>
                        <p className="mt-2 max-w-2xl text-gray-600">
                            Track your e-waste submissions, upload new reports, and review your recent activity.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-sage-100 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
                        Signed in as <span className="font-medium text-gray-900">{user.email}</span>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((card) => (
                        <div
                            key={card.title}
                            className="rounded-3xl border border-sage-100 bg-white p-6 shadow-sm"
                        >
                            <p className="text-sm font-medium text-sage-600">{card.title}</p>
                            <p className="mt-3 text-3xl font-bold text-gray-900">{card.value}</p>
                            <p className="mt-2 text-sm text-gray-600">{card.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <ReportUploadForm />

                    <div className="rounded-3xl border border-sage-100 bg-white p-6 shadow-sm">
                        <div className="mb-6">
                            <p className="text-sm font-medium text-sage-600">Recent activity</p>
                            <h2 className="mt-1 text-2xl font-semibold text-gray-900">Latest reports</h2>
                        </div>

                        {summary.recentReports.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-sage-200 bg-sage-50 px-5 py-10 text-center text-sm text-gray-600">
                                No reports submitted yet. Upload your first e-waste image to populate the dashboard.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {summary.recentReports.map((report) => (
                                    <div
                                        key={report._id}
                                        className="rounded-2xl border border-sage-100 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                                                <p className="mt-1 text-sm text-gray-600">{report.description}</p>
                                            </div>
                                            <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-700">
                                                {report.category}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-xs text-gray-500">
                                            {new Date(report.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <section className="mt-8 rounded-3xl border border-sage-100 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-sage-600">Report gallery</p>
                            <h2 className="mt-1 text-2xl font-semibold text-gray-900">Your uploaded items</h2>
                        </div>
                        <span className="rounded-full bg-sage-50 px-3 py-1 text-sm font-medium text-sage-700">
                            {reports.length} item{reports.length === 1 ? "" : "s"}
                        </span>
                    </div>

                    {reports.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-sage-200 bg-sage-50 px-5 py-10 text-center text-sm text-gray-600">
                            Your uploaded reports will appear here once you submit them.
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {reports.map((report) => (
                                <article
                                    key={report._id}
                                    className="overflow-hidden rounded-3xl border border-sage-100 bg-sage-50"
                                >
                                    <Image
                                        src={report.imageUrl}
                                        alt={report.title}
                                        width={600}
                                        height={400}
                                        className="h-52 w-full object-cover"
                                    />
                                    <div className="p-5">
                                        <div className="flex items-center justify-between gap-4">
                                            <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                                            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-sage-700">
                                                {report.category}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-sm text-gray-600">{report.description}</p>
                                        <p className="mt-4 text-xs text-gray-500">
                                            Uploaded {new Date(report.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
        </main>
    );
}
