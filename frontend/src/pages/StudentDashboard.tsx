import React from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen, Clock, Zap, PlayCircle, Star,
    Bell, MessageCircle, Trophy, ChevronRight,
    Search, Filter, CheckCircle2, Flame,
    LayoutGrid, User, Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function StudentDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const userName = user?.name?.split(' ')[0] || 'Alex';

    const { data: notifications } = useQuery({
        queryKey: ['notifications', 'latest'],
        queryFn: async () => {
            const res = await api.get('/notifications?limit=4'); // Backend supports filter, I might need to add limit or just slice
            return res.data;
        }
    });

    const displayNotifications = notifications?.slice(0, 4) || [];

    return (
        <div className="space-y-10 pb-20">
            {/* Header / Search Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-2xl">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar cursos, lecciones o temas..."
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium text-white focus:outline-none focus:border-primary/30 transition-all"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <button className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl text-gray-500 hover:text-white transition-all relative">
                        <Bell className="w-5 h-5" />
                        <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-[#09090b]" />
                    </button>
                    <Link
                        to="/"
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs hover:scale-[1.02] transition-all shadow-xl shadow-primary/20"
                    >
                        Explorar Cursos
                    </Link>
                </div>
            </div>

            {/* Welcome Section */}
            <div>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black text-white tracking-tight flex items-center gap-3"
                >
                    Hola, {userName}. 👋
                </motion.h1>
                <p className="text-gray-500 font-medium mt-2">¡Es un buen día para aprender algo nuevo!</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-12">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            icon={<CheckCircle2 className="w-5 h-5 text-green-400" />}
                            label="Cursos Completados"
                            value="12"
                            trend="+2 este mes"
                            trendColor="text-green-400"
                        />
                        <StatCard
                            icon={<Clock className="w-5 h-5 text-purple-400" />}
                            label="Horas de Estudio"
                            value="48h"
                            trend="Racha de 3 días"
                            trendColor="text-purple-400"
                        />
                        <StatCard
                            icon={<Flame className="w-5 h-5 text-orange-400" />}
                            label="Puntos Totales"
                            value="1,250"
                            trend="Nivel 5"
                            trendColor="text-orange-400"
                        />
                    </div>

                    {/* Continue Learning Featured */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-black text-white tracking-tight uppercase tracking-widest text-[11px] text-gray-500">Continuar Aprendiendo</h2>
                        <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#111114] border border-white/5 flex flex-col md:flex-row items-stretch hover:border-primary/30 transition-all duration-500">
                            <div className="md:w-2/5 relative overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop"
                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    alt="Course"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full">React JS</span>
                                </div>
                            </div>
                            <div className="flex-1 p-8 flex flex-col justify-between space-y-6">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-2xl font-black text-white leading-tight">Desarrollo Frontend Avanzado</h3>
                                        <span className="text-[10px] font-bold text-gray-500">4h 20m restantes</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Lección 4: Gestión de Estado con Redux Toolkit</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black">
                                        <span className="text-primary uppercase tracking-widest">45% Completado</span>
                                        <span className="text-gray-500">12/26 Lecciones</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '45%' }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-4 pt-2">
                                        <button className="flex-1 flex items-center justify-center space-x-3 px-8 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:scale-[1.03] transition-all shadow-xl shadow-primary/20">
                                            <PlayCircle className="w-5 h-5" />
                                            <span>Reanudar Lección</span>
                                        </button>
                                        <button
                                            onClick={() => navigate('/notifications')}
                                            className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all relative"
                                        >
                                            <Bell className="w-5 h-5" />
                                            <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-[#111114]" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Active Courses Grid */}
                    <section className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-black text-white tracking-tight uppercase tracking-widest text-[11px] text-gray-500">Mis Cursos Activos</h2>
                            <Link to="/my-courses" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Ver todos</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MiniCourseCard
                                title="Python para Data Science"
                                lastAccess="Último acceso: ayer"
                                progress={75}
                                color="bg-green-500"
                                icon="🐍"
                            />
                            <MiniCourseCard
                                title="Diseño UI/UX Moderno"
                                lastAccess="Último acceso: hace 3 días"
                                progress={20}
                                color="bg-orange-500"
                                icon="🎨"
                            />
                        </div>
                    </section>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-10">

                    {/* Notifications Block */}
                    <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black text-white">Notificaciones</h3>
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {displayNotifications.map((n: any) => (
                                <NotificationItem
                                    key={n.id}
                                    icon={<Bell className="w-4 h-4 text-primary" />}
                                    text={n.title}
                                    time={new Date(n.createdAt).toLocaleDateString()}
                                    onClick={() => navigate('/notifications')}
                                />
                            ))}
                            {displayNotifications.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">No tienes notificaciones recientes.</p>
                            )}
                        </div>

                        <button
                            onClick={() => navigate('/notifications')}
                            className="w-full py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors border-t border-white/5 mt-4"
                        >
                            Ver todas las notificaciones
                        </button>
                    </div>

                    {/* Weekly Challenge */}
                    <div className="bg-gradient-to-br from-primary/20 to-purple-500/10 border border-primary/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
                        <div className="relative z-10 space-y-4">
                            <h4 className="text-lg font-black text-white">Reto Semanal</h4>
                            <p className="text-xs font-medium text-gray-400 leading-relaxed">Completa 3 lecciones de JavaScript Avanzado para ganar una insignia exclusiva.</p>
                            <div className="pt-4 flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#111114] bg-gray-800 overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="Avatar" />
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-[#111114] bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary">+42</div>
                                </div>
                                <button className="px-4 py-2 bg-white text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                                    Participar
                                </button>
                            </div>
                        </div>
                        <Flame className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                    </div>

                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, trend, trendColor }: any) {
    return (
        <div className="bg-[#111114] border border-white/5 p-8 rounded-[2rem] space-y-4 group hover:border-white/10 transition-all">
            <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${trendColor}`}>{trend}</span>
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{label}</p>
                <h3 className="text-3xl font-black text-white mt-1">{value}</h3>
            </div>
        </div>
    );
}

function MiniCourseCard({ title, lastAccess, progress, color, icon }: any) {
    return (
        <div className="bg-[#111114] border border-white/5 p-6 rounded-[2rem] group hover:border-white/10 transition-all">
            <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl">
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm">{title}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">{lastAccess}</p>
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-600">Progreso</span>
                    <span className="text-white">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={`h-full ${color}`}
                    />
                </div>
            </div>
        </div>
    );
}

function NotificationItem({ icon, text, time, onClick }: any) {
    return (
        <div className="flex gap-4 group cursor-pointer" onClick={onClick}>
            <div className="mt-1 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-[13px] font-medium text-gray-400 group-hover:text-white transition-colors leading-tight line-clamp-2">{text}</p>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{time}</p>
            </div>
        </div>
    );
}
