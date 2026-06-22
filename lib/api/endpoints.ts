export const API = {
    AUTH: {
        REGISTER: "/api/v1/auth/register",
        LOGIN: "/api/v1/auth/login",
        WHOAMI: "/api/v1/auth/whoami",
        UPDATE: "/api/v1/auth/update",
    },
    REPORTS: {
        ROOT: "/api/v1/reports",
        SUMMARY: "/api/v1/reports/summary",
    },
} as const;

export const PUBLIC_API_PATHS = new Set<string>([
    API.AUTH.REGISTER,
    API.AUTH.LOGIN,
]);

export const PROTECTED_API_PATHS = new Set<string>([
    API.AUTH.WHOAMI,
    API.AUTH.UPDATE,
    API.REPORTS.ROOT,
    API.REPORTS.SUMMARY,
]);

export function isProtectedApiPath(path: string) {
    return PROTECTED_API_PATHS.has(path);
}

export function isPublicApiPath(path: string) {
    return PUBLIC_API_PATHS.has(path);
}
