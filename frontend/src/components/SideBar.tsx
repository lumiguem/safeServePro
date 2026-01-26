
import React from 'react';
import type { Tab } from '../types';
import {
    LayoutDashboard,
    ClipboardCheck,
    Map,
    Settings,
    ShieldCheck,
    TrendingUp,
    History,
    X
} from 'lucide-react';

interface SidebarProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
    const menuItems: { id: Tab; icon: any; label: string }[] = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Panel de Control' },
        { id: 'inspections', icon: ClipboardCheck, label: 'Inspecciones' },
        { id: 'risk-map', icon: Map, label: 'Mapa de Riesgo' },
        { id: 'history', icon: History, label: 'Historial de Auditoría' },
        { id: 'analytics', icon: TrendingUp, label: 'Análisis' },
        { id: 'settings', icon: Settings, label: 'Configuración' },
    ];


    return (
        <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col h-screen transition-transform duration-300 transform
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}
      md:translate-x-0 md:static md:shadow-none
    `}>
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-600 p-2 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="font-bold text-xl tracking-tight">SafeServe <span className="text-emerald-600">Pro</span></h1>
                </div>
                {onClose && (
                    <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:text-slate-900">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            activeTab === item.id
                                ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden ring-2 ring-white">
                        <img src="https://picsum.photos/seed/inspector/100" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate">Inspector Jefe</p>
                        <p className="text-xs text-slate-500 truncate">Región: Distrito NE</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
