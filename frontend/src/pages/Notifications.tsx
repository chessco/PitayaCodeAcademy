import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
    Bell, CheckCircle2, Search, Filter, Settings,
    Trash2, MessageCircle, PlayCircle, Info, Trophy,
    Percent, ChevronRight, MoreHorizontal, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NOTIFICATION_THEMES: Record<string, { icon: any, color: string, label: string, bg: string }> = {
    FORUM: { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'RESPUESTA EN FORO' },
    COURSE: { icon: PlayCircle, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'NUEVA LECCIÓN' },
    SYSTEM: { icon: Info, color: 'text-gray-400', bg: 'bg-gray-400/10', label: 'SISTEMA' },
    ACHIEVEMENT: { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'LOGRO' },
    PROMOTION: { icon: Percent, color: 'text-green-500', bg: 'bg-green-500/10', label: 'OFERTA ESPECIAL' },
};

export default function Notifications() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('Todas');
    const [searchTerm, setSearchTerm] = useState('');

    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications', activeTab],
        queryFn: async () => {
            let filterString = '';
            if (activeTab === 'No leídas') filterString = 'unread';
            if (activeTab === 'Sistema') filterString = 'SYSTEM';
            // "Menciones" could be forum mentions, for now mapped to FORUM for demo purposes
            if (activeTab === 'Menciones') filterString = 'FORUM';

            const res = await api.get(`/notifications?filter=${filterString}`);
            return res.data;
        }
    });

    const markReadMutation = useMutation({
        mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
    });

    const markAllReadMutation = useMutation({
        mutationFn: () => api.post('/notifications/read-all'),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
    });

    const filteredNotifications = notifications?.filter((n: any) =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;
    const todayCount = notifications?.filter((n: any) => {
        const date = new Date(n.createdAt);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }).length || 0;

    const formatRelativeTime = (dateString: string) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInMs = now.getTime() - past.getTime();
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMins < 60) return `Hace ${diffInMins} minutos`;
        if (diffInHours < 24) return `Hace ${diffInHours} horas`;
        return `Hace ${diffInDays} días`;
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">Cargando notificaciones...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative group flex-1 max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar notificaciones..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 pl-12 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl w-full text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-gray-500">
                        <Bell className="w-4 h-4" />
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    </div>
                    <button
                        onClick={() => markAllReadMutation.mutate()}
                        className="h-10 px-6 bg-white/5 border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        Marcar todo leído
                    </button>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                <span>Inicio</span>
                <ChevronRight className="w-3 h-3 opacity-50" />
                <span className="text-primary italic">Centro de Notificaciones</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Hero Stats Card */}
                    <div className="glass rounded-[2rem] p-10 border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-transparent relative overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                            <div className="flex items-center space-x-8">
                                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                    <Bell className="w-8 h-8 text-white fill-white/20" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">TU ACTIVIDAD</p>
                                    <h1 className="text-4xl font-black tracking-tight">Centro de Notificaciones</h1>
                                    <p className="text-xs text-gray-500 font-medium max-w-md">Mantente al día con las últimas actualizaciones de tus cursos, respuestas en foros y anuncios importantes de la academia.</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-10 pr-6">
                                <div className="text-center">
                                    <p className="text-3xl font-black">{unreadCount}</p>
                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">No leídas</p>
                                </div>
                                <div className="w-px h-10 bg-white/5" />
                                <div className="text-center">
                                    <p className="text-3xl font-black">{todayCount}</p>
                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Hoy</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-col space-y-6">
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                            <div className="flex items-center space-x-8">
                                {['Todas', 'No leídas', 'Menciones', 'Sistema'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`text-xs font-black uppercase tracking-widest transition-all relative pb-4 ${activeTab === tab ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                                            }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <button className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 hover:text-white transition-colors">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Marcar visibles como leídas</span>
                            </button>
                        </div>

                        {/* Notifications List */}
                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {filteredNotifications?.map((n: any) => {
                                    const theme = NOTIFICATION_THEMES[n.type] || NOTIFICATION_THEMES.SYSTEM;
                                    const Icon = theme.icon;
                                    return (
                                        <motion.div
                                            key={n.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className={`relative group p-6 rounded-[2rem] border transition-all duration-300 ${!n.isRead
                                                    ? 'bg-white/[0.03] border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                                                    : 'bg-transparent border-white/5 opacity-60 grayscale-[0.5]'
                                                }`}
                                        >
                                            <div className="flex items-start space-x-6">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 ${theme.bg}`}>
                                                    <Icon className={`w-6 h-6 ${theme.color}`} />
                                                </div>

                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${theme.color}`}>
                                                                {theme.label}
                                                            </span>
                                                            {!n.isRead && (
                                                                <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Nuevo</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            <p className="text-[10px] font-bold text-gray-600 italic">{formatRelativeTime(n.createdAt)}</p>
                                                            {!n.isRead && (
                                                                <button
                                                                    onClick={() => markReadMutation.mutate(n.id)}
                                                                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <h3 className="text-lg font-black tracking-tight text-white">{n.title}</h3>
                                                    <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">{n.content}</p>

                                                    {n.link && (
                                                        <div className="pt-2">
                                                            <a
                                                                href={n.link}
                                                                className={`inline-flex items-center text-[11px] font-black uppercase tracking-widest group/link ${theme.color}`}
                                                            >
                                                                Continuar <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/link:translate-x-1" />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Read status indicator bar */}
                                            {!n.isRead && (
                                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 rounded-r-full ${theme.bg.replace('10', '50')}`} />
                                            )}
                                        </motion.div>
                                    );
                                })}

                                {filteredNotifications?.length === 0 && (
                                    <div className="py-32 text-center rounded-[3rem] border-2 border-dashed border-white/5">
                                        <Bell className="w-16 h-16 text-gray-800 mx-auto mb-6 opacity-20" />
                                        <h3 className="text-xl font-black text-gray-500">No hay notificaciones</h3>
                                        <p className="text-xs text-gray-700 font-bold uppercase tracking-widest mt-2 italic">Estás al día por ahora</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="pt-10 flex justify-center">
                            <button className="flex items-center space-x-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-white transition-colors group">
                                <motion.span
                                    animate={{ y: [0, 4, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    Cargar notificaciones anteriores
                                </motion.span>
                                <ChevronRight className="w-4 h-4 rotate-90" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Filters / Preferences */}
                <div className="space-y-8">
                    {/* Source Filter */}
                    <div className="glass rounded-[2rem] p-8 border-white/5 bg-white/[0.02]">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8 flex items-center">
                            <Filter className="w-4 h-4 mr-3 text-primary" />
                            FILTRAR POR ORIGEN
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Cursos y Lecciones', checked: true },
                                { label: 'Foros y Comunidad', checked: true },
                                { label: 'Anuncios del Sistema', checked: true },
                                { label: 'Logros y Certificados', checked: true }
                            ].map((item, i) => (
                                <label key={i} className="flex items-center space-x-4 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${item.checked ? 'bg-primary border-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/10 group-hover:border-white/30'
                                        }`}>
                                        {item.checked && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="glass rounded-[2rem] p-8 border-white/5 bg-white/[0.02]">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8 flex items-center">
                            <Settings className="w-4 h-4 mr-3 text-primary" />
                            PREFERENCIAS
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-gray-300">Notificaciones por email</p>
                                    <p className="text-[9px] text-gray-600">Recibe un aviso por cada alerta</p>
                                </div>
                                <div className="w-10 h-6 bg-primary rounded-full p-1 flex justify-end">
                                    <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between opacity-40">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-gray-300">Resumen semanal</p>
                                    <p className="text-[9px] text-gray-600">Cada lunes por la mañana</p>
                                </div>
                                <div className="w-10 h-6 bg-white/10 rounded-full p-1 flex justify-start">
                                    <div className="w-4 h-4 bg-gray-500 rounded-full shadow-lg" />
                                </div>
                            </div>
                            <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline pt-2">
                                Configuración avanzada
                            </button>
                        </div>
                    </div>

                    {/* History Cleanup */}
                    <div className="glass rounded-[2rem] p-8 border-white/5 bg-white/[0.02] text-center space-y-4">
                        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto">
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400">¿Demasiadas notificaciones antiguas?</p>
                            <button className="w-full h-10 mt-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                Limpiar todo el historial
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
