"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GENDER_OPTIONS } from "@/app/(auth)/_components/schema";
import { handleUpdateProfile } from "@/lib/actions/profile-action";
import { useAuth } from "@/context/AuthProvider";
import type { DashboardUser } from "@/lib/api/protected";

interface ProfileUpdateFormProps {
    user: DashboardUser;
}

function toLocalUploadsSrc(src: string | null) {
    if (!src) return null;
    // Keep blob previews as-is.
    if (src.startsWith("blob:")) return src;

    const normalized = src.replace(/\\/g, "/");
    const idx = normalized.toLowerCase().lastIndexOf("/uploads/");
    if (idx !== -1) {
        return normalized.slice(idx); // "/uploads/..."
    }
    return src;
}

export default function ProfileUpdateForm({ user }: ProfileUpdateFormProps) {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const { setUser } = useAuth();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const displayedPreviewUrl = previewUrl ?? toLocalUploadsSrc(user.profileImageUrl ?? null);

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (previewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(URL.createObjectURL(file));
    };

    const onSubmit = (formData: FormData) => {
        setError("");
        setSuccess("");

        startTransition(async () => {
            const result = await handleUpdateProfile(formData);

            if (!result.success) {
                setError(result.message);
                return;
            }

            if (result.data) {
                setUser(result.data);
            }

            setSuccess(result.message);
            router.refresh();
        });
    };

    return (
        <div className="rounded-3xl border border-sage-100 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <p className="text-sm font-medium text-sage-600">Account settings</p>
                <h1 className="mt-1 text-2xl font-semibold text-gray-900">Update profile</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Edit your personal details and upload a profile photo.
                </p>
            </div>

            <form ref={formRef} action={onSubmit} className="grid gap-5">
                {error ? (
                    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                ) : null}

                {success ? (
                    <div role="status" aria-live="polite" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {success}
                    </div>
                ) : null}

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border border-sage-100 bg-sage-50">
                        {displayedPreviewUrl ? (
                            <Image
                                src={displayedPreviewUrl}
                                alt="Profile preview"
                                fill
                                sizes="96px"
                                priority={!displayedPreviewUrl.startsWith("blob:")}
                                loading={displayedPreviewUrl.startsWith("blob:") ? "lazy" : "eager"}
                                className="object-cover"
                                unoptimized={displayedPreviewUrl.startsWith("blob:")}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-sage-700">
                                {user.firstName?.charAt(0) || user.username?.charAt(0) || "U"}
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="profileImage" className="mb-2 block text-sm font-medium text-gray-700">
                            Profile photo
                        </label>
                        <input
                            id="profileImage"
                            name="profileImage"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={onImageChange}
                            className="block w-full rounded-2xl border border-dashed border-sage-200 bg-sage-50 px-4 py-3 text-sm text-gray-600"
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-gray-700">
                            First name
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            defaultValue={user.firstName}
                            className="h-12 w-full rounded-2xl border border-sage-100 bg-sage-50 px-4 outline-none transition focus:border-sage-300 focus:bg-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-gray-700">
                            Last name
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            defaultValue={user.lastName}
                            className="h-12 w-full rounded-2xl border border-sage-100 bg-sage-50 px-4 outline-none transition focus:border-sage-300 focus:bg-white"
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            defaultValue={user.username}
                            className="h-12 w-full rounded-2xl border border-sage-100 bg-sage-50 px-4 outline-none transition focus:border-sage-300 focus:bg-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="gender" className="mb-2 block text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            defaultValue={user.gender}
                            className="h-12 w-full rounded-2xl border border-sage-100 bg-sage-50 px-4 outline-none transition focus:border-sage-300 focus:bg-white"
                            required
                        >
                            {GENDER_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="h-12 w-full rounded-2xl border border-sage-100 bg-sage-100 px-4 text-gray-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-sage-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-sage-800 disabled:opacity-60"
                >
                    {isPending ? "Saving..." : "Save profile"}
                </button>
            </form>
        </div>
    );
}
