import { registerUser, loginUser } from "./public";

export const register = async (data: Record<string, unknown>) => {
    try {
        const result = await registerUser(data);
        return result;
    } catch (error: unknown) {
        const err = error as { message?: string };
        throw new Error(err?.message || "Registration failed");
    }
};

export const login = async (data: Record<string, unknown>) => {
    try {
        const result = await loginUser(data);
        return result;
    } catch (error: unknown) {
        const err = error as { message?: string };
        throw new Error(err?.message || "Login failed");
    }
};
