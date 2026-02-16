import { API_BASE_URL } from "../../config/api";
import { logger } from "../../utils/logger";

interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

async function tryRefreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    const res = await fetch(`${API_BASE_URL}/public/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const json = (await res.json()) as { data?: RefreshResponse };
    const accessToken = json.data?.accessToken ?? null;
    const nextRefreshToken = json.data?.refreshToken ?? null;

    if (!accessToken || !nextRefreshToken) return null;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", nextRefreshToken);
    return accessToken;
}

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    let token = localStorage.getItem("accessToken");
    const isPublicEndpoint = endpoint.startsWith("/public");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> ?? {}),
    };

    if (!isPublicEndpoint && token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!isPublicEndpoint && (res.status === 401 || res.status === 403)) {
        token = await tryRefreshToken();
        if (token) {
            const retryHeaders: Record<string, string> = {
                "Content-Type": "application/json",
                ...(options.headers as Record<string, string> ?? {}),
                Authorization: `Bearer ${token}`,
            };

            res = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: retryHeaders,
            });
        }
    }

    if (!res.ok) {
        const errorText = await res.text();
        logger.error("API Error:", res.status, errorText);
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
        throw new Error(`API error: ${res.status}`);
    }

    if (res.status === 204) {
        return null as T;
    }

    const json = await res.json();
    return json.data;
}
