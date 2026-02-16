import React from "react";
import {
    Activity,
    ArrowLeft,
    Camera,
    CheckCircle,
    Loader2,
    Plus,
    Zap
} from "lucide-react";

import type { Plantilla, RestaurantLocation, Violation } from "../../../types";

interface InspectionFormProps {
    selectedLocation: RestaurantLocation | null;
    selectedTemplate: Plantilla | null;
    checklist: { id: string; task: string; status: "pending" | "pass" | "fail" }[];
    violations: Violation[];
    evidences: { id: string; url: string; timestamp: string }[];
    progress: number;
    complianceScore: number;
    kpis: { criticalCount: number };
    isAnalyzing: boolean;
    deletingEvidenceIds: Set<string>;
    isSubmitting: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onCancel: () => void;
    onUpdateChecklist: (id: string, status: "pass" | "fail") => void;
    onUploadPhoto: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDeleteEvidence: (id: string) => void;
    onDeleteViolation: (id: string) => void;
    onComplete: () => void;
}

const InspectionForm: React.FC<InspectionFormProps> = ({
    selectedLocation,
    selectedTemplate,
    checklist,
    violations,
    evidences,
    progress,
    complianceScore,
    kpis,
    isAnalyzing,
    deletingEvidenceIds,
    isSubmitting,
    fileInputRef,
    onCancel,
    onUpdateChecklist,
    onUploadPhoto,
    onDeleteEvidence,
    onDeleteViolation,
    onComplete
}) => {
    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-300 pb-24">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={onCancel} className="p-2.5 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 rounded-xl transition">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-lg md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">{selectedTemplate?.titulo}</h2>
                        <p className="text-xs text-slate-500 font-medium">{selectedLocation?.name} • Endpoint Seguro del Distrito</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-sm">
                        <div className="flex flex-col border-r border-slate-100 pr-3">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Hallazgos Críticos</span>
                            <span className={`text-sm font-black leading-none ${kpis.criticalCount > 0 ? "text-rose-600" : "text-emerald-600"}`}>{kpis.criticalCount}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Puntaje</span>
                            <span className="text-sm font-black leading-none text-slate-900">{complianceScore}%</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800">
                            <Zap className="w-5 h-5 text-amber-500" /> Protocolo Activo
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {checklist.map((item) => (
                                <div key={item.id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-white transition-colors">
                                    <p className="text-[11px] font-bold text-slate-700 mb-2 h-7 overflow-hidden">{item.task}</p>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => onUpdateChecklist(item.id, "pass")}
                                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-black border transition-all ${item.status === "pass" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-400 hover:border-emerald-200"}`}
                                        >
                                            CUMPLE
                                        </button>
                                        <button
                                            onClick={() => onUpdateChecklist(item.id, "fail")}
                                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-black border transition-all ${item.status === "fail" ? "bg-rose-600 text-white border-rose-600" : "bg-white text-slate-400 hover:border-rose-200"}`}
                                        >
                                            FALLA
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="font-bold mb-6 flex items-center gap-2"><Camera className="w-5 h-5 text-emerald-600" /> Alimentación de Evidencia IA</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isAnalyzing}
                                className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center group hover:border-emerald-300 disabled:opacity-50 transition-all"
                            >
                                {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin text-emerald-600" /> : <Plus className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />}
                                <span className="text-[10px] font-bold text-slate-400 mt-2">{isAnalyzing ? "ANALIZANDO" : "CAPTURAR"}</span>
                            </button>
                            {evidences.map(ev => (
                                <div key={ev.id} className="aspect-square relative rounded-3xl overflow-hidden border border-slate-100 shadow-sm group">
                                    <img src={ev.url} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => onDeleteEvidence(ev.id)}
                                        disabled={isAnalyzing || deletingEvidenceIds.has(ev.id)}
                                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 text-[10px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Eliminar evidencia"
                                        type="button"
                                    >
                                        {deletingEvidenceIds.has(ev.id) ? "..." : "X"}
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-1.5">
                                        <p className="text-[8px] text-white text-center font-bold">{ev.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={onUploadPhoto} className="hidden" accept="image/*" />
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col min-h-[500px]">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-600" /> Registro de Infracciones
                        </h3>
                        <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {violations.length === 0 ? (
                                <div className="py-20 text-center opacity-20">
                                    <CheckCircle className="w-12 h-12 mx-auto text-emerald-500" />
                                    <p className="font-bold text-xs mt-4 uppercase tracking-widest">Sin Hallazgos</p>
                                </div>
                            ) : (
                                violations.map(v => (
                                    <div key={v.id} className="p-4 border border-slate-100 bg-slate-50/20 rounded-2xl border-l-4 border-l-rose-500 animate-in slide-in-from-right-2">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[8px] font-black bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded uppercase">{v.priority}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[8px] font-bold text-slate-400">{v.category}</span>
                                                <button
                                                    onClick={() => onDeleteViolation(v.id)}
                                                    className="w-6 h-6 rounded-full border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center text-xs font-black"
                                                    type="button"
                                                    aria-label="Eliminar hallazgo"
                                                >
                                                    -
                                                </button>
                                            </div>
                                        </div>
                                        <p className="font-bold text-slate-900 text-xs leading-tight">{v.description}</p>
                                        <div className="mt-3 pt-3 border-t border-slate-100">
                                            <p className="text-[9px] font-black text-emerald-700 uppercase leading-none mb-1">Acción Correctiva:</p>
                                            <p className="text-[10px] text-slate-600 leading-tight">{v.correctiveAction}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Progreso</span>
                                    <span className="text-[10px] font-bold text-slate-900">{progress}%</span>
                                </div>
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                                </div>
                            </div>

                            <button
                                onClick={onComplete}
                                disabled={progress < 100 || isSubmitting}
                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${progress === 100 && !isSubmitting ? "bg-emerald-600 text-white shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98]" : "bg-slate-100 text-slate-400"}`}
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Sincronizando con el Distrito...</>
                                ) : progress === 100 ? (
                                    "Finalizar y Enviar"
                                ) : (
                                    `Completar Lista (${100 - progress}%)`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspectionForm;
