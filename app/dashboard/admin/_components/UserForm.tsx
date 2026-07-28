"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardUser } from "@/lib/api/protected";

const userSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
    role: z.enum(["admin", "user"]),
});

export type UserFormData = z.infer<typeof userSchema>;

function normalizeGender(gender: string): UserFormData["gender"] {
    return ["male", "female", "other", "prefer_not_to_say"].includes(gender)
        ? gender as UserFormData["gender"]
        : "prefer_not_to_say";
}

interface UserFormProps {
    user: DashboardUser | null;
    onClose: () => void;
    onSubmit: (data: UserFormData) => Promise<void>;
}

export default function UserForm({ user, onClose, onSubmit }: UserFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: user ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            gender: normalizeGender(user.gender),
            role: user.role === "admin" ? "admin" : "user",
            password: undefined,
        } : {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            gender: "prefer_not_to_say",
            role: "user",
        },
    });

    const isEdit = !!user;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEdit ? "Edit User" : "Create User"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                {...register("firstName")}
                                className="w-full rounded-2xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                {...register("lastName")}
                                className="w-full rounded-2xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full rounded-2xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            {...register("username")}
                            className="w-full rounded-2xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                        />
                        {errors.username && (
                            <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {isEdit ? "New Password (optional)" : "Password"}
                        </label>
                        <input
                            type="password"
                            {...register("password")}
                            className="w-full rounded-2xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gender
                            </label>
                            <select
                                {...register("gender")}
                                className="w-full rounded-2xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                            {errors.gender && (
                                <p className="mt-1 text-xs text-red-600">{errors.gender.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                            </label>
                            <select
                                {...register("role")}
                                className="w-full rounded-2xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-full border border-sage-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-sage-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 rounded-full bg-sage-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sage-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Saving..." : (isEdit ? "Update" : "Create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
