"use server";
import { register, login } from "@/lib/api/auth";
import { LoginFormData, RegisterFormData } from "@/app/(auth)/_components/schema";
import { toRegisterPayload } from "@/lib/api/register-payload";
import { setTokenCookie, storeUserData } from "@/lib/cookies";

export const handleRegisterUser = async (data: RegisterFormData) => {
    try {
        const result = await register(toRegisterPayload(data));
        if (result.success) {
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Registration failed" };
    } catch (error: unknown) {
        const err = error as { message?: string };
        return { success: false, message: err?.message || "Registration failed" };
    }
};

export const handleLoginUser = async (data: LoginFormData) => {
    try {
        const result = await login(data);
        const user = result.data.user;
        const token = result.data.token;
        await setTokenCookie(token);
        await storeUserData(user);

        if (result.success) {
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Login failed" };
    } catch (error: unknown) {
        const err = error as { message?: string };
        return { success: false, message: err?.message || "Login failed" };
    }
};


