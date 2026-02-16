import { apiFetch } from "./client";
import type { ApiResponse, Plantilla } from "../../types";
import type { ChecklistTemplateDto } from "./types";
import { mapChecklistTemplateToPlantilla } from "./mappers/plantillaMapper";
import { toApiErrorInfo } from "../../utils/apiError";
import { logger } from "../../utils/logger";

interface SavePlantillaRequest {
    id?: string;
    titulo: string;
    categoria: string;
    descripcion: string;
    items: Array<{ tarea: string; esCritico: boolean }>;
}

interface PlantillaDetailResponse {
    id: string;
    titulo: string;
    categoria: string;
    descripcion: string;
    items: Array<{
        tarea: string;
        esCritico: boolean;
    }>;
}

const toSaveRequest = (plantilla: Omit<Plantilla, "id"> | Plantilla, includeId: boolean): SavePlantillaRequest => ({
    ...(includeId && "id" in plantilla ? { id: plantilla.id } : {}),
    titulo: plantilla.titulo,
    categoria: plantilla.categoria,
    descripcion: plantilla.descripcion,
    items: (plantilla.items ?? []).map((item) => ({
        tarea: item.tarea,
        esCritico: item.esCritico,
    })),
});

const mapDetailToPlantilla = (dto: PlantillaDetailResponse): Plantilla => ({
    id: dto.id,
    titulo: dto.titulo,
    categoria: dto.categoria,
    descripcion: dto.descripcion ?? "",
    items: (dto.items ?? []).map((item, index) => ({
        id: `${dto.id}-item-${index}`,
        tarea: item.tarea,
        esCritico: item.esCritico,
    })),
});

export const plantillaService = {
    async listar(): Promise<ApiResponse<Plantilla[]>> {
        try {
            const plantillasFromApi = await apiFetch<ChecklistTemplateDto[]>("/plantillas");

            if (!Array.isArray(plantillasFromApi)) {
                logger.error("La respuesta de la API para listar plantillas no es un array:", plantillasFromApi);
                return {
                    data: null,
                    error: "La respuesta del servidor no tenia el formato esperado.",
                    status: 500,
                    loading: false,
                };
            }

            return {
                data: plantillasFromApi.map(mapChecklistTemplateToPlantilla),
                error: null,
                status: 200,
                loading: false,
            };
        } catch (error) {
            logger.error("Error al listar plantillas:", error);
            const { message } = toApiErrorInfo(error);
            return {
                data: null,
                error: message,
                status: 500,
                loading: false,
            };
        }
    },

    async obtenerPorId(id: string): Promise<ApiResponse<Plantilla>> {
        try {
            const plantilla = await apiFetch<PlantillaDetailResponse>(`/plantillas/${id}`);
            return { data: mapDetailToPlantilla(plantilla), error: null, status: 200, loading: false };
        } catch (error) {
            logger.error(`Error al obtener plantilla ${id}:`, error);
            const { message } = toApiErrorInfo(error);
            return { data: null, error: message, status: 500, loading: false };
        }
    },

    async crear(plantilla: Omit<Plantilla, "id">): Promise<ApiResponse<void>> {
        try {
            await apiFetch<void>("/plantillas", {
                method: "POST",
                body: JSON.stringify(toSaveRequest(plantilla, false)),
            });
            return { data: null, error: null, status: 201, loading: false };
        } catch (error) {
            logger.error("Error al crear plantilla:", error);
            const { message } = toApiErrorInfo(error);
            return { data: null, error: message, status: 500, loading: false };
        }
    },

    async actualizar(id: string, plantilla: Omit<Plantilla, "id">): Promise<ApiResponse<void>> {
        try {
            await apiFetch<void>(`/plantillas/${id}`, {
                method: "PUT",
                body: JSON.stringify(toSaveRequest(plantilla, false)),
            });
            return { data: null, error: null, status: 200, loading: false };
        } catch (error) {
            logger.error(`Error al actualizar plantilla ${id}:`, error);
            const { message } = toApiErrorInfo(error);
            return { data: null, error: message, status: 500, loading: false };
        }
    },

    async eliminar(id: string): Promise<ApiResponse<void>> {
        try {
            await apiFetch<void>(`/plantillas/${id}`, {
                method: "DELETE",
            });
            return { data: null, error: null, status: 204, loading: false };
        } catch (error) {
            logger.error(`Error al eliminar plantilla ${id}:`, error);
            const { message } = toApiErrorInfo(error);
            return { data: null, error: message, status: 500, loading: false };
        }
    },
};
