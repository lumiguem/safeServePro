export interface ApiErrorInfo {
    status: number;
    message: string;
    details?: string;
}

export function toApiErrorInfo(error: unknown): ApiErrorInfo {
    if (error instanceof Error) {
        return {
            status: 500,
            message: error.message
        };
    }
    return {
        status: 500,
        message: "Error desconocido"
    };
}
