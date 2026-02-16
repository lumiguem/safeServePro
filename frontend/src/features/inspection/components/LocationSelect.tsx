import React from "react";
import { ChevronRight, Loader2, MapPin } from "lucide-react";

import type { RestaurantLocation } from "../../../types";

interface LocationSelectProps {
    locations: RestaurantLocation[];
    loadingLocations: boolean;
    submitMessage: string | null;
    submitError: string | null;
    onSelect: (loc: RestaurantLocation) => void;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
    locations,
    loadingLocations,
    submitMessage,
    submitError,
    onSelect
}) => {
    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            <header>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Seleccionar Establecimiento</h2>
                <p className="text-sm text-slate-500">Elija el local para iniciar la inspección.</p>
            </header>
            {submitMessage && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    {submitMessage}
                </div>
            )}
            {submitError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {submitError}
                </div>
            )}

            {loadingLocations ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-50">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Cargando ubicaciones...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {locations.map(loc => (
                        <button
                            key={loc.id}
                            onClick={() => onSelect(loc)}
                            className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-md transition text-left group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${loc.currentRiskScore > 50 ? "bg-rose-50" : "bg-emerald-50"}`}>
                                    <MapPin className={`w-6 h-6 ${loc.currentRiskScore > 50 ? "text-rose-600" : "text-emerald-600"}`} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 leading-none">{loc.name}</p>
                                    <p className="text-xs text-slate-500 mt-1">{loc.address}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationSelect;
