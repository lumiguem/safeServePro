import type { LoginRequestDto, LoginResponseDto } from "../../types";
import { apiFetch } from "./client";
import { toApiErrorInfo } from "../../utils/apiError";

export const authService = {
    login: async (credentials: LoginRequestDto): Promise<LoginResponseDto> => {
        let data: LoginResponseDto;
        try {
            data = await apiFetch<LoginResponseDto>(
                "/public/auth/login",
                {
                    method: "POST",
                    body: JSON.stringify(credentials),
                }
            );
        } catch (error) {
            const { message } = toApiErrorInfo(error);
            throw new Error(message);
        }

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        return data;
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    },

    isAuthenticated: (): boolean => {
        const token = localStorage.getItem("accessToken");
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }
};
