import type { ApiResponse, RestaurantLocation } from "../../types";
import { apiFetch } from "./client";
import type { EstablecimientoDto } from "./types";
import { mapEstablecimientoToLocation } from "./mappers/locationMapper";
import { toApiErrorInfo } from "../../utils/apiError";

interface SaveEstablecimientoRequest {
    nombre: string;
    direccion: string;
    riesgoActual: number;
}

const toRequest = (location: Omit<RestaurantLocation, "id">): SaveEstablecimientoRequest => ({
    nombre: location.name,
    direccion: location.address,
    riesgoActual: location.currentRiskScore,
});

export const locationService = {
    async getLocations(): Promise<ApiResponse<RestaurantLocation[]>> {
        let locationsFromApi: EstablecimientoDto[];
        try {
            locationsFromApi = await apiFetch<EstablecimientoDto[]>("/establecimientos");
        } catch (error) {
            const { message } = toApiErrorInfo(error);
            return {
                data: null,
                error: message,
                status: 500,
                loading: false,
            };
        }

        if (!Array.isArray(locationsFromApi)) {
            return {
                data: null,
                error: "La respuesta del servidor no es un array como se esperaba.",
                status: 500,
                loading: false,
            };
        }

        return {
            data: locationsFromApi.map(mapEstablecimientoToLocation),
            error: null,
            status: 200,
            loading: false,
        };
    },

    async createLocation(location: Omit<RestaurantLocation, "id">): Promise<ApiResponse<RestaurantLocation>> {
        try {
            const created = await apiFetch<EstablecimientoDto>("/establecimientos", {
                method: "POST",
                body: JSON.stringify(toRequest(location)),
            });

            return {
                data: mapEstablecimientoToLocation(created),
                error: null,
                status: 201,
                loading: false,
            };
        } catch (error) {
            const { message } = toApiErrorInfo(error);
            return {
                data: null,
                error: message,
                status: 500,
                loading: false,
            };
        }
    },

    async updateLocation(id: string, location: Omit<RestaurantLocation, "id">): Promise<ApiResponse<RestaurantLocation>> {
        try {
            const updated = await apiFetch<EstablecimientoDto>(`/establecimientos/${id}`, {
                method: "PUT",
                body: JSON.stringify(toRequest(location)),
            });

            return {
                data: mapEstablecimientoToLocation(updated),
                error: null,
                status: 200,
                loading: false,
            };
        } catch (error) {
            const { message } = toApiErrorInfo(error);
            return {
                data: null,
                error: message,
                status: 500,
                loading: false,
            };
        }
    },

    async deleteLocation(id: string): Promise<ApiResponse<void>> {
        try {
            await apiFetch<void>(`/establecimientos/${id}`, {
                method: "DELETE",
            });

            return {
                data: null,
                error: null,
                status: 200,
                loading: false,
            };
        } catch (error) {
            const { message } = toApiErrorInfo(error);
            return {
                data: null,
                error: message,
                status: 500,
                loading: false,
            };
        }
    },
};
