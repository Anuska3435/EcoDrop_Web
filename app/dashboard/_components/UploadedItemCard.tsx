"use client";

import Image from "next/image";
import type { ElectronicItem } from "@/app/dashboard/_components/ElectronicItem";

interface UploadedItemCardProps {
    item: ElectronicItem;
    onDelete: (id: string) => void;
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export default function UploadedItemCard({ item, onDelete }: UploadedItemCardProps) {
    return (
        <article className="overflow-hidden rounded-[20px] border border-[#e2eadc] bg-white shadow-[0_10px_25px_rgba(67,86,59,0.08)]">
            <div className="relative h-48 overflow-hidden bg-[#f4f8ef]">
                <Image src={item.imageUrl} alt={item.category} fill className="object-cover" />
            </div>
            <div className="space-y-3 p-4">
                <div>
                    <p className="text-sm font-semibold text-[#244f1e]">Category</p>
                    <p className="mt-1 text-base font-medium text-[#2b5022]">{item.category}</p>
                </div>
                {item.aiConfidence ? (
                    <div>
                        <p className="text-sm font-semibold text-[#244f1e]">AI Confidence</p>
                        <p className="mt-1 text-base font-medium text-[#2b5022]">{Math.round(item.aiConfidence)}%</p>
                    </div>
                ) : null}
                <div>
                    <p className="text-sm font-semibold text-[#244f1e]">Description</p>
                    <p className="mt-1 text-sm leading-6 text-[#5b655d]">{item.description || "No description provided."}</p>
                </div>
                {item.recommendation ? (
                    <div>
                        <p className="text-sm font-semibold text-[#244f1e]">Recommendation</p>
                        <p className="mt-1 text-sm leading-6 text-[#5b655d]">{item.recommendation}</p>
                    </div>
                ) : null}
                <div className="flex items-center justify-between gap-4 text-[12px] text-[#5e6a5f]">
                    <span>Uploaded: {formatDate(item.uploadedAt)}</span>
                    <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="rounded-full bg-[#f5e8e8] px-3 py-2 text-xs font-semibold text-[#8f2a2a] transition hover:bg-[#fbd9d9]"
                    >
                        🗑 Delete
                    </button>
                </div>
            </div>
        </article>
    );
}
