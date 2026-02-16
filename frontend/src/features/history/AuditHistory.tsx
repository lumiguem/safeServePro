import React from "react";
import { FileText, ChevronRight, Search, Inbox, MapPin, Loader2 } from "lucide-react";

import { useAuditHistory } from "./useAuditHistory";

const AuditHistory: React.FC = () => {
    const { audits, loading, error } = useAuditHistory();

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
                                <span className="text-[10px] font-bold text-slate-400">Registrada</span>
                                <button className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AuditHistory;
