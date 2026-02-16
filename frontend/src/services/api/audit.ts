import { apiFetch } from "./client";
import type { AuditoriaListItem, Violation } from "../../types";
import type { EvidenciaDto } from "./types";
import { toApiErrorInfo } from "../../utils/apiError";
import { logger } from "../../utils/logger";

interface CreateAuditoriaRequest {
    establecimientoId: string;
    plantillaId: string;
}

interface UpdatePuntuacionCumplimientoRequest {
    progreso: number;
    puntuacionCumplimiento: number;
}

interface CreateHallazgoRequest {
    auditoriaId: string;
    evidenciaId: number | null;
    categoria: string;
    descripcion: string;
    prioridad: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    accionCorrectiva: string;
    estaResuelto: boolean;
}

interface CreateEvidenciaRequest {
    auditoriaId: string;
    urlArchivo: string;
    tipoArchivo: string;
}

interface EvidenciaResponse {
    id: number;
}

type EvidenciaDetailResponse = EvidenciaDto;

export const auditService = {
    async createAudit(
        establecimientoId: string,
        plantillaId: string
    ): Promise<AuditoriaListItem> {
        try {
            return await apiFetch<AuditoriaListItem>(
                "/auditorias",
                {
                    method: "POST",
                    body: JSON.stringify({
                        establecimientoId,
                        plantillaId,
                    } as CreateAuditoriaRequest),
                },
            );
        } catch (error) {
            const { message } = toApiErrorInfo(error);
            throw new Error(message);
        }
    },

    async deleteAudit(auditoriaId: string): Promise<void> {
        try {
            await apiFetch<void>(`/auditorias/${auditoriaId}`, {
                method: "DELETE",
            });
        } catch (error) {
            const { message } = toApiErrorInfo(error);
            throw new Error(message);
        }
    },

    async createEvidence(
        auditoriaId: string,
        urlArchivo: string,
        tipoArchivo: string
    ): Promise<EvidenciaDetailResponse> {
        try {
            const evidencia = await apiFetch<EvidenciaResponse>(
                "/evidencias",
                {
                    method: "POST",
                    body: JSON.stringify({
                        auditoriaId,
                        urlArchivo,
                        tipoArchivo,
                    } as CreateEvidenciaRequest),
                },
            );

            return await apiFetch<EvidenciaDetailResponse>(`/evidencias/${evidencia.id}`);
        } catch (error) {
            const { message } = toApiErrorInfo(error);
            throw new Error(message);
        }
    },

    async deleteEvidence(evidenciaId: number): Promise<void> {
        try {
            await apiFetch<void>(`/evidencias/${evidenciaId}`, {
                method: "DELETE",
            });
        } catch (error) {
            const { message } = toApiErrorInfo(error);
            throw new Error(message);
        }
    },

    async submitAudit(
        establecimientoId: string,
        plantillaId: string,
        violations: Violation[],
        progreso: number,
        puntaje: number,
        auditoriaId?: string
    ): Promise<{ auditoriaId: string; hallazgosFallidos: number }> {
        let createdAudit: AuditoriaListItem;
        try {
            createdAudit = auditoriaId
                ? { id: auditoriaId } as AuditoriaListItem
                : await apiFetch<AuditoriaListItem>(
                    "/auditorias",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            establecimientoId,
                            plantillaId,
                        } as CreateAuditoriaRequest),
                    },
                );
        } catch (error) {
            const { message } = toApiErrorInfo(error);
            throw new Error(message);
        }

        try {
            await apiFetch<void>(`/auditorias/${createdAudit.id}/puntuacion-cumplimiento`, {
                method: "PUT",
                body: JSON.stringify({
                    progreso,
                    puntuacionCumplimiento: puntaje,
                } as UpdatePuntuacionCumplimientoRequest),
            });
        } catch (error) {
            const { message } = toApiErrorInfo(error);
            throw new Error(message);
        }

        let hallazgosFallidos = 0;
        if (violations.length > 0) {
            let evidenciaId: number | null = null;
            try {
                const evidencia = await apiFetch<EvidenciaResponse>(
                    "/evidencias",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            auditoriaId: createdAudit.id,
                            urlArchivo: "checklist://manual",
                            tipoArchivo: "CHECKLIST",
                        } as CreateEvidenciaRequest),
                    },
                );
                evidenciaId = evidencia.id;
            } catch (error) {
                logger.error("No se pudo crear evidencia para hallazgos", error);
                const { message } = toApiErrorInfo(error);
                logger.error("Detalle:", message);
                hallazgosFallidos = violations.length;
            }

            if (evidenciaId === null) {
                return { auditoriaId: createdAudit.id, hallazgosFallidos };
            }

            const results = await Promise.allSettled(
                violations.map((violation) =>
                    apiFetch<unknown>("/hallazgos", {
                        method: "POST",
                        body: JSON.stringify({
                            auditoriaId: createdAudit.id,
                            evidenciaId,
                            categoria: violation.category,
                            descripcion: violation.description,
                            prioridad: violation.priority,
                            accionCorrectiva: violation.correctiveAction,
                            estaResuelto: violation.isResolved,
                        } as CreateHallazgoRequest),
                    }),
                ),
            );
            hallazgosFallidos = results.filter((r) => r.status === "rejected").length;
        }

        return { auditoriaId: createdAudit.id, hallazgosFallidos };
    },

    async getAudits(): Promise<AuditoriaListItem[]> {
        return apiFetch<AuditoriaListItem[]>(
            "/auditorias"
        );
    }

};
