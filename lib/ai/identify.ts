// Image identification for uploaded e-waste items.
// Primary path calls the server-side /api/ai/identify route (Gemini vision).
// Falls back to an on-device TensorFlow.js MobileNet classifier if that's unavailable.

import { ELECTRONIC_ITEM_CATEGORIES, type UploadCategory } from "@/app/dashboard/_components/ElectronicItem";
import { generateRecommendation } from "@/lib/ai/recommendations";
import * as mobilenet from "@tensorflow-models/mobilenet";
import type { MobileNet } from "@tensorflow-models/mobilenet";

type Prediction = {
    className: string;
    probability: number;
};

let modelPromise: Promise<MobileNet> | null = null;

function getModel() {
    if (!modelPromise) {
        modelPromise = mobilenet.load();
    }
    return modelPromise;
}

export interface AiResult {
    category: UploadCategory | "Other";
    confidence: number; // 0-100
    recommendation: string;
}

export async function identifyImage(file: File): Promise<AiResult> {
    const geminiResult = await identifyWithGemini(file);
    if (geminiResult) return geminiResult;

    return classifyWithTensorFlow(file);
}

async function identifyWithGemini(file: File): Promise<AiResult | null> {
    try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/ai/identify", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) return null;

        const data = await response.json();
        if (!data?.success) return null;

        const category: UploadCategory = ELECTRONIC_ITEM_CATEGORIES.includes(data.category)
            ? data.category
            : "Other";

        return {
            category,
            confidence: typeof data.confidence === "number" ? data.confidence : 50,
            recommendation: data.recommendation || generateRecommendation(category),
        };
    } catch {
        return null;
    }
}

async function classifyWithTensorFlow(file: File): Promise<AiResult> {
    const objectUrl = URL.createObjectURL(file);
    try {
        const img = await loadImage(objectUrl);
        const model = await getModel();
        const predictions = await model.classify(img, 5);
        const mapped = mapPredictionToCategory(predictions, file.name);
        return mapped;
    } catch {
        return {
            category: "Other",
            confidence: 50,
            recommendation: generateRecommendation("Other"),
        };
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (event) => reject(event);
        img.src = src;
    });
}

const categoryMap: Array<[RegExp, UploadCategory]> = [
    [/\b(desktop computer|laptop|notebook|macbook|chromebook|laptop computer|computer|pc)\b/i, "Laptop"],
    [/\b(phone|smartphone|mobile|cellular|iphone|android|cell phone|telephone|cellular telephone|tablet|ipad|nook|fire tablet|tablet computer)\b/i, "Mobile"],
    [/\b(battery|cell|accumulator|rechargeable battery|alkaline battery|power bank)\b/i, "Battery"],
    [/\b(charger|power plug|power adapter|charger plug|power supply|wall plug|usb charger|charging cable|keyboard|keypad|typing device|mouse|trackball|pointer device|printer|fax|scanner|all-in-one|photo printer|printer scanner|speaker|sound system|woofer|subwoofer|audio speaker|headphone|headset|earbud|earphone|audio device|router|modem|network|wifi|gateway|broadband|dsl)\b/i, "Accessory"],
    [/\b(monitor|screen|display|lcd|led|computer monitor)\b/i, "Monitor"],
    [/\b(television|tv|tube|flat screen|smart tv|led tv|lcd tv|appliance|home appliance)\b/i, "Appliance"],
];

function mapPredictionToCategory(predictions: Prediction[], filename: string): AiResult {
    const best = predictions[0];
    const probability = best?.probability ?? 0;
    const label = best?.className?.toLowerCase() ?? "";

    for (const [pattern, category] of categoryMap) {
        if (pattern.test(label)) {
            return {
                category,
                confidence: Math.round(probability * 100),
                recommendation: generateRecommendation(category),
            };
        }
    }

    const filenameLower = filename.toLowerCase();
    for (const [pattern, category] of categoryMap) {
        if (pattern.test(filenameLower)) {
            return {
                category,
                confidence: 85,
                recommendation: generateRecommendation(category),
            };
        }
    }

    const secondary = predictions.slice(0, 4).find((prediction) => {
        return categoryMap.some(([pattern]) => pattern.test(prediction.className.toLowerCase()));
    });

    if (secondary) {
        const matchedCategory = categoryMap.find(([pattern]) => pattern.test(secondary.className.toLowerCase()))![1];
        return {
            category: matchedCategory,
            confidence: Math.round(secondary.probability * 100),
            recommendation: generateRecommendation(matchedCategory),
        };
    }

    return {
        category: "Other",
        confidence: Math.max(40, Math.round(probability * 100)),
        recommendation: generateRecommendation("Other"),
    };
}

export default identifyImage;
