import Link from "next/link";
import { getUserData } from "@/lib/cookies";
import EcoDropLogo from "@/app/_components/EcoDropLogo";

export default async function DashboardPage() {
    const user = await getUserData();
    const name =
        user?.firstName || user?.username || user?.name || user?.email || "User";

    const features = [
        {
            title: "Recycling Centers",
            description: "Find nearby e-waste recycling centers using maps and GPS.",
            href: "#",
        },
        {
            title: "Activity Tracker",
            description: "Record and monitor your recycling history over time.",
            href: "#",
        },
        {
            title: "Education",
            description: "Learn about e-waste impact and proper recycling methods.",
            href: "#",
        },
        {
            title: "Notifications",
            description: "Get reminders and updates about recycling events near you.",
            href: "#",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white">
            <header className="border-b border-sage-100 bg-white/80 backdrop-blur-sm">
                <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <EcoDropLogo href="/" size="sm" />
                    <Link
                        href="/login"
                        className="text-sm font-medium text-sage-700 hover:text-sage-800"
                    >
                        Sign Out
                    </Link>
                </nav>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-12">
                <div className="mb-10">
                    <p className="text-sm font-medium text-sage-600">Dashboard</p>
                    <h1 className="mt-1 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Welcome back, {name}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Your overview of recycling activities, nearby centers, and updates.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-2xl border border-sage-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <h2 className="text-lg font-semibold text-gray-900">
                                {feature.title}
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}


