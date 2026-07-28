"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { fetchCurrentUserClient } from "@/lib/api/client-protected";
import type { DashboardUser } from "@/lib/api/protected";

interface AuthContextValue {
    user: DashboardUser | null;
    isLoading: boolean;
    setUser: (user: DashboardUser | null) => void;
    refreshUser: () => Promise<DashboardUser | null>;
    clearUser: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
    initialUser?: DashboardUser | null;
}

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
    const [user, setUser] = useState<DashboardUser | null>(initialUser);
    const [isLoading, setIsLoading] = useState(!initialUser);

    const refreshUser = useCallback(async () => {
        try {
            const currentUser = await fetchCurrentUserClient();
            setUser(currentUser);
            return currentUser;
        } catch {
            setUser(null);
            return null;
        }
    }, []);

    const clearUser = useCallback(() => {
        setUser(null);
    }, []);

    useEffect(() => {
        if (initialUser) return;

        const timer = window.setTimeout(() => {
            void refreshUser().finally(() => setIsLoading(false));
        }, 0);

        return () => {
            window.clearTimeout(timer);
        };
    }, [initialUser, refreshUser]);

    const value = useMemo(
        () => ({
            user,
            isLoading,
            setUser,
            refreshUser,
            clearUser,
        }),
        [user, isLoading, refreshUser, clearUser]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
