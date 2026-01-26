
import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell
} from 'recharts';
import { AlertTriangle, CheckCircle, Search, Map, TrendingUp, Loader2, Cloud } from 'lucide-react';
import type {RestaurantLocation} from '../types';
import {api} from "../services/apiServices.ts";

const Dashboard: React.FC = () => {
    const [locations, setLocations] = useState<RestaurantLocation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const res = await api.getLocations();
            if (res.data) setLocations(res.data);
            setLoading(false);
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center text-slate-400 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                <p className="font-bold text-sm tracking-widest uppercase">Obteniendo Datos del Distrito...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Vigilancia Sanitaria</h2>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-tighter">
                            <Cloud className="w-3 h-3" /> Sistema Activo
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">Monitoreo de riesgo en tiempo real en todo el distrito.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar establecimientos..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64 shadow-sm"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: 'Locales Totales', value: locations.length, icon: Map },
                    { label: 'Riesgo Alto', value: locations.filter(l => l.currentRiskScore > 70).length, icon: AlertTriangle },
                    { label: 'Cumplimiento', value: '94%', icon: CheckCircle },
                    { label: 'Tiempo de Actividad', value: '99.9%', icon: TrendingUp },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-2xl font-black mt-1 text-slate-900">{stat.value}</h3>
                            </div>
                            <div className={`p-2 rounded-xl bg-slate-50`}>
                                <stat.icon className={`w-5 h-5 text-slate-400`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-lg mb-6 text-slate-800">Análisis de Riesgo por Local</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={locations}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="currentRiskScore" name="Puntaje de Riesgo" radius={[4, 4, 0, 0]} barSize={32}>
                                    {locations.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.currentRiskScore > 70 ? '#f43f5e' : '#10b981'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                        <h3 className="font-bold text-slate-800 tracking-tight">Canal de Servicio Backend</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {locations.slice(0, 3).map((l, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-1 h-8 bg-slate-100 rounded-full group-hover:bg-emerald-500 transition-colors" />
                                <div>
                                    <p className="text-xs font-bold text-slate-900">{l.name} actualizado</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Riesgo ajustado a {l.currentRiskScore}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
