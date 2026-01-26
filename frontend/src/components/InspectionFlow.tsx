import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
    Camera, Loader2, ChevronRight, ArrowLeft, CheckCircle,
    Plus, Activity, Zap, MapPin, Thermometer, ShieldAlert, UserCheck, ClipboardCheck
} from 'lucide-react';
import {
    calculateProgress,
    calculateComplianceScore,
    calculateKPIs,
    generateAuditId
} from '../services/calculationService';
import { ViolationPriority, type Violation, type CompletedAudit, type RestaurantLocation } from '../types';
import {api} from "../services/apiServices.ts";

interface ChecklistItem {
    id: string;
    task: string;
    status: 'pending' | 'pass' | 'fail';
}

interface EvidenceItem {
    id: string;
    url: string;
    timestamp: string;
}

interface Plantilla {
    id: string;
    label: string;
    category: string;
    items: string[];
}

interface InspectionFlowProps {
    onSaveAudit: (audit: CompletedAudit) => void;
}

const InspectionFlow: React.FC<InspectionFlowProps> = ({ onSaveAudit }) => {
    const [step, setStep] = useState<'location-select' | 'template-select' | 'form'>('location-select');
    const [locations, setLocations] = useState<RestaurantLocation[]>([]);
    const [templates, setTemplates] = useState<Plantilla[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingLocations, setLoadingLocations] = useState(true);
    const [loadingTemplates, setLoadingTemplates] = useState(false);

    const [selectedLocation, setSelectedLocation] = useState<RestaurantLocation | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<Plantilla | null>(null);

    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [violations, setViolations] = useState<Violation[]>([]);
    const [evidences, setEvidences] = useState<EvidenceItem[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cargar ubicaciones
    useEffect(() => {
        if (step === 'location-select') {
            setLoadingLocations(true);
            api.getLocations().then(res => {
                if (res.data) setLocations(res.data);
                setLoadingLocations(false);
            });
        }
    }, [step]);

    // Cargar plantillas
    useEffect(() => {
        if (step === 'template-select') {
            setLoadingTemplates(true);
            api.getPlantillas().then(res => {
                if (res.data) setTemplates(res.data);
                setLoadingTemplates(false);
            });
        }
    }, [step]);

    const startLocationChoice = (loc: RestaurantLocation) => {
        setSelectedLocation(loc);
        setStep('template-select');
    };

    const startTemplateChoice = (template: Plantilla) => {
        setSelectedTemplate(template);
        setChecklist(template.items.map((item, idx) => ({
            id: `${template.id}-${idx}`, // ID único
            task: item,
            status: 'pending'
        })));
        setStep('form');
    };

    const updateChecklistItem = (id: string, status: 'pass' | 'fail') => {
        setChecklist(prev => prev.map(item => {
            if (item.id === id) {
                if (status === 'fail' && item.status !== 'fail') {
                    const autoViolation: Violation = {
                        id: `auto-${item.id}`,
                        category: selectedTemplate?.category || 'General',
                        description: `Incumplimiento: ${item.task}`,
                        priority: ViolationPriority.MEDIUM,
                        correctiveAction: 'Se requiere limpieza u organización inmediata.',
                        isResolved: false
                    };
                    setViolations(v => [...v, autoViolation]);
                }
                return { ...item, status };
            }
            return item;
        }));
    };

    const progress = useMemo(() => calculateProgress(checklist), [checklist]);
    const complianceScore = useMemo(() => calculateComplianceScore(checklist), [checklist]);
    const kpis = useMemo(() => calculateKPIs(violations, complianceScore, evidences.length), [violations, complianceScore, evidences]);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const resultBase64 = reader.result as string;
            const base64Content = resultBase64.split(',')[1];

            const newEvidence: EvidenceItem = {
                id: Math.random().toString(36).substr(2, 9),
                url: resultBase64,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setEvidences(prev => [newEvidence, ...prev]);
            setIsAnalyzing(true);

            try {
                const result = await api.analyzeEvidence(base64Content);
                const newViolations = result.violations.map((v: any) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    category: v.category,
                    description: v.description,
                    priority: v.priority as ViolationPriority,
                    correctiveAction: v.recommendation,
                    isResolved: false
                }));
                setViolations(prev => [...prev, ...newViolations]);
            } catch (err) {
                console.error("Backend AI Error", err);
            } finally {
                setIsAnalyzing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const completeAudit = async () => {
        if (!selectedTemplate || !selectedLocation) return;
        setIsSubmitting(true);

        const auditData: CompletedAudit = {
            id: generateAuditId(),
            locationId: selectedLocation.id,
            locationName: selectedLocation.name,
            templateLabel: selectedTemplate.label,
            date: new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' }),
            violationsCount: violations.length,
            evidencesCount: evidences.length,
            progress: complianceScore,
            violations: violations,
            kpis: kpis,
            serverSynced: false
        };

        const response = await api.submitAudit(auditData);
        if (response.data) {
            onSaveAudit(response.data);
            // Reset
            setStep('location-select');
            setViolations([]);
            setEvidences([]);
            setChecklist([]);
            setSelectedLocation(null);
            setSelectedTemplate(null);
        }
        setIsSubmitting(false);
    };

    // ----------------------------- RENDER -----------------------------
    if (step === 'location-select') {
        return (
            <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
                <header>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Seleccionar Establecimiento</h2>
                    <p className="text-sm text-slate-500">Elija el local para iniciar la inspección.</p>
                </header>

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
                                onClick={() => startLocationChoice(loc)}
                                className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-md transition text-left group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${loc.currentRiskScore > 50 ? 'bg-rose-50' : 'bg-emerald-50'}`}>
                                        <MapPin className={`w-6 h-6 ${loc.currentRiskScore > 50 ? 'text-rose-600' : 'text-emerald-600'}`} />
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
    }

    if (step === 'template-select') {
        return (
            <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
                <header className="flex items-center gap-4">
                    <button onClick={() => setStep('location-select')} className="p-2.5 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 rounded-xl transition">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Seleccionar Protocolo</h2>
                        <p className="text-sm text-slate-500">Establecimiento: <span className="font-semibold text-slate-900">{selectedLocation?.name}</span></p>
                    </div>
                </header>

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
                            const Icon = tmpl.category === 'Almacenamiento' ? Thermometer :
                                tmpl.category === 'Seguridad' ? ShieldAlert :
                                    tmpl.category === 'Personal' ? UserCheck : ClipboardCheck;

                            return (
                                <button
                                    key={tmpl.id}
                                    onClick={() => startTemplateChoice(tmpl)}
                                    className="group relative bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all text-left overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-110 transition-transform">
                                        <Icon className="w-24 h-24" />
                                    </div>
                                    <div className="relative z-10">
                                        <span className="inline-block px-2 py-1 bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-lg mb-3">
                                            {tmpl.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{tmpl.label}</h3>
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
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-300 pb-24">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => setStep('template-select')} className="p-2.5 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 rounded-xl transition">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">{selectedTemplate?.label}</h2>
                        <p className="text-xs text-slate-500 font-medium">{selectedLocation?.name} • Endpoint Seguro del Distrito</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-sm">
                        <div className="flex flex-col border-r border-slate-100 pr-3">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Hallazgos Críticos</span>
                            <span className={`text-sm font-black leading-none ${kpis.criticalCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{kpis.criticalCount}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Puntaje</span>
                            <span className="text-sm font-black leading-none text-slate-900">{complianceScore}%</span>
                        </div>
                    </div>
                    <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg border border-slate-800">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold leading-none uppercase tracking-widest">Backend en Vivo</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="font-bold mb-6 flex items-center gap-2 text-slate-800">
                            <Zap className="w-5 h-5 text-amber-500" /> Protocolo Activo
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {checklist.map((item) => (
                                <div key={item.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-white transition-colors">
                                    <p className="text-xs font-bold text-slate-700 mb-4 h-8 overflow-hidden">{item.task}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateChecklistItem(item.id, 'pass')}
                                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black border transition-all ${item.status === 'pass' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400 hover:border-emerald-200'}`}
                                        >
                                            CUMPLE
                                        </button>
                                        <button
                                            onClick={() => updateChecklistItem(item.id, 'fail')}
                                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black border transition-all ${item.status === 'fail' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-400 hover:border-rose-200'}`}
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
                                <span className="text-[10px] font-bold text-slate-400 mt-2">{isAnalyzing ? 'ANALIZANDO' : 'CAPTURAR'}</span>
                            </button>
                            {evidences.map(ev => (
                                <div key={ev.id} className="aspect-square relative rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                                    <img src={ev.url} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-1.5">
                                        <p className="text-[8px] text-white text-center font-bold">{ev.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
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
                                            <span className="text-[8px] font-bold text-slate-400">{v.category}</span>
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
                                onClick={completeAudit}
                                disabled={progress < 100 || isSubmitting}
                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${progress === 100 && !isSubmitting ? 'bg-emerald-600 text-white shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98]' : 'bg-slate-100 text-slate-400'}`}
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Sincronizando con el Distrito...</>
                                ) : progress === 100 ? (
                                    'Finalizar y Enviar'
                                ) : (
                                    `Completar Lista (${100-progress}%)`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspectionFlow;
