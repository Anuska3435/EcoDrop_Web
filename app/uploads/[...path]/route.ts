import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type RouteContext = {
    params: Promise<{ path: string[] }>;
};

function getContentType(filePath: string) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".png":
            return "image/png";
        case ".webp":
            return "image/webp";
        case ".gif":
            return "image/gif";
        default:
            return "application/octet-stream";
    }
}

export async function GET(request: NextRequest, context: RouteContext) {
    const { path: segments } = await context.params;
    // Local dev fallback: serve directly from the backend uploads folder on disk.
    // This avoids relying on the backend server being up (prevents ECONNREFUSED).
    const uploadsRoot = path.resolve(process.cwd(), "..", "Web Backend", "uploads");
    const requestedPath = path.join(uploadsRoot, ...segments);
    const resolvedPath = path.resolve(requestedPath);

    // Basic path traversal protection
    if (!resolvedPath.startsWith(uploadsRoot)) {
        return NextResponse.json({ message: "Invalid path" }, { status: 400 });
    }

    try {
        const file = await fs.readFile(resolvedPath);
        return new NextResponse(file, {
            status: 200,
            headers: {
                "Content-Type": getContentType(resolvedPath),
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch {
        return NextResponse.json({ message: "File not found" }, { status: 404 });
    }
}
