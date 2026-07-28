import { NextRequest, NextResponse } from "next/server";
import { ELECTRONIC_ITEM_CATEGORIES } from "@/app/dashboard/_components/ElectronicItem";
import { generateRecommendation } from "@/lib/ai/recommendations";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

export async function POST(request: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { success: false, message: "GEMINI_API_KEY is not configured on the server" },
            { status: 500 }
        );
    }

    const formData = await request.formData();
    const file = formData.get("image");
    if (!(file instanceof File)) {
        return NextResponse.json({ success: false, message: "No image provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    const prompt = `You are classifying a photo of an electronic item for an e-waste recycling app. Reply with ONLY a JSON object (no markdown, no code fences) in the form {"category": one of ${JSON.stringify(
        ELECTRONIC_ITEM_CATEGORIES
    )}, "confidence": integer 0-100}. Pick "Other" if the item does not clearly match one of the categories.`;

    try {
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt },
                                { inline_data: { mime_type: mimeType, data: base64Data } },
                            ],
                        },
                    ],
                    generationConfig: { responseMimeType: "application/json" },
                }),
            }
        );

        if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text();
            return NextResponse.json(
                { success: false, message: `Gemini request failed: ${errorText}` },
                { status: 502 }
            );
        }

        const geminiData = await geminiResponse.json();
        const text: string | undefined = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsed = text ? JSON.parse(text) : {};

        const category = ELECTRONIC_ITEM_CATEGORIES.includes(parsed.category) ? parsed.category : "Other";
        const confidence = Number.isFinite(parsed.confidence)
            ? Math.max(0, Math.min(100, Math.round(parsed.confidence)))
            : 50;

        return NextResponse.json({
            success: true,
            category,
            confidence,
            recommendation: generateRecommendation(category),
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to classify image with Gemini" },
            { status: 500 }
        );
    }
}
