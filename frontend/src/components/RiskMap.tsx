
import React, { useState, useEffect } from 'react';
import type {RestaurantLocation} from '../types';
import { MapPin, Info, AlertTriangle, CheckCircle, Navigation, Loader2, X } from 'lucide-react';
import {api} from "../services/apiServices.ts";

const RiskMap: React.FC = () => {
    const [locations, setLocations] = useState<RestaurantLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLoc, setSelectedLoc] = useState<any>(null);

    useEffect(() => {
        api.getLocations().then(res => {
            if (res.data) setLocations(res.data);
            setLoading(false);
        });
    }, []);

    const getRiskColor = (score: number) => {
        if (score < 30) return 'text-emerald-500 fill-emerald-500';
        if (score < 70) return 'text-amber-500 fill-amber-500';
        return 'text-rose-500 fill-rose-500';
    };

    const getRiskBg = (score: number) => {
        if (score < 30) return 'bg-emerald-50 border-emerald-100 text-emerald-700';
        if (score < 70) return 'bg-amber-50 border-amber-100 text-amber-700';
        return 'bg-rose-50 border-rose-100 text-rose-700';
    };

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-4 opacity-50">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                <p className="text-xs font-bold uppercase tracking-widest">Generando Topología de Riesgo...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Mapa de Riesgo</h2>
                    <p className="text-slate-500 text-sm">Visualización geoespacial de cumplimiento en el Distrito NE.</p>
                </div>
                <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-bold uppercase">
                        <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" /> Crítico
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">
                        <div className="w-2 h-2 rounded-full bg-emerald-600" /> Seguro
                    </div>
                </div>
            </header>

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
                {/* Contenedor del Mapa */}
                <div className="lg:col-span-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
                    {/* Rejilla de Fondo Estilizada */}
                    <div className="absolute inset-0 opacity-20"
                         style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    <div className="absolute inset-0 opacity-10"
                         style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

                    {/* Elementos Decorativos del Mapa */}
                    <div className="absolute top-10 left-10 text-slate-700 text-[10px] font-mono uppercase tracking-widest">Sector_Alpha_72</div>
                    <div className="absolute bottom-10 right-10 text-slate-700 text-[10px] font-mono uppercase tracking-widest">Grid_Coord: 40.7128° N, 74.0060° W</div>

                    {/* Marcadores de Locales */}
                    {locations.map((loc: any) => (
                        <button
                            key={loc.id}
                            onClick={() => setSelectedLoc(loc)}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 focus:outline-none"
                            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                        >
                            <div className="relative">
                                <MapPin className={`w-8 h-8 ${getRiskColor(loc.currentRiskScore)} drop-shadow-xl`} />
                                {loc.currentRiskScore > 70 && (
                                    <div className="absolute -inset-2 bg-rose-500/20 rounded-full animate-ping pointer-events-none" />
                                )}
                            </div>
                        </button>
                    ))}

                    <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 text-white text-[10px] font-bold uppercase tracking-widest">
                        <Navigation className="w-3 h-3 text-emerald-400" /> Radar de Seguridad Activo
                    </div>
                </div>

                {/* Panel de Información Lateral */}
                <div className="lg:col-span-4 space-y-4">
                    {selectedLoc ? (
                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl p-8 h-full animate-in slide-in-from-right-4 duration-300 relative flex flex-col">
                            <button
                                onClick={() => setSelectedLoc(null)}
                                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest mb-6 w-fit ${getRiskBg(selectedLoc.currentRiskScore)}`}>
                                {selectedLoc.currentRiskScore > 70 ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                Nivel de Riesgo: {selectedLoc.currentRiskScore}%
                            </div>

                            <h3 className="text-3xl font-black text-slate-900 leading-tight mb-2">{selectedLoc.name}</h3>
                            <p className="text-slate-500 text-sm mb-8 flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> {selectedLoc.address}
                            </p>

                            <div className="space-y-6 flex-1">
                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Métricas de Seguridad</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase">Infracciones</p>
                                            <p className="text-xl font-black text-slate-900">{selectedLoc.openViolations}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase">Última Insp.</p>
                                            <p className="text-xl font-black text-slate-900">{selectedLoc.lastInspectionDate.split(',')[0]}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Responsable de Unidad</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                            {selectedLoc.manager.charAt(0)}
                                        </div>
                                        <p className="font-bold text-slate-800">{selectedLoc.manager}</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                                Ver Informe Completo
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] border border-slate-200 border-dashed p-10 h-full flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100">
                                <Info className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Sin Selección</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Seleccione un establecimiento en el mapa para analizar su vector de riesgo y datos de cumplimiento.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RiskMap;
