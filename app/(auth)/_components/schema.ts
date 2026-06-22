import { z } from "zod";

export const GENDER_OPTIONS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export const registerSchema = z.object({
    fullName: z.string("Full name must be string")
        .min(2, "Full name must be at least 2 characters long"),
    email: z.email("Invalid email address"),
    gender: z.enum(
        ["male", "female", "other", "prefer_not_to_say"],
        "Please select a gender",
    ),
    password: z.string("Password must be string")
        .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string("Confirm Password must be string")
        .min(6, "Confirm Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string("Password must be string")
        .min(6, "Password must be at least 6 characters long"),
});

export type LoginFormData = z.infer<typeof loginSchema>;


