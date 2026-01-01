import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
    User, Mail, Github, Linkedin, Twitter, ExternalLink,
    CheckCircle2, XCircle, Award, BookOpen, Clock, Zap,
    ChevronRight, Save, X, Edit3, Globe, Shield, CreditCard,
    LayoutGrid, Settings as SettingsIcon, GraduationCap, PlayCircle, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
    { id: 'resumen', label: 'Resumen', icon: LayoutGrid },
    { id: 'cursos', label: 'Mis Cursos', icon: BookOpen },
    { id: 'certs', label: 'Certificados', icon: Award },
    { id: 'config', label: 'Configuración', icon: SettingsIcon },
];

export default function Profile() {
    const [activeTab, setActiveTab] = useState('resumen');
    const queryClient = useQueryClient();

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await api.get('/users/profile');
            return res.data;
        }
    });

    const updateProfileMutation = useMutation({
        mutationFn: (data: any) => api.patch('/users/profile', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">Cargando perfil...</p>
        </div>
    );

    const user = profile?.user;
    const interests = profile?.interests ? JSON.parse(profile.interests) : [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                <span>Inicio</span>
                <ChevronRight className="w-3 h-3 opacity-50" />
                <span className="text-primary italic">Mi Perfil</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Info Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass rounded-[2.5rem] p-10 border-white/5 bg-[#0c0c0e]/50 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />

                        <div className="relative mb-8 inline-block">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-primary to-purple-500 p-1 group-hover:rotate-6 transition-transform duration-500">
                                <div className="w-full h-full rounded-[2.3rem] overflow-hidden bg-black flex items-center justify-center">
                                    <img
                                        src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-all border-4 border-[#0c0c0e]">
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-10">
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tight">{user?.name}</h1>
                                <p className="text-primary text-xs font-black uppercase tracking-widest mt-1">{profile?.jobTitle || 'Estudiante Full Stack'}</p>
                            </div>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed italic px-4">
                                "{profile?.bio || 'Sin biografía disponible. ¡Cuéntanos algo sobre ti!'}"
                            </p>
                        </div>

                        <div className="flex items-center justify-center space-x-6 mb-10">
                            {[
                                { icon: Github, link: profile?.socialGithub },
                                { icon: Linkedin, link: profile?.socialLinkedin },
                                { icon: Twitter, link: profile?.socialTwitter },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.link || '#'}
                                    className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 ${!social.link && 'opacity-20 pointer-events-none'}`}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>

                        <button className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                            Editar Perfil
                        </button>
                    </div>

                    {/* Verification Card */}
                    <div className="glass rounded-[2rem] p-8 border-white/5 bg-white/[0.02] space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center">
                            <Shield className="w-4 h-4 mr-3 text-primary" />
                            Verificación
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between group cursor-help">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${profile?.isEmailConfirmed ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {profile?.isEmailConfirmed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">Correo Confirmado</span>
                                </div>
                                {!profile?.isEmailConfirmed && <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Verificar</button>}
                            </div>
                            <div className="flex items-center justify-between group cursor-help">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${profile?.isIdentityVerified ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {profile?.isIdentityVerified ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">Identidad Verificada</span>
                                </div>
                                {!profile?.isIdentityVerified && <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Verificar</button>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Content */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Tabs Navigation */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <div className="flex items-center space-x-10">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-3 text-xs font-black uppercase tracking-widest transition-all relative pb-4 ${activeTab === tab.id ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                                        }`}
                                >
                                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary' : 'text-gray-600'}`} />
                                    <span>{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTabProfile"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="min-h-[600px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'resumen' && (
                                <motion.div
                                    key="resumen"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-10"
                                >
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <StatsCard
                                            label="CURSOS"
                                            value="12"
                                            trend="+2 este mes"
                                            trendColor="text-green-500"
                                            icon={<GraduationCap className="w-5 h-5 text-primary" />}
                                        />
                                        <StatsCard
                                            label="HORAS"
                                            value="48h"
                                            trend="de aprendizaje"
                                            trendColor="text-purple-500"
                                            icon={<Clock className="w-5 h-5 text-purple-500" />}
                                        />
                                        <StatsCard
                                            label="PUNTOS XP"
                                            value={profile?.xp?.toLocaleString() || "2,450"}
                                            trend={`Nivel ${profile?.level || 5}`}
                                            trendColor="text-yellow-500"
                                            icon={<Zap className="w-5 h-5 text-yellow-500" />}
                                        />
                                    </div>

                                    {/* En Progreso */}
                                    <section className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-lg font-black text-white tracking-tight uppercase tracking-widest flex items-center">
                                                <div className="w-1.5 h-6 bg-primary rounded-full mr-4" />
                                                En Progreso
                                            </h2>
                                            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Ver todo</button>
                                        </div>
                                        <div className="glass rounded-[2.5rem] bg-[#111114] border border-white/5 flex flex-col md:flex-row overflow-hidden group hover:border-primary/20 transition-all duration-500">
                                            <div className="md:w-56 h-48 md:h-auto overflow-hidden relative">
                                                <img
                                                    src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                    alt="Course"
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <PlayCircle className="w-12 h-12 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1 p-8 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors">Master en React & Redux</h3>
                                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Aprendiendo Hooks Avanzados</p>
                                                    </div>
                                                    <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase text-gray-400">Módulo 4</span>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                        <span className="text-primary">65% Completado</span>
                                                        <span className="text-gray-600">12/18 Lecciones</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <div className="w-[65%] h-full bg-primary" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Intereses */}
                                    <section className="space-y-6">
                                        <h2 className="text-lg font-black text-white tracking-tight uppercase tracking-widest flex items-center">
                                            <div className="w-1.5 h-6 bg-purple-500 rounded-full mr-4" />
                                            Intereses de Aprendizaje
                                        </h2>
                                        <p className="text-xs font-medium text-gray-600">Temas que estás siguiendo activamente.</p>
                                        <div className="flex flex-wrap gap-3 mt-4">
                                            {interests.map((interest: string, i: number) => (
                                                <div key={i} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-default">
                                                    {interest}
                                                </div>
                                            ))}
                                            <button className="px-6 py-3 bg-primary/10 border border-primary/20 rounded-2xl text-xs font-bold text-primary hover:bg-primary transition-all hover:text-white flex items-center space-x-2">
                                                <Plus className="w-3 h-3" />
                                                <span>Agregar</span>
                                            </button>
                                        </div>
                                    </section>

                                    {/* Certificados */}
                                    <section className="space-y-6">
                                        <h2 className="text-lg font-black text-white tracking-tight uppercase tracking-widest flex items-center">
                                            <div className="w-1.5 h-6 bg-yellow-500 rounded-full mr-4" />
                                            Últimos Certificados
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <CertCard title="JavaScript Avanzado" date="Otorgado el 15 Oct, 2023" type="JS" />
                                            <CertCard title="Fundamentos de UI" date="Otorgado el 02 Sep, 2023" type="UI" />
                                        </div>
                                    </section>

                                    {/* Account Data */}
                                    <section className="space-y-8 glass rounded-[2.5rem] p-10 border-white/5 bg-white/[0.02]">
                                        <h2 className="text-lg font-black text-white tracking-tight uppercase tracking-widest">Datos de la Cuenta</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Nombre Completo</label>
                                                <input
                                                    type="text"
                                                    defaultValue={user?.name}
                                                    className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl px-6 text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Correo Electrónico</label>
                                                <input
                                                    type="email"
                                                    defaultValue={user?.email}
                                                    className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl px-6 text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-6 border-t border-white/5">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-white">Perfil Público</p>
                                                <p className="text-[11px] text-gray-500 font-medium">Permitir que otros estudiantes vean tu perfil</p>
                                            </div>
                                            <div className="w-12 h-7 bg-primary rounded-full p-1 flex justify-end">
                                                <div className="w-5 h-5 bg-white rounded-full shadow-lg" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end space-x-4">
                                            <button className="px-8 py-4 text-xs font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Cancelar</button>
                                            <button className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all">Guardar Cambios</button>
                                        </div>
                                    </section>
                                </motion.div>
                            )}

                            {activeTab === 'config' && (
                                <motion.div
                                    key="config"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass rounded-[2.5rem] p-10 border-white/5 space-y-10"
                                >
                                    <div className="space-y-8">
                                        <h2 className="text-2xl font-black text-white tracking-tight">Preferencias del Sistema</h2>

                                        <div className="grid gap-6">
                                            <ConfigItem icon={Globe} title="Idioma de la Plataforma" desc="Español (Latinoamérica)" action="Cambiar" />
                                            <ConfigItem icon={Shield} title="Seguridad de la Cuenta" desc="Autenticación de dos pasos activada" action="Gestionar" />
                                            <ConfigItem icon={CreditCard} title="Método de Pago" desc="Visa terminada en 4242" action="Actualizar" />
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-white/5 space-y-6">
                                        <h3 className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center">
                                            <XCircle className="w-4 h-4 mr-3" />
                                            ZONA DE PELIGRO
                                        </h3>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl border-2 border-dashed border-red-500/20 bg-red-500/5">
                                            <div className="space-y-1">
                                                <p className="font-black text-gray-200">Desactivar mi cuenta</p>
                                                <p className="text-xs text-gray-500">Perderás acceso a todos tus cursos y certificados permanentemente.</p>
                                            </div>
                                            <button className="px-6 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors">
                                                Desactivar Cuenta
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ label, value, trend, trendColor, icon }: any) {
    return (
        <div className="glass rounded-[2rem] p-8 border-white/5 bg-white/[0.03] space-y-4 group hover:border-white/10 transition-all">
            <div className="flex justify-between items-start">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{label}</p>
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {icon}
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-black text-white leading-none">{value}</h3>
                <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${trendColor}`}>{trend}</p>
            </div>
        </div>
    );
}

function CertCard({ title, date, type }: any) {
    return (
        <div className="glass rounded-[2rem] p-8 border-white/5 bg-[#111114] flex items-center justify-between group hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center space-x-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-primary">
                    {type}
                </div>
                <div className="space-y-1">
                    <h4 className="font-black text-white group-hover:text-primary transition-colors">{title}</h4>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{date}</p>
                </div>
            </div>
            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Edit3 className="w-4 h-4 rotate-90" />
            </button>
        </div>
    );
}

function ConfigItem({ icon: Icon, title, desc, action }: any) {
    return (
        <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center space-x-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-white">{title}</h4>
                    <p className="text-xs text-gray-500 font-medium">{desc}</p>
                </div>
            </div>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">{action}</button>
        </div>
    );
}
