"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import EcoDropLogo from "@/app/_components/EcoDropLogo";
import LogoutButton from "@/app/dashboard/_components/LogoutButton";

const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/password", label: "Password" },
];

export default function DashboardNav() {
    const pathname = usePathname();

    return (
        <header className="border-b border-sage-100 bg-white/80 backdrop-blur-sm">
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <EcoDropLogo href="/" size="sm" />
                <div className="flex items-center gap-2 sm:gap-4">
                    {links.map((link) => {
                        const isActive =
                            pathname === link.href ||
                            (link.href !== "/dashboard" && pathname.startsWith(link.href));

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-sage-100 text-sage-800"
                                        : "text-sage-700 hover:bg-sage-50"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    <LogoutButton />
                </div>
            </nav>
        </header>
    );
}
