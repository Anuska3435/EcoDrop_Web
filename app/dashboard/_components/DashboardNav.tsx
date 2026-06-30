"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import EcoDropLogo from "@/app/_components/EcoDropLogo";
import LogoutButton from "@/app/dashboard/_components/LogoutButton";
import { fetchCurrentUserClient } from "@/lib/api/client-protected";
import { DashboardUser } from "@/lib/api/protected";

export default function DashboardNav() {
    const pathname = usePathname();
    const [user, setUser] = useState<DashboardUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await fetchCurrentUserClient();
                setUser(currentUser);
            } catch {
                // Ignore errors
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const links = [
        { href: "/dashboard", label: "Overview" },
        ...(user?.role !== "admin" 
            ? [
                { href: "/dashboard/profile", label: "Profile" },
                { href: "/dashboard/password", label: "Password" }
              ] 
            : []),
        ...(user?.role === "admin" ? [{ href: "/dashboard/admin", label: "Admin" }] : []),
    ];

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
