import { getCurrentUserProfile } from "@/lib/api/protected";
import { getTokenCookie } from "@/lib/cookies";
import { AuthProvider } from "@/context/AuthProvider";
import type { DashboardUser } from "@/lib/api/protected";

async function loadInitialUser(): Promise<DashboardUser | null> {
    const token = await getTokenCookie();
    if (!token) {
        return null;
    }

    try {
        return await getCurrentUserProfile();
    } catch {
        return null;
    }
}

export default async function AuthProviderWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const initialUser = await loadInitialUser();

    return <AuthProvider initialUser={initialUser}>{children}</AuthProvider>;
}
