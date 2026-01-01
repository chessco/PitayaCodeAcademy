import React, { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon, CreditCard, Shield,
    Save, Bell, Globe, Camera, Palette,
    ChevronRight, Zap, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useSearchParams } from 'react-router-dom';

type Tab = 'general' | 'billing' | 'security' | 'notifications';

export default function Settings() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = (searchParams.get('tab') as Tab) || 'general';
    const [activeTab, setActiveTab] = useState<Tab>(initialTab);
    const [tenantName, setTenantName] = useState('PitayaCode | Academy');
    const [accentColor, setAccentColor] = useState('#3b82f6');
    const [logoUrl, setLogoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        const fetchTenant = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:3001/tenants/me', {
                    headers: {
                        'x-tenant-id': 'academy' // In a real app, this would be dynamic from the host or context
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setTenantName(data.name);
                    setAccentColor(data.accentColor || '#3b82f6');
                    setLogoUrl(data.logoUrl || '');
                }
            } catch (error) {
                console.error('Error fetching tenant:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTenant();
    }, []);

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            const response = await fetch('http://localhost:3001/tenants/me', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-tenant-id': 'academy'
                },
                body: JSON.stringify({
                    name: tenantName,
                    accentColor: accentColor,
                    logoUrl: logoUrl
                })
            });

            if (response.ok) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            console.error('Error saving tenant:', error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Configuración</h1>
                    <p className="text-[13px] text-gray-500 font-medium">Administra la identidad de tu academia, facturación y seguridad.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 ${saveStatus === 'success' ? 'bg-green-500' : isSaving ? 'bg-gray-600' : 'bg-primary'
                        } text-white`}
                >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'GUARDANDO...' : saveStatus === 'success' ? '¡GUARDADO!' : 'GUARDAR CAMBIOS'}</span>
                </button>
            </div>

            {/* Content Sidebar Layout */}
            <div className="grid lg:grid-cols-4 gap-10 items-start">

                {/* Internal Navigation */}
                <nav className="space-y-1">
                    <TabButton
                        id="general"
                        active={activeTab === 'general'}
                        onClick={() => handleTabChange('general')}
                        icon={<SettingsIcon className="w-4 h-4" />}
                        label="General"
                    />
                    <TabButton
                        id="billing"
                        active={activeTab === 'billing'}
                        onClick={() => handleTabChange('billing')}
                        icon={<CreditCard className="w-4 h-4" />}
                        label="Facturación"
                    />
                    <TabButton
                        id="security"
                        active={activeTab === 'security'}
                        onClick={() => handleTabChange('security')}
                        icon={<Shield className="w-4 h-4" />}
                        label="Segregación & Seguridad"
                    />
                    <TabButton
                        id="notifications"
                        active={activeTab === 'notifications'}
                        onClick={() => handleTabChange('notifications')}
                        icon={<Bell className="w-4 h-4" />}
                        label="Notificaciones"
                    />
                </nav>

                {/* Tab Panels */}
                <main className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'general' && (
                                <section className="space-y-8">
                                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-8">
                                        <h3 className="text-xl font-black text-white">Identidad de la Academia</h3>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Nombre de la Academia</label>
                                                <input
                                                    type="text"
                                                    value={tenantName}
                                                    onChange={(e) => setTenantName(e.target.value)}
                                                    className="w-full bg-[#111114] border border-white/5 rounded-xl py-4 px-5 text-sm font-medium text-white focus:outline-none focus:border-primary/50 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Slug (URL)</label>
                                                <div className="flex items-center">
                                                    <span className="bg-[#111114] border border-white/5 border-r-0 rounded-l-xl py-4 px-4 text-xs font-bold text-gray-500 tracking-tight">lms.pitayacode.io/</span>
                                                    <input
                                                        type="text"
                                                        value="academy"
                                                        readOnly
                                                        className="flex-1 bg-[#111114] border border-white/5 rounded-r-xl py-4 px-2 text-sm font-medium text-gray-400 focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Logo del Inquilino</p>
                                            <div className="flex items-center space-x-6">
                                                <div className="w-24 h-24 bg-[#111114] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-2 group cursor-pointer hover:border-primary/50 transition-colors">
                                                    <Camera className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
                                                    <span className="text-[9px] font-black text-gray-700 uppercase">Cambiar</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-gray-400 mb-1">Cargar nueva imagen</p>
                                                    <p className="text-[10px] text-gray-600 leading-relaxed max-w-xs">Formatos recomendados: PNG o SVG transparente. Tamaño máximo: 2MB.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                                        <div className="flex items-center space-x-3">
                                            <Palette className="w-5 h-5 text-primary" />
                                            <h3 className="text-xl font-black text-white">Diseño & Marca</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Color de Acento de la Interfaz</p>
                                            <div className="flex items-center space-x-4">
                                                <input
                                                    type="color"
                                                    value={accentColor}
                                                    onChange={(e) => setAccentColor(e.target.value)}
                                                    className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer overflow-hidden"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-gray-400 tracking-tight">{accentColor.toUpperCase()}</p>
                                                    <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Este color se aplicará a botones y elementos activos.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'billing' && (
                                <section className="space-y-8">
                                    <div className="bg-gradient-to-br from-primary/20 to-purple-500/10 border border-primary/20 p-8 lg:p-10 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                            <div className="space-y-4">
                                                <div className="inline-flex items-center space-x-2 bg-primary/20 px-3 py-1 rounded-full border border-primary/20">
                                                    <Zap className="w-3.5 h-3.5 text-primary" />
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Plan Actual</span>
                                                </div>
                                                <h3 className="text-3xl font-black text-white">Academia Pro Unlimited</h3>
                                                <p className="text-sm font-medium text-gray-400 max-w-sm">Tu suscripción se renovará automáticamente el 15 de Octubre, 2024 por $99.00/mes.</p>
                                            </div>
                                            <button className="px-8 py-4 bg-white text-black rounded-xl font-bold text-xs hover:scale-[1.02] transition-all">
                                                CAMBIAR PLAN
                                            </button>
                                        </div>
                                        {/* Decorative Zap */}
                                        <Zap className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                                    </div>

                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
                                        <div className="p-8 border-b border-white/5">
                                            <h4 className="text-lg font-black text-white">Historial de Facturación</h4>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-white/[0.01] border-b border-white/5">
                                                        <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Fecha</th>
                                                        <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Concepto</th>
                                                        <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Monto</th>
                                                        <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Recibo</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {[
                                                        { date: '15 Ago, 2024', label: 'Suscripción Pro - Mensual', amount: '$99.00' },
                                                        { date: '15 Jul, 2024', label: 'Suscripción Pro - Mensual', amount: '$99.00' },
                                                        { date: '15 Jun, 2024', label: 'Suscripción Pro - Mensual', amount: '$99.00' },
                                                    ].map((inv, i) => (
                                                        <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                                                            <td className="px-8 py-6 text-sm font-bold text-gray-400">{inv.date}</td>
                                                            <td className="px-8 py-6 text-sm font-bold text-white">{inv.label}</td>
                                                            <td className="px-8 py-6 text-sm font-black text-white">{inv.amount}</td>
                                                            <td className="px-8 py-6 text-right">
                                                                <button className="p-2.5 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
                                                                    <ExternalLink className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'security' && (
                                <section className="space-y-8 text-center py-20 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                                    <Shield className="w-16 h-16 text-primary mx-auto mb-6 opacity-20" />
                                    <h3 className="text-2xl font-black text-white tracking-tight">Seguridad Avanzada</h3>
                                    <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto leading-relaxed">
                                        Las opciones de seguridad y configuración de dominio personalizado estarán disponibles próximamente.
                                    </p>
                                </section>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3.5 px-6 py-4 rounded-2xl transition-all duration-300 group ${active
            ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]'
            : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
            }`}
    >
        <div className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
            {icon}
        </div>
        <span className="text-[13px] font-black tracking-tight">{label}</span>
        {active && (
            <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        )}
    </button>
);
