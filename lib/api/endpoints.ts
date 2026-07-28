export const API = {
    AUTH: {
        REGISTER: "/api/v1/auth/register",
        LOGIN: "/api/v1/auth/login",
        WHOAMI: "/api/v1/auth/whoami",
        UPDATE: "/api/v1/auth/update",
    },
    PASSWORD_RESET: {
        REQUEST: "/api/v1/password-reset/request",
        RESET: "/api/v1/password-reset/reset",
    },
    REPORTS: {
        ROOT: "/api/v1/reports",
        SUMMARY: "/api/v1/reports/summary",
    },
    ADMIN: {
        USERS: "/api/v1/admin/users",
    },
} as const;

export const PUBLIC_API_PATHS = new Set<string>([
    API.AUTH.REGISTER,
    API.AUTH.LOGIN,
    API.PASSWORD_RESET.REQUEST,
    API.PASSWORD_RESET.RESET,
]);

export const PROTECTED_API_PATHS = new Set<string>([
    API.AUTH.WHOAMI,
    API.AUTH.UPDATE,
    API.REPORTS.ROOT,
    API.REPORTS.SUMMARY,
    API.ADMIN.USERS,
]);

export function isProtectedApiPath(path: string) {
    return PROTECTED_API_PATHS.has(path) || path.startsWith("/api/v1/admin");
}

export function isPublicApiPath(path: string) {
    return PUBLIC_API_PATHS.has(path);
}
