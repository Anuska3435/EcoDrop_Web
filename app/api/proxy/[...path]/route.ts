import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { isProtectedApiPath, isPublicApiPath } from "@/lib/api/endpoints";

const BACKEND_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

function buildBackendPath(segments: string[]) {
    return `/api/${segments.join("/")}`;
}

async function proxyRequest(request: NextRequest, segments: string[]) {
    const backendPath = buildBackendPath(segments);
    const backendUrl = `${BACKEND_BASE_URL}${backendPath}${request.nextUrl.search}`;

    if (!isPublicApiPath(backendPath) && !isProtectedApiPath(backendPath)) {
        return NextResponse.json(
            {
                success: false,
                message: "API route is not allowed through proxy",
                status: 403,
            },
            { status: 403 }
        );
    }

    const headers = new Headers();
    const contentType = request.headers.get("content-type");
    if (contentType) {
        headers.set("Content-Type", contentType);
    }

    if (isProtectedApiPath(backendPath)) {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                    status: 401,
                },
                { status: 401 }
            );
        }

        headers.set("Authorization", `Bearer ${token}`);
    }

    const init: RequestInit = {
        method: request.method,
        headers,
        cache: "no-store",
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
        const body = await request.arrayBuffer();
        if (body.byteLength > 0) {
            init.body = body;
        }
    }

    const backendResponse = await fetch(backendUrl, init);
    const responseBody = await backendResponse.text();

    return new NextResponse(responseBody, {
        status: backendResponse.status,
        headers: {
            "Content-Type":
                backendResponse.headers.get("content-type") || "application/json",
        },
    });
}

type RouteContext = {
    params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}
