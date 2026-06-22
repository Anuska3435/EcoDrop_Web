import { RegisterFormData } from "@/app/(auth)/_components/schema";

export type RegisterApiPayload = {
    fullName: string;
    email: string;
    gender: string;
    password: string;
    confirmPassword: string;
};

function normalizeEmail(email: string) {
    return email.trim().toLowerCase().replace(/\s+/g, "");
}

function normalizeFullName(name: string) {
    return name.trim().replace(/\s+/g, " ");
}

export function toRegisterPayload(data: RegisterFormData): RegisterApiPayload {
    return {
        fullName: normalizeFullName(data.fullName),
        email: normalizeEmail(data.email),
        gender: data.gender,
        password: data.password,
        confirmPassword: data.confirmPassword,
    };
}
