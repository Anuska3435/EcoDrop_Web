import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const register = async (data: Record<string, unknown>) => {
    try {
        const response = await axiosInstance.post(API.AUTH.REGISTER, data);
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err?.response?.data?.message || "Registration failed");
    }
};

export const login = async (data: Record<string, unknown>) => {
    try {
        const response = await axiosInstance.post(API.AUTH.LOGIN, data);
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        throw new Error(err?.response?.data?.message || "Login failed");
    }
};


