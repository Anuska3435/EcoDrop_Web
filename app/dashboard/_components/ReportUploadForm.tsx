"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleCreateReport } from "@/lib/actions/dashboard-action";

const categories = [
    "Battery",
    "Mobile",
    "Laptop",
    "Monitor",
    "Appliance",
    "Accessory",
    "Other"
];

export default function ReportUploadForm() {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const onSubmit = (formData: FormData) => {
        setError("");
        setSuccess("");

        startTransition(async () => {
            const result = await handleCreateReport(formData);

            if (!result.success) {
                setError(result.message);
                return;
            }

            setSuccess(result.message);
            formRef.current?.reset();
            router.refresh();
        });
    };

    return (
        <div className="rounded-3xl border border-sage-100 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <p className="text-sm font-medium text-sage-600">New report</p>
                <h2 className="mt-1 text-2xl font-semibold text-gray-900">Upload e-waste image</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Submit a report with a photo so it can be tracked from your dashboard.
                </p>
            </div>

            <form
                ref={formRef}
                action={onSubmit}
                className="grid gap-4"
            >
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

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Broken keyboard"
                            className="h-12 w-full rounded-2xl border border-sage-100 bg-sage-50 px-4 outline-none transition focus:border-sage-300 focus:bg-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            className="h-12 w-full rounded-2xl border border-sage-100 bg-sage-50 px-4 outline-none transition focus:border-sage-300 focus:bg-white"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Describe the e-waste item and its condition."
                        className="w-full rounded-2xl border border-sage-100 bg-sage-50 px-4 py-3 outline-none transition focus:border-sage-300 focus:bg-white"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="image" className="mb-2 block text-sm font-medium text-gray-700">
                        Image
                    </label>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="block w-full rounded-2xl border border-dashed border-sage-200 bg-sage-50 px-4 py-3 text-sm text-gray-600"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-sage-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-sage-800 disabled:opacity-60"
                >
                    {isPending ? "Submitting..." : "Submit report"}
                </button>
            </form>
        </div>
    );
}
