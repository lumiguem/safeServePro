const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL =
    (typeof configuredApiBaseUrl === "string" && configuredApiBaseUrl.trim().length > 0
        ? configuredApiBaseUrl.trim()
        : "https://safeserve-backend-qj5appgu6q-uc.a.run.app/api");
