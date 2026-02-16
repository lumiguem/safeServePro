import { useState, useRef, useMemo, useEffect } from "react";

import {
    calculateProgress,
    calculateComplianceScore,
    calculateKPIs
} from "../../utils/calculation";

import {
    ViolationPriority,
    type Violation,
    type CompletedAudit,
    type RestaurantLocation,
    type Plantilla
} from "../../types";
import type { ChecklistItem, EvidenceItem } from "./types";

import { locationService } from "../../services/locationService";
import { plantillaService } from "../../services/plantillaService";
import { auditService } from "../../services/auditService";
import { uploadImageToCloudinary } from "../../services/storage/cloudinary";
import { logger } from "../../utils/logger";

export function useInspectionFlow(onSaveAudit: (audit: CompletedAudit) => void) {
    const [step, setStep] = useState<"location-select" | "template-select" | "form">("location-select");

    const [locations, setLocations] = useState<RestaurantLocation[]>([]);
    const [templates, setTemplates] = useState<Plantilla[]>([]);

    const [loadingLocations, setLoadingLocations] = useState(false);
    const [loadingTemplates, setLoadingTemplates] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCreatingAudit, setIsCreatingAudit] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [deletingEvidenceIds, setDeletingEvidenceIds] = useState<Set<string>>(new Set());
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [templatesError, setTemplatesError] = useState<string | null>(null);
    const [locationsError, setLocationsError] = useState<string | null>(null);

    const [selectedLocation, setSelectedLocation] = useState<RestaurantLocation | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<Plantilla | null>(null);
    const [currentAuditId, setCurrentAuditId] = useState<string | null>(null);

    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [violations, setViolations] = useState<Violation[]>([]);
    const [evidences, setEvidences] = useState<EvidenceItem[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentAuditIdRef = useRef<string | null>(null);
    const shouldCleanupAuditOnUnmountRef = useRef(false);

    useEffect(() => {
        currentAuditIdRef.current = currentAuditId;
    }, [currentAuditId]);

    useEffect(() => {
        return () => {
            const auditId = currentAuditIdRef.current;
            if (!shouldCleanupAuditOnUnmountRef.current || !auditId) return;

            // Si el usuario sale del flujo sin completar, eliminamos la auditoria temporal.
            void auditService.deleteAudit(auditId).catch((error) => {
                logger.error("Error limpiando auditoria al salir del flujo", error);
            });
        };
    }, []);

    useEffect(() => {
        if (step === "location-select") {
            setLoadingLocations(true);
            locationService.getLocations().then(res => {
                if (res.data) {
                    setLocations(res.data);
                    setLocationsError(null);
                } else if (res.error) {
                    setLocationsError(res.error);
                }
                setLoadingLocations(false);
            });
        }
    }, [step]);

    useEffect(() => {
        if (step === "template-select") {
            setLoadingTemplates(true);
            plantillaService.listar().then(res => {
                if (res.data) {
                    setTemplates(res.data);
                    setTemplatesError(null);
                } else if (res.error) {
                    setTemplatesError(res.error);
                }
                setLoadingTemplates(false);
            });
        }
    }, [step]);

    const startLocationChoice = (loc: RestaurantLocation) => {
        setSubmitMessage(null);
        setSubmitError(null);
        setSelectedLocation(loc);
        setStep("template-select");
    };

    const startTemplateChoice = async (template: Plantilla) => {
        if (!selectedLocation) return;

        setSubmitMessage(null);
        setSubmitError(null);
        setIsCreatingAudit(true);

        try {
            const createdAudit = await auditService.createAudit(
                selectedLocation.id,
                template.id
            );

            shouldCleanupAuditOnUnmountRef.current = true;
            // Guardamos el id tambien en ref para cubrir cambios de pantalla antes del siguiente render.
            currentAuditIdRef.current = createdAudit.id;
            setCurrentAuditId(createdAudit.id);
            setSelectedTemplate(template);
            setChecklist(
                template.items.map(item => ({
                    id: item.id,
                    task: item.tarea,
                    esCritico: item.esCritico,
                    status: "pending"
                }))
            );
            setStep("form");
        } catch (error) {
            logger.error("Error creando auditoria", error);
            setSubmitError("No se pudo iniciar la auditoria. Intente nuevamente.");
        } finally {
            setIsCreatingAudit(false);
        }
    };

    const updateChecklistItem = (id: string, status: "pass" | "fail") => {
        const checklistItem = checklist.find((item) => item.id === id);
        if (!checklistItem) return;

        setChecklist((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status } : item))
        );

        const violationId = `CHK-${id}`;

        if (status === "fail") {
            const violation: Violation = {
                id: violationId,
                category: selectedTemplate?.categoria ?? "General",
                description: `Incumplimiento: ${checklistItem.task}`,
                priority: checklistItem.esCritico
                    ? ViolationPriority.CRITICAL
                    : ViolationPriority.MEDIUM,
                correctiveAction: "Corregir inmediatamente.",
                isResolved: false,
                source: "MANUAL"
            };

            setViolations((prev) =>
                prev.some((v) => v.id === violationId) ? prev : [...prev, violation]
            );
            return;
        }

        setViolations((prev) => prev.filter((v) => v.id !== violationId));
    };

    const progress = useMemo(() => calculateProgress(checklist), [checklist]);
    const complianceScore = useMemo(() => calculateComplianceScore(checklist), [checklist]);
    const kpis = useMemo(
        () => calculateKPIs(violations, complianceScore, evidences.length),
        [violations, complianceScore, evidences]
    );

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!currentAuditId) {
            setSubmitError("Debe iniciar una auditoria antes de subir evidencias.");
            return;
        }

        const localPreviewUrl = URL.createObjectURL(file);
        const evidenceId = crypto.randomUUID();
        const evidence: EvidenceItem = {
            id: evidenceId,
            url: localPreviewUrl,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };

        setEvidences(prev => [evidence, ...prev]);
        setIsAnalyzing(true);
        setSubmitError(null);

        try {
            const upload = await uploadImageToCloudinary(file);
            const cloudUrl = upload.secure_url;

            setEvidences(prev =>
                prev.map((ev) => (ev.id === evidenceId ? { ...ev, url: cloudUrl } : ev))
            );

            const evidencia = await auditService.createEvidence(
                currentAuditId,
                cloudUrl,
                file.type || "image/jpeg"
            );

            setEvidences(prev =>
                prev.map((ev) => (ev.id === evidenceId ? { ...ev, backendId: evidencia.id } : ev))
            );

            const aiViolations: Violation[] = (evidencia.hallazgos ?? []).map((h) => ({
                id: crypto.randomUUID(),
                category: h.categoria ?? "IA",
                description: h.descripcion,
                priority: h.prioridad,
                correctiveAction: h.accionCorrectiva ?? "Aplicar correccion segun protocolo.",
                isResolved: h.estaResuelto,
                imageUrl: cloudUrl,
                source: "AI"
            }));

            if (aiViolations.length > 0) {
                setViolations((prev) => [...prev, ...aiViolations]);
            }
        } catch (error) {
            logger.error("Error procesando evidencia IA", error);
            setSubmitError("No se pudo procesar la evidencia con IA. Intente nuevamente.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const deleteEvidence = async (evidenceId: string) => {
        const evidence = evidences.find((ev) => ev.id === evidenceId);
        if (!evidence) return;

        setDeletingEvidenceIds((prev) => new Set(prev).add(evidenceId));
        if (evidence.backendId) {
            try {
                await auditService.deleteEvidence(evidence.backendId);
            } catch (error) {
                logger.error("Error eliminando evidencia", error);
                setSubmitError("No se pudo eliminar la evidencia. Intente nuevamente.");
                setDeletingEvidenceIds((prev) => {
                    const next = new Set(prev);
                    next.delete(evidenceId);
                    return next;
                });
                return;
            }
        }

        setEvidences((prev) => prev.filter((ev) => ev.id !== evidenceId));

        if (evidence.url) {
            setViolations((prev) => prev.filter((v) => v.imageUrl !== evidence.url));
        }

        setDeletingEvidenceIds((prev) => {
            const next = new Set(prev);
            next.delete(evidenceId);
            return next;
        });
    };

    const deleteViolation = (violationId: string) => {
        setViolations((prev) => prev.filter((v) => v.id !== violationId));
    };

    const completeAudit = async () => {
        if (!selectedLocation || !selectedTemplate) return;

        setIsSubmitting(true);
        setSubmitMessage(null);
        setSubmitError(null);

        try {
            const manualViolations = violations.filter((v) => v.source !== "AI");
            const { auditoriaId, hallazgosFallidos } = await auditService.submitAudit(
                selectedLocation.id,
                selectedTemplate.id,
                manualViolations,
                progress,
                complianceScore,
                currentAuditId ?? undefined
            );

            const audit: CompletedAudit = {
                id: auditoriaId,
                locationId: selectedLocation.id,
                locationName: selectedLocation.name,
                templateLabel: selectedTemplate.titulo,
                date: new Date().toISOString(),
                violationsCount: violations.length,
                evidencesCount: evidences.length,
                progress: complianceScore,
                violations,
                kpis,
                serverSynced: true
            };

            onSaveAudit(audit);
            // Ya se confirmo el guardado final; no debe borrarse al desmontar el componente.
            shouldCleanupAuditOnUnmountRef.current = false;
            setStep("location-select");
            setChecklist([]);
            setViolations([]);
            setEvidences([]);
            setSelectedLocation(null);
            setSelectedTemplate(null);
            currentAuditIdRef.current = null;
            setCurrentAuditId(null);
            setSubmitMessage(
                hallazgosFallidos > 0
                    ? `Auditoria guardada. ${hallazgosFallidos} hallazgo(s) no se pudieron registrar.`
                    : "Auditoria guardada correctamente y hallazgos registrados."
            );
        } catch (error) {
            logger.error("Error guardando auditoria/hallazgos", error);
            setSubmitError("No se pudo guardar la auditoria. Verifique conexion e intente nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const cancelAudit = async () => {
        setSubmitMessage(null);
        setSubmitError(null);
        // Se hara borrado explicito debajo; evitamos doble delete en el unmount cleanup.
        shouldCleanupAuditOnUnmountRef.current = false;

        if (currentAuditId) {
            try {
                await auditService.deleteAudit(currentAuditId);
            } catch (error) {
                logger.error("Error cancelando auditoria", error);
            }
        }

        setStep("location-select");
        setChecklist([]);
        setViolations([]);
        setEvidences([]);
        setSelectedLocation(null);
        setSelectedTemplate(null);
        currentAuditIdRef.current = null;
        setCurrentAuditId(null);
    };

    const backToTemplateSelect = async () => {
        setSubmitMessage(null);
        setSubmitError(null);
        // Se hara borrado explicito debajo; evitamos doble delete en el unmount cleanup.
        shouldCleanupAuditOnUnmountRef.current = false;

        if (currentAuditId) {
            try {
                await auditService.deleteAudit(currentAuditId);
            } catch (error) {
                logger.error("Error regresando a seleccion de plantilla", error);
            }
        }

        setChecklist([]);
        setViolations([]);
        setEvidences([]);
        setSelectedTemplate(null);
        currentAuditIdRef.current = null;
        setCurrentAuditId(null);
        setStep(selectedLocation ? "template-select" : "location-select");
    };

    const backToLocationSelect = () => {
        setStep("location-select");
    };

    return {
        step,
        locations,
        templates,
        loadingLocations,
        loadingTemplates,
        isSubmitting,
        isCreatingAudit,
        isAnalyzing,
        deletingEvidenceIds,
        submitMessage,
        submitError,
        templatesError,
        locationsError,
        selectedLocation,
        selectedTemplate,
        checklist,
        violations,
        evidences,
        progress,
        complianceScore,
        kpis,
        fileInputRef,
        startLocationChoice,
        startTemplateChoice,
        updateChecklistItem,
        handlePhotoUpload,
        deleteEvidence,
        deleteViolation,
        completeAudit,
        cancelAudit,
        backToTemplateSelect,
        backToLocationSelect
    };
}
