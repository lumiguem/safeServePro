import React from "react";
import { FileText, ChevronRight, Search, Inbox, MapPin, Loader2, X, AlertTriangle, Camera } from "lucide-react";

import { useAuditHistory } from "./useAuditHistory";
import { auditService } from "../../services/auditService";
import type { AuditoriaDetalle, ViolationPriority } from "../../types";

const formatAuditDateTime = (rawDate?: string) => {
    if (!rawDate) return "Sin fecha";

    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return "Sin fecha";

    return new Intl.DateTimeFormat("es-CO", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(date);
};

const PRIORITY_LABELS: Record<ViolationPriority, string> = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
    CRITICAL: "Critica",
};

const AuditHistory: React.FC = () => {
    const { audits, loading, error } = useAuditHistory();
    const [selectedAuditDetail, setSelectedAuditDetail] = React.useState<AuditoriaDetalle | null>(null);
    const [detailLoading, setDetailLoading] = React.useState(false);
    const [detailError, setDetailError] = React.useState<string | null>(null);

    const handleOpenDetail = async (auditId: string) => {
        setDetailError(null);
        setDetailLoading(true);
        try {
            const detail = await auditService.getAuditDetail(auditId);
            setSelectedAuditDetail(detail);
        } catch {
            setDetailError("No se pudo cargar el detalle de la auditoria.");
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCloseDetail = () => {
        setSelectedAuditDetail(null);
        setDetailError(null);
        setDetailLoading(false);
    };

    const hallazgosPorPrioridad = selectedAuditDetail?.hallazgos.reduce<Record<ViolationPriority, number>>(
        (acc, hallazgo) => {
            const prioridad = hallazgo.prioridad ?? "MEDIUM";
            acc[prioridad] += 1;
            return acc;
        },
        { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }
    );

    const evidenciasConImagen = (selectedAuditDetail?.evidencias ?? []).filter((evidencia) => {
        const isImageType = evidencia.tipoArchivo?.toLowerCase().startsWith("image/");
        const isHttpUrl = evidencia.urlArchivo?.startsWith("http://") || evidencia.urlArchivo?.startsWith("https://");
        return isImageType && isHttpUrl;
    });

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Archivo de Auditorias</h2>
                    <p className="text-slate-500 text-sm">Registros historicos del distrito.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar en archivos..."
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full shadow-sm"
                    />
                </div>
            </header>

            {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="py-40 flex flex-col items-center justify-center gap-4 opacity-50">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="text-xs font-bold uppercase tracking-widest">Consultando el Registro...</p>
                </div>
            ) : audits.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-20 flex flex-col items-center justify-center text-center">
                    <Inbox className="w-16 h-16 text-slate-200 mb-6" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron auditorias</h3>
                    <p className="text-slate-500 max-w-sm">Las inspecciones completadas apareceran aqui despues de la verificacion del servidor.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {audits.map((audit) => (
                        <div key={audit.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group flex flex-col overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-900 p-2 rounded-xl">
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm leading-tight">
                                                {audit.plantillaLabel ?? `Plantilla ${audit.plantillaId}`}
                                            </h4>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">#{audit.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-6 p-2 bg-slate-50 rounded-xl border border-slate-50">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-700">
                                        {audit.establecimientoNombre ?? audit.establecimientoId}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Puntaje</p>
                                        <p className="text-xl font-black text-slate-400">
                                            {typeof audit.puntuacionCumplimiento === "number" ? `${audit.puntuacionCumplimiento}%` : "N/D"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Hallazgos</p>
                                        <p className="text-xl font-black text-slate-400">
                                            {audit.numeroHallazgos ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400">
                                    {formatAuditDateTime(audit.fechaAuditoria)}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => void handleOpenDetail(audit.id)}
                                    className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {(detailLoading || detailError || selectedAuditDetail) && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">Detalle de Auditoria</h3>
                            <button
                                type="button"
                                onClick={handleCloseDetail}
                                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {detailLoading && (
                            <div className="p-10 flex items-center justify-center gap-3 text-slate-500">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm font-semibold">Cargando detalle...</span>
                            </div>
                        )}

                        {!detailLoading && detailError && (
                            <div className="p-6 text-sm font-semibold text-rose-700 bg-rose-50 border-y border-rose-100">
                                {detailError}
                            </div>
                        )}

                        {!detailLoading && selectedAuditDetail && (
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Puntaje</p>
                                        <p className="text-2xl font-black text-slate-900 mt-1">
                                            {typeof selectedAuditDetail.auditoria.puntuacionCumplimiento === "number"
                                                ? `${selectedAuditDetail.auditoria.puntuacionCumplimiento}%`
                                                : "N/D"}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha y Hora</p>
                                        <p className="text-sm font-bold text-slate-900 mt-2">
                                            {formatAuditDateTime(selectedAuditDetail.auditoria.fechaAuditoria)}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hallazgos</p>
                                        <p className="text-2xl font-black text-slate-900 mt-1">{selectedAuditDetail.totalHallazgos}</p>
                                    </div>
                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Evidencias</p>
                                        <p className="text-2xl font-black text-slate-900 mt-1">{selectedAuditDetail.totalEvidencias}</p>
                                    </div>
                                </div>

                                <section className="space-y-3">
                                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-500">Resumen de Hallazgos</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                                        <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Resueltos</p>
                                            <p className="text-xl font-black text-emerald-700">{selectedAuditDetail.hallazgosResueltos}</p>
                                        </div>
                                        <div className="p-3 rounded-xl border border-amber-100 bg-amber-50">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Pendientes</p>
                                            <p className="text-xl font-black text-amber-700">{selectedAuditDetail.hallazgosPendientes}</p>
                                        </div>
                                        {(Object.keys(PRIORITY_LABELS) as ViolationPriority[]).map((priority) => (
                                            <div key={priority} className="p-3 rounded-xl border border-slate-200 bg-white">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    {PRIORITY_LABELS[priority]}
                                                </p>
                                                <p className="text-xl font-black text-slate-900">{hallazgosPorPrioridad?.[priority] ?? 0}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-3">
                                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-500">Detalle de Hallazgos</h4>
                                    {selectedAuditDetail.hallazgos.length === 0 ? (
                                        <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
                                            Esta auditoria no tiene hallazgos registrados.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {selectedAuditDetail.hallazgos.map((hallazgo) => (
                                                <div key={hallazgo.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{hallazgo.descripcion}</p>
                                                            <p className="text-xs text-slate-500 mt-1">{hallazgo.categoria ?? "Sin categoria"}</p>
                                                        </div>
                                                        <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 border border-slate-200 font-bold text-slate-600">
                                                            {PRIORITY_LABELS[hallazgo.prioridad ?? "MEDIUM"]}
                                                        </span>
                                                    </div>
                                                    {hallazgo.accionCorrectiva && (
                                                        <p className="text-xs text-slate-600 mt-3">
                                                            <span className="font-bold">Accion:</span> {hallazgo.accionCorrectiva}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                <section className="space-y-3">
                                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-500">Evidencia Fotografica</h4>
                                    {evidenciasConImagen.length === 0 ? (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex items-center gap-3 text-sm text-slate-500">
                                            <AlertTriangle className="w-4 h-4" />
                                            No hay imagenes de evidencia disponibles para esta auditoria.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {evidenciasConImagen.map((evidencia) => (
                                                <div key={evidencia.id} className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                                                    <img
                                                        src={evidencia.urlArchivo}
                                                        alt={`Evidencia ${evidencia.id}`}
                                                        className="w-full h-48 object-cover"
                                                        loading="lazy"
                                                    />
                                                    <div className="p-3 text-xs text-slate-500 flex items-center gap-2">
                                                        <Camera className="w-3 h-3" />
                                                        {formatAuditDateTime(evidencia.timestampCaptura)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditHistory;
