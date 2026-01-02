import React from 'react';
import {
    Users, Play, CircleDollarSign, Star, MessageSquare,
    CheckSquare, Clock, ArrowUpRight, ChevronRight, MoreHorizontal,
    ShoppingBag, GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstructorDashboard() {
    const stats = [
        { label: 'Estudiantes Totales', value: '1,240', trend: '+12%', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
        { label: 'Cursos Activos', value: '8', status: 'Activos', icon: Play, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
        { label: 'Ingresos del Mes', value: '$3,450 USD', trend: '+5%', icon: CircleDollarSign, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
        { label: 'Calificación Promedio', value: '4.8', total: '/5.0', icon: Star, color: 'text-amber-500', bgColor: 'bg-amber-500/10', status: 'General' },
    ];

    const pendingTasks = [
        {
            id: 1,
            type: 'FORUM',
            title: 'Preguntas en foros',
            count: '3 nuevas en \'Intro a React\'',
            icon: MessageSquare,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
            action: 'Responder ahora',
            dotColor: 'bg-orange-500'
        },
        {
            id: 2,
            type: 'REVIEW',
            title: 'Revisiones de tareas',
            count: '5 entregas por calificar',
            icon: CheckSquare,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            action: 'Iniciar revisión',
            dotColor: 'bg-blue-500'
        }
    ];

    const recentActivity = [
        { id: 1, user: 'Juan P.', action: 'compró "Python Avanzado"', time: 'Hace 2 horas', icon: ShoppingBag, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
        { id: 2, user: 'Ana M.', action: 'dejó una reseña de 5 estrellas', subtext: '"¡Excelente curso, muy claro!"', time: 'Hace 5 horas', icon: Star, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
        { id: 3, user: 'Nueva pregunta', action: 'en el foro de "UX Design"', time: 'Hace 1 día', icon: MessageSquare, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
        { id: 4, user: 'Roberto G.', action: 'completó "CSS Grid Master"', time: 'Hace 1 día', icon: GraduationCap, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
        { id: 5, user: 'Maria L.', action: 'compró "React Hooks"', time: 'Hace 2 días', icon: ShoppingBag, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    ];

    const salesData = [
        { date: '01 Oct', value: 40 },
        { date: '08 Oct', value: 65 },
        { date: '15 Oct', value: 45 },
        { date: '22 Oct', value: 85 },
        { date: 'Hoy', value: 100, current: true },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-2">Hola, Instructor</h1>
                    <p className="text-gray-500 font-medium">Aquí tienes el resumen de tu actividad hoy.</p>
                </div>
                <div className="flex items-center space-x-3 bg-white/[0.03] border border-white/5 px-4 py-2.5 rounded-xl">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-bold text-gray-400">24 de Octubre, 2023</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-[#111114] border border-white/5 p-6 rounded-3xl group hover:border-white/10 transition-all relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color}`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    {stat.trend && (
                                        <div className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                            <ArrowUpRight className="w-3 h-3 mr-0.5" />
                                            {stat.trend}
                                        </div>
                                    )}
                                    {stat.status && (
                                        <div className="text-[10px] font-black text-gray-500 tracking-widest uppercase bg-white/5 px-2 py-1 rounded-lg">
                                            {stat.status}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                    <div className="flex items-baseline space-x-1">
                                        <span className="text-2xl font-black text-white">{stat.value}</span>
                                        {stat.total && <span className="text-xs font-bold text-gray-600">{stat.total}</span>}
                                    </div>
                                </div>
                                <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${stat.bgColor} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Pending Tasks */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-white tracking-tight">Tareas Pendientes</h2>
                            <button className="text-sm font-bold text-primary hover:underline">Ver todo</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pendingTasks.map((task) => (
                                <div key={task.id} className="bg-[#111114] border border-white/5 p-6 rounded-3xl flex flex-col space-y-6 relative overflow-hidden group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-2xl ${task.bgColor} ${task.color}`}>
                                                <task.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-white leading-tight">{task.title}</h3>
                                                <p className="text-xs font-medium text-gray-500 mt-1">{task.count}</p>
                                            </div>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${task.dotColor} mt-2 animate-pulse`} />
                                    </div>
                                    <button className="w-full py-3.5 bg-white/[0.03] border border-white/5 rounded-2xl font-black text-xs text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                                        {task.action}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sales Performance */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-white tracking-tight">Rendimiento de Ventas</h2>
                            <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/5 px-3 py-1.5 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <span>Últimos 30 días</span>
                            </div>
                        </div>
                        <div className="bg-[#111114] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="h-64 flex items-end justify-between gap-4 relative z-10">
                                {salesData.map((data, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center group/bar">
                                        <div className="w-full relative flex flex-col items-center">
                                            {data.current && (
                                                <div className="absolute -top-12 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xl shadow-primary/20 animate-bounce">
                                                    $410
                                                </div>
                                            )}
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${data.value}%` }}
                                                transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                                                className={`w-full rounded-t-xl transition-all duration-300 ${data.current
                                                        ? 'bg-gradient-to-t from-primary to-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]'
                                                        : 'bg-white/[0.05] group-hover/bar:bg-white/10'
                                                    }`}
                                            />
                                        </div>
                                        <span className={`text-[10px] font-bold mt-4 uppercase tracking-wider ${data.current ? 'text-white' : 'text-gray-600'}`}>
                                            {data.date}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute inset-x-8 bottom-20 h-px bg-white/5" />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Recent Activity */}
                <div className="space-y-4">
                    <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] flex flex-col h-full shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-xl font-black text-white tracking-tight">Actividad Reciente</h2>
                            <button className="text-gray-500 hover:text-white transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            <div className="divide-y divide-white/5">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="p-6 hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border border-white/5 ${activity.bgColor} ${activity.color}`}>
                                                <activity.icon className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[13px] leading-tight text-gray-300">
                                                    <span className="font-black text-white">{activity.user}</span> {activity.action}
                                                </p>
                                                {activity.subtext && (
                                                    <p className="text-[11px] italic text-gray-600 truncate max-w-[200px]">{activity.subtext}</p>
                                                )}
                                                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">{activity.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 bg-white/[0.01]">
                            <button className="w-full py-4 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] border border-white/5 rounded-2xl hover:bg-white/5 hover:text-white transition-all">
                                Ver todas las notificaciones
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
