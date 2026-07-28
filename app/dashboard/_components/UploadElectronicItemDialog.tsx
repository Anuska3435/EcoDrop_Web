"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import type { ElectronicItem, UploadCategory } from "@/app/dashboard/_components/ElectronicItem";
import { ELECTRONIC_ITEM_CATEGORIES } from "@/app/dashboard/_components/ElectronicItem";
import identifyImage from "@/lib/ai/identify";
import { handleCreateReport } from "@/lib/actions/dashboard-action";

interface UploadElectronicItemDialogProps {
    file: File;
    onSave: (item: ElectronicItem) => void;
    onCancel: () => void;
}

export default function UploadElectronicItemDialog({ file, onSave, onCancel }: UploadElectronicItemDialogProps) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<string>("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();
    const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);
    const [predictedCategory, setPredictedCategory] = useState<UploadCategory | string>("");
    const [aiConfidence, setAiConfidence] = useState<number | null>(null);
    const [recommendation, setRecommendation] = useState<string>("");
    const [isDetecting, setIsDetecting] = useState(true);
    const savedRef = useRef(false);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await identifyImage(file);
                if (!mounted) return;
                setPredictedCategory(res.category);
                setAiConfidence(res.confidence);
                setRecommendation(res.recommendation);
                // Preselect detected category when available
                if (ELECTRONIC_ITEM_CATEGORIES.includes(res.category as UploadCategory)) {
                    setCategory(res.category as UploadCategory);
                }
            } catch {
                // ignore AI errors — user can select manually
            } finally {
                if (mounted) setIsDetecting(false);
            }
        })();

        return () => {
            mounted = false;
            if (!savedRef.current) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [file, previewUrl]);

    const handleSave = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!category) {
            setError("Please select a category.");
            return;
        }

        if (!title.trim()) {
            setError("Please enter an item title.");
            return;
        }

        startTransition(async () => {
            try {
                const payload = new FormData();
                payload.append("title", title.trim());
                payload.append("category", category);
                payload.append("description", description.trim() || "Item uploaded via EcoDrop AI identifier.");
                payload.append("image", file);

                const result = await handleCreateReport(payload);

                if (!result.success) {
                    setError(result.message);
                    return;
                }

                const created = result.report;
                if (!created) {
                    setError("Could not save the uploaded item.");
                    return;
                }

                const item: ElectronicItem = {
                    id: created._id,
                    imageUrl: created.imageUrl,
                    category: created.category as UploadCategory,
                    description: created.description,
                    uploadedAt: created.createdAt,
                    aiConfidence: aiConfidence ?? undefined,
                    recommendation: recommendation || undefined,
                };

                savedRef.current = true;
                onSave(item);
                router.refresh();
            } catch (saveError: unknown) {
                const err = saveError as { message?: string };
                setError(err.message || "Unable to save your item. Please try again.");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
            <div className="relative mx-auto my-12 max-w-2xl rounded-[22px] bg-white p-6 shadow-2xl sm:p-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[#eff2ed] text-[#526052]"
                    aria-label="Close upload dialog"
                >
                    <FiX />
                </button>
                <div className="mb-6">
                    <p className="text-sm font-medium text-sage-600">Upload Electronic Item</p>
                    <h2 className="mt-1 text-2xl font-semibold text-[#263129]">Review image and add details</h2>
                </div>

                {previewUrl ? (
                    <div className="relative overflow-hidden rounded-[20px] border border-[#e2ebd8] bg-[#f4f8ef] h-64">
                        <Image src={previewUrl} alt="Selected item preview" fill className="object-cover" unoptimized />
                    </div>
                ) : null}

                <form onSubmit={handleSave} className="mt-6 grid gap-4">
                    {error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    ) : null}

                    <div>
                        <label htmlFor="itemTitle" className="mb-2 block text-sm font-medium text-gray-700">
                            Item title
                        </label>
                        <input
                            id="itemTitle"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder={predictedCategory ? `e.g. ${predictedCategory} repair item` : "e.g. Old laptop"}
                            className="h-12 w-full rounded-2xl border border-sage-100 bg-sage-50 px-4 outline-none transition focus:border-sage-300 focus:bg-white"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="itemCategory" className="mb-2 block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            id="itemCategory"
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            className="h-12 w-full rounded-2xl border border-sage-100 bg-sage-50 px-4 outline-none transition focus:border-sage-300 focus:bg-white"
                            required
                        >
                            <option value="" disabled>
                                {predictedCategory ? `Detected: ${predictedCategory}` : "Select a category"}
                            </option>
                            {ELECTRONIC_ITEM_CATEGORIES.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {isDetecting ? (
                            <p className="mt-2 text-xs text-[#586158]">Detecting item…</p>
                        ) : aiConfidence !== null ? (
                            <p className="mt-2 text-xs text-[#586158]">Detected: <strong className="text-[#2b5022]">{predictedCategory}</strong> — Confidence: <strong>{aiConfidence}%</strong></p>
                        ) : null}
                    </div>

                    <div>
                        <label htmlFor="itemDescription" className="mb-2 block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="itemDescription"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            rows={4}
                            placeholder="Describe the item and its condition (optional)."
                            className="w-full rounded-2xl border border-sage-100 bg-sage-50 px-4 py-3 outline-none transition focus:border-sage-300 focus:bg-white"
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-sage-200 bg-white px-6 text-sm font-semibold text-[#4e633a] transition hover:bg-sage-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex h-12 items-center justify-center rounded-2xl bg-sage-700 px-6 text-sm font-semibold text-white transition hover:bg-sage-800 disabled:opacity-60"
                        >
                            {isPending ? "Saving..." : "Save Item"}
                        </button>
                    </div>
                </form>
                {recommendation ? (
                    <div className="mt-4 rounded-[10px] border border-[#e7f0df] bg-[#f7fbf6] p-4 text-sm text-[#3e5e34]">
                        <p className="font-semibold">AI Recommendation</p>
                        <p className="mt-2 text-sm leading-6">{recommendation}</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
