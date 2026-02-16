import React from "react";
import { ArrowLeft, ChevronRight, ClipboardCheck, Loader2, ShieldAlert, Thermometer, UserCheck } from "lucide-react";

import type { Plantilla, RestaurantLocation } from "../../../types";

interface TemplateSelectProps {
    templates: Plantilla[];
    selectedLocation: RestaurantLocation | null;
    loadingTemplates: boolean;
    submitError: string | null;
    isCreatingAudit: boolean;
    onBack: () => void;
    onSelect: (template: Plantilla) => void;
}

const TemplateSelect: React.FC<TemplateSelectProps> = ({
    templates,
    selectedLocation,
    loadingTemplates,
    submitError,
    isCreatingAudit,
    onBack,
    onSelect
}) => {
    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
            <header className="flex items-center gap-4">
                <button onClick={onBack} className="p-2.5 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 rounded-xl transition">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Seleccionar Protocolo</h2>
                    <p className="text-sm text-slate-500">Establecimiento: <span className="font-semibold text-slate-900">{selectedLocation?.name}</span></p>
                </div>
            </header>

            {submitError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {submitError}
                </div>
            )}

            {loadingTemplates ? (
                <div className="py-20 text-center opacity-50">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
                    <p className="text-xs font-bold uppercase tracking-widest mt-4">
                        Cargando protocolos...
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((tmpl) => {
                        const Icon = tmpl.categoria === "Almacenamiento" ? Thermometer :
                            tmpl.categoria === "Seguridad" ? ShieldAlert :
                                tmpl.categoria === "Personal" ? UserCheck : ClipboardCheck;

                        return (
                            <button
                                key={tmpl.id}
                                onClick={() => onSelect(tmpl)}
                                disabled={isCreatingAudit}
                                className="group relative bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all text-left overflow-hidden disabled:opacity-60 disabled:hover:shadow-none"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-110 transition-transform">
                                    <Icon className="w-24 h-24" />
                                </div>
                                <div className="relative z-10">
                                    <span className="inline-block px-2 py-1 bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-lg mb-3">
                                        {tmpl.categoria}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{tmpl.titulo}</h3>
                                    <p className="text-xs text-slate-400 font-medium">{tmpl.items.length} puntos críticos</p>
                                    <div className="mt-6 flex items-center text-xs font-bold text-emerald-600 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Iniciar Inspección <ChevronRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TemplateSelect;
