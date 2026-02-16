import React, { useState, useEffect } from 'react';
import Sidebar from "./components/SideBar";
import Dashboard from './components/Dashboard';
import { InspectionFlow } from './features/inspection';
import AuditHistory from './components/AuditHistory';
import RiskMap from './components/RiskMap';
import Settings from './components/Settings';
import Login from './components/Login';
import { AlertCircle, Menu, X, ShieldCheck } from 'lucide-react';
import type { Tab } from './types';
import { authService } from './services/authService';

const App: React.FC = () => {

    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    // ❗ SIEMPRE iniciar en false
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    const [offlineStatus, setOfflineStatus] = useState<boolean>(!navigator.onLine);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    /**
     * 🔐 Validar token al iniciar la app
     */
    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setIsAuthenticated(false);
            setUser(null);
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));

            // ⏱️ validar expiración
            if (payload.exp * 1000 < Date.now()) {
                throw new Error("Token expirado");
            }

            setUser({
                name: payload.sub,
                role: payload.role ?? "USER"
            });

            setIsAuthenticated(true);

        } catch (error) {
            authService.logout();
            setIsAuthenticated(false);
            setUser(null);
        }
    }, []);

    /**
     * 🌐 Detectar modo offline
     */
    useEffect(() => {
        const handleStatusChange = () => setOfflineStatus(!navigator.onLine);

        window.addEventListener('online', handleStatusChange);
        window.addEventListener('offline', handleStatusChange);

        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
        };
    }, []);

    /**
     * ✅ Login exitoso
     */
    const handleLoginSuccess = (userData: { name: string; role: string }) => {
        setUser(userData);
        setIsAuthenticated(true);
        setActiveTab('dashboard');
    };

    /**
     * 🚪 Logout
     */
    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
        setActiveTab('dashboard');
    };

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    const handleAuditCompleted = () => {
        setActiveTab('inspections');
    };

    /**
     * 🔐 BLOQUEO TOTAL si no está autenticado
     */
    if (!isAuthenticated) {
        return <Login onLogin={handleLoginSuccess} />;
    }

    const validTabs: Tab[] = ['dashboard', 'inspections', 'history', 'risk-map', 'settings'];

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">

            {/* 📱 Header móvil */}
            <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-emerald-600 p-1.5 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="font-bold text-lg tracking-tight text-slate-900">
                        SafeServe <span className="text-emerald-600">Pro</span>
                    </h1>
                </div>

                <button onClick={toggleSidebar} className="p-2 text-slate-500 rounded-lg">
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </header>

            {/* 🧭 Sidebar */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                    setActiveTab(tab);
                    setIsSidebarOpen(false);
                }}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
                user={user}
            />

            {/* 🧩 Contenido */}
            <main className="flex-1 overflow-y-auto w-full">

                {offlineStatus && (
                    <div className="bg-amber-500 text-white px-6 py-2 flex items-center justify-center gap-2 text-sm font-bold sticky top-0 z-50">
                        <AlertCircle className="w-4 h-4" />
                        MODO OFFLINE ACTIVO - SINCRONIZACIÓN PAUSADA
                    </div>
                )}

                <div className="max-w-[1440px] mx-auto w-full">
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'inspections' && (
                        <InspectionFlow onSaveAudit={handleAuditCompleted} />
                    )}
                    {activeTab === 'history' && <AuditHistory />}
                    {activeTab === 'risk-map' && <RiskMap />}
                    {activeTab === 'settings' && <Settings />}

                    {!validTabs.includes(activeTab) && (
                        <div className="flex flex-col items-center justify-center h-[70vh] text-slate-300">
                            <ShieldCheck className="w-20 h-20 mb-4 opacity-5" />
                            <h3 className="text-xl font-bold text-slate-900">
                                Módulo Pendiente
                            </h3>
                            <p className="text-sm">
                                Esta sección está siendo sincronizada por el servidor central.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Overlay móvil */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default App;
