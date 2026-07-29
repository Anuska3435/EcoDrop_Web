"use client";

import { useRef, useState, useTransition } from "react";
import { handleUpdatePassword } from "@/lib/actions/profile-action";

export default function PasswordUpdateForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);

    const onSubmit = (formData: FormData) => {
        setError("");
        setSuccess("");

        startTransition(async () => {
            const result = await handleUpdatePassword(formData);

            if (!result.success) {
                setError(result.message);
                return;
            }

            setSuccess(result.message);
            formRef.current?.reset();
        });
    };

    const inputClass =
        "h-12 w-full rounded-2xl border border-sage-100 bg-sage-50 px-4 outline-none transition focus:border-sage-300 focus:bg-white";

    return (
        <div className="rounded-3xl border border-sage-100 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <p className="text-sm font-medium text-sage-600">Security</p>
                <h1 className="mt-1 text-2xl font-semibold text-gray-900">Change password</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Update your password using your current credentials.
                </p>
            </div>

            <form ref={formRef} action={onSubmit} className="grid gap-4">
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

                <div>
                    <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium text-gray-700">
                        Current password
                    </label>
                    <input
                        id="currentPassword"
                        name="currentPassword"
                        type={showPasswords ? "text" : "password"}
                        autoComplete="current-password"
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-gray-700">
                        New password
                    </label>
                    <input
                        id="newPassword"
                        name="newPassword"
                        type={showPasswords ? "text" : "password"}
                        autoComplete="new-password"
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
                        Confirm new password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPasswords ? "text" : "password"}
                        autoComplete="new-password"
                        className={inputClass}
                        required
                    />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={showPasswords}
                        onChange={(event) => setShowPasswords(event.target.checked)}
                    />
                    Show passwords
                </label>

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-sage-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-sage-800 disabled:opacity-60"
                >
                    {isPending ? "Updating..." : "Update password"}
                </button>
            </form>
        </div>
    );
}
