import React, { useEffect, useState } from "react";
import { Building2, ClipboardList, Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import type { Plantilla, RestaurantLocation } from "../../types";
import { locationService } from "../../services/locationService";
import { plantillaService } from "../../services/plantillaService";

type Section = "establecimientos" | "protocolos";

interface LocationFormState {
    name: string;
    address: string;
    currentRiskScore: number;
}

interface TemplateFormState {
    titulo: string;
    categoria: string;
    descripcion: string;
    itemsRaw: string;
}

const initialLocationForm: LocationFormState = {
    name: "",
    address: "",
    currentRiskScore: 0,
};

const initialTemplateForm: TemplateFormState = {
    titulo: "",
    categoria: "",
    descripcion: "",
    itemsRaw: "",
};

const Settings: React.FC = () => {
    const [activeSection, setActiveSection] = useState<Section>("establecimientos");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const [locations, setLocations] = useState<RestaurantLocation[]>([]);
    const [templates, setTemplates] = useState<Plantilla[]>([]);

    const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
    const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

    const [locationForm, setLocationForm] = useState<LocationFormState>(initialLocationForm);
    const [templateForm, setTemplateForm] = useState<TemplateFormState>(initialTemplateForm);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);

        const [locationsRes, templatesRes] = await Promise.all([
            locationService.getLocations(),
            plantillaService.listar(),
        ]);

        if (locationsRes.error) {
            setError(locationsRes.error);
        } else {
            setLocations(locationsRes.data ?? []);
        }

        if (templatesRes.error) {
            setError(templatesRes.error);
        } else {
            setTemplates(templatesRes.data ?? []);
        }

        setLoading(false);
    };

    useEffect(() => {
        void loadData();
    }, []);

    const resetLocationForm = () => {
        setLocationForm(initialLocationForm);
        setEditingLocationId(null);
    };

    const resetTemplateForm = () => {
        setTemplateForm(initialTemplateForm);
        setEditingTemplateId(null);
    };

    const handleSaveLocation = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setMessage(null);

        const payload: Omit<RestaurantLocation, "id"> = {
            name: locationForm.name.trim(),
            address: locationForm.address.trim(),
            currentRiskScore: Number(locationForm.currentRiskScore),
        };

        const response = editingLocationId
            ? await locationService.updateLocation(editingLocationId, payload)
            : await locationService.createLocation(payload);

        if (response.error) {
            setError(response.error);
        } else {
            setMessage(editingLocationId ? "Establecimiento actualizado." : "Establecimiento creado.");
            resetLocationForm();
            await loadData();
        }

        setSaving(false);
    };

    const handleEditLocation = (location: RestaurantLocation) => {
        setEditingLocationId(location.id);
        setLocationForm({
            name: location.name,
            address: location.address,
            currentRiskScore: location.currentRiskScore,
        });
        setActiveSection("establecimientos");
    };

    const handleDeleteLocation = async (id: string) => {
        if (!window.confirm("Deseas eliminar este establecimiento?")) return;
        setSaving(true);
        setError(null);
        setMessage(null);

        const response = await locationService.deleteLocation(id);
        if (response.error) {
            setError(response.error);
        } else {
            setMessage("Establecimiento eliminado.");
            if (editingLocationId === id) resetLocationForm();
            await loadData();
        }

        setSaving(false);
    };

    const buildTemplatePayload = (): Omit<Plantilla, "id"> => {
        const items = templateForm.itemsRaw
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line, index) => ({
                id: `tmp-${index}`,
                tarea: line,
                esCritico: true,
            }));

        return {
            titulo: templateForm.titulo.trim(),
            categoria: templateForm.categoria.trim(),
            descripcion: templateForm.descripcion.trim(),
            items,
        };
    };

    const handleSaveTemplate = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setMessage(null);

        const payload = buildTemplatePayload();

        const response = editingTemplateId
            ? await plantillaService.actualizar(editingTemplateId, payload)
            : await plantillaService.crear(payload);

        if (response.error) {
            setError(response.error);
        } else {
            setMessage(editingTemplateId ? "Protocolo actualizado." : "Protocolo creado.");
            resetTemplateForm();
            await loadData();
        }

        setSaving(false);
    };

    const handleEditTemplate = async (id: string) => {
        setSaving(true);
        setError(null);
        setMessage(null);

        const response = await plantillaService.obtenerPorId(id);
        if (response.error || !response.data) {
            setError(response.error ?? "No se pudo cargar el protocolo.");
            setSaving(false);
            return;
        }

        const template = response.data;
        setEditingTemplateId(template.id);
        setTemplateForm({
            titulo: template.titulo,
            categoria: template.categoria,
            descripcion: template.descripcion ?? "",
            itemsRaw: (template.items ?? []).map((item) => item.tarea).join("\n"),
        });
        setActiveSection("protocolos");
        setSaving(false);
    };

    const handleDeleteTemplate = async (id: string) => {
        if (!window.confirm("Deseas eliminar este protocolo?")) return;
        setSaving(true);
        setError(null);
        setMessage(null);

        const response = await plantillaService.eliminar(id);
        if (response.error) {
            setError(response.error);
        } else {
            setMessage("Protocolo eliminado.");
            if (editingTemplateId === id) resetTemplateForm();
            await loadData();
        }

        setSaving(false);
    };

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Configuracion</h2>
                    <p className="text-slate-500 text-sm">Gestion de establecimientos y protocolos.</p>
                </div>
                <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
                    <button
                        className={`px-4 py-2 text-sm font-bold rounded-lg ${activeSection === "establecimientos" ? "bg-emerald-600 text-white" : "text-slate-600"}`}
                        onClick={() => setActiveSection("establecimientos")}
                    >
                        Establecimientos
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-bold rounded-lg ${activeSection === "protocolos" ? "bg-emerald-600 text-white" : "text-slate-600"}`}
                        onClick={() => setActiveSection("protocolos")}
                    >
                        Protocolos
                    </button>
                </div>
            </header>

            {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>}
            {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</div>}

            {loading ? (
                <div className="py-24 flex items-center justify-center text-slate-400 gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest">Cargando configuracion...</span>
                </div>
            ) : activeSection === "establecimientos" ? (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <form onSubmit={handleSaveLocation} className="xl:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2"><Building2 className="w-4 h-4" />{editingLocationId ? "Editar establecimiento" : "Nuevo establecimiento"}</h3>
                        <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Nombre" value={locationForm.name} onChange={(e) => setLocationForm((s) => ({ ...s, name: e.target.value }))} required />
                        <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Direccion" value={locationForm.address} onChange={(e) => setLocationForm((s) => ({ ...s, address: e.target.value }))} required />
                        <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" type="number" min={0} max={100} placeholder="Riesgo actual" value={locationForm.currentRiskScore} onChange={(e) => setLocationForm((s) => ({ ...s, currentRiskScore: Number(e.target.value) }))} required />
                        <div className="flex gap-2">
                            <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-emerald-600 text-white py-2 text-sm font-bold disabled:opacity-60">{editingLocationId ? "Actualizar" : "Crear"}</button>
                            {editingLocationId && <button type="button" onClick={resetLocationForm} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600">Cancelar</button>}
                        </div>
                    </form>

                    <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900">Listado de establecimientos</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {locations.map((location) => (
                                <div key={location.id} className="px-6 py-4 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-bold text-sm text-slate-900">{location.name}</p>
                                        <p className="text-xs text-slate-500">{location.address}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-500 rounded-lg bg-slate-100 px-2 py-1">Riesgo {location.currentRiskScore}</span>
                                        <button onClick={() => handleEditLocation(location)} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-600"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => void handleDeleteLocation(location.id)} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <form onSubmit={handleSaveTemplate} className="xl:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2"><Plus className="w-4 h-4" />{editingTemplateId ? "Editar protocolo" : "Nuevo protocolo"}</h3>
                        <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Titulo" value={templateForm.titulo} onChange={(e) => setTemplateForm((s) => ({ ...s, titulo: e.target.value }))} required />
                        <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Categoria" value={templateForm.categoria} onChange={(e) => setTemplateForm((s) => ({ ...s, categoria: e.target.value }))} required />
                        <textarea className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm min-h-20" placeholder="Descripcion" value={templateForm.descripcion} onChange={(e) => setTemplateForm((s) => ({ ...s, descripcion: e.target.value }))} />
                        <textarea className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm min-h-32" placeholder="Items (uno por linea)" value={templateForm.itemsRaw} onChange={(e) => setTemplateForm((s) => ({ ...s, itemsRaw: e.target.value }))} required />
                        <div className="flex gap-2">
                            <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-emerald-600 text-white py-2 text-sm font-bold disabled:opacity-60">{editingTemplateId ? "Actualizar" : "Crear"}</button>
                            {editingTemplateId && <button type="button" onClick={resetTemplateForm} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600">Cancelar</button>}
                        </div>
                    </form>

                    <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900">Listado de protocolos</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {templates.map((template) => (
                                <div key={template.id} className="px-6 py-4 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 flex items-center gap-2"><ClipboardList className="w-4 h-4 text-slate-400" />{template.titulo}</p>
                                        <p className="text-xs text-slate-500">{template.categoria} · {template.items.length} items</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => void handleEditTemplate(template.id)} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-600"><Pencil className="w-4 h-4" /></button>
                                        <button onClick={() => void handleDeleteTemplate(template.id)} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
