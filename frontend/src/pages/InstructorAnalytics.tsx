import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
    BarChart3, TrendingUp, Users, Download, Calendar,
    ArrowUpRight, ArrowDownRight, CircleDollarSign,
    GraduationCap, Percent, Tag, ChevronDown, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstructorAnalytics() {
    const [timeRange, setTimeRange] = useState('Últimos 30 días');

    const { data: analytics, isLoading } = useQuery({
        queryKey: ['studio-analytics'],
        queryFn: async () => {
            const res = await api.get('/analytics/studio');
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="space-y-8 animate-pulse">
            <div className="flex justify-between items-end">
                <div className="space-y-3">
                    <div className="h-10 w-64 bg-white/5 rounded-xl" />
                    <div className="h-4 w-96 bg-white/5 rounded-lg" />
                </div>
                <div className="h-12 w-48 bg-white/5 rounded-2xl" />
            </div>
            <div className="grid grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white/5 rounded-[2rem]" />)}
            </div>
            <div className="h-[400px] bg-white/5 rounded-[2.5rem]" />
        </div>
    );

    const { metrics, participation, dropoutLessons, couponPerformance } = analytics;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                        <span>Panel</span>
                        <ChevronDown className="w-3 h-3 -rotate-90 opacity-50" />
                        <span className="text-white">Analíticas del Curso</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Analíticas de Rendimiento</h1>
                    <p className="text-sm font-medium text-gray-500 max-w-2xl">
                        Visión general del rendimiento, ingresos y participación estudiantil de tus cursos.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <button className="flex items-center space-x-3 px-5 py-3.5 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-gray-300 hover:bg-white/10 transition-all">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{timeRange}</span>
                            <ChevronDown className="w-4 h-4 opacity-50" />
                        </button>
                    </div>
                    <button className="flex items-center space-x-3 px-6 py-3.5 bg-primary text-white rounded-2xl text-xs font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest">
                        <Download className="w-4 h-4" />
                        <span>Exportar Reporte</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Ingresos Totales', value: `$${metrics.totalRevenue.toLocaleString()}`, trend: '+12%', sub: 'vs mes anterior', icon: CircleDollarSign, color: 'text-emerald-500' },
                    { label: 'Estudiantes Activos', value: metrics.activeStudents.toLocaleString(), trend: '+5%', sub: 'nuevas inscripciones', icon: Users, color: 'text-blue-500' },
                    { label: 'Tasa de Finalización', value: `${metrics.avgCompletion}%`, trend: '+2%', sub: 'mejora de retención', icon: Percent, color: 'text-amber-500' },
                    { label: 'Rating Promedio', value: metrics.avgRating.toString(), trend: '0%', sub: 'estable', icon: GraduationCap, color: 'text-purple-500' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#111114] border border-white/5 p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <stat.icon size={80} />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{stat.label}</p>
                            <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                            <div className="flex items-center space-x-2">
                                <div className={`flex items-center space-x-1 text-[11px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-gray-500'}`}>
                                    {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    <span>{stat.trend}</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{stat.sub}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Participation Chart */}
            <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-white">Participación de Estudiantes</h3>
                        <p className="text-xs font-medium text-gray-500">Lecciones completadas por día</p>
                    </div>
                    <select className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-black text-gray-400 focus:outline-none focus:border-primary uppercase tracking-widest cursor-pointer">
                        <option>Todos los cursos</option>
                    </select>
                </div>

                <div className="h-[300px] w-full flex items-end justify-between px-2 gap-2">
                    {participation.map((day: any, i: number) => (
                        <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(day.value / 60) * 100}%` }}
                                transition={{ delay: i * 0.02, duration: 1, ease: "easeOut" }}
                                className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary transition-all relative"
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 z-10">
                                    {day.value} lecciones
                                </div>
                            </motion.div>
                            {i % 7 === 0 && (
                                <span className="text-[9px] font-black text-gray-600 uppercase mt-4 absolute -bottom-6">{day.label}</span>
                            )}
                        </div>
                    ))}
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Lecciones completadas</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Dropout Lessons */}
                <div className="lg:col-span-5 bg-[#111114] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-amber-500/10 rounded-2xl">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-white">Lecciones con mayor abandono</h3>
                            <p className="text-xs font-medium text-gray-600 leading-relaxed">Estas lecciones tienen una tasa de finalización por debajo del promedio.</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {dropoutLessons.map((lesson: any, i: number) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-white">{lesson.module}</h4>
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Curso: <span className="text-primary">{lesson.course}</span></p>
                                    </div>
                                    <span className="text-[10px] font-black text-red-400 bg-red-400/10 px-2.5 py-1 rounded-lg uppercase tracking-widest">{lesson.abandonment}% Abandono</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${100 - lesson.abandonment}%` }}
                                            transition={{ duration: 1.5, delay: i * 0.2 }}
                                            className="h-full bg-red-400 rounded-full"
                                        />
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-tight">{lesson.studentsAffected} Estudiantes afectados</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Coupon Performance */}
                <div className="lg:col-span-7 bg-[#111114] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Tag className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-white">Rendimiento de Cupones</h3>
                            <p className="text-xs font-medium text-gray-600 leading-relaxed">Uso reciente de códigos de descuento.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] border-b border-white/5">
                                    <th className="pb-4">Código</th>
                                    <th className="pb-4">Descuento</th>
                                    <th className="pb-4">Usos</th>
                                    <th className="pb-4 text-right">Ingresos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {couponPerformance.map((coupon: any, i: number) => (
                                    <tr key={i} className="group">
                                        <td className="py-5">
                                            <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-black text-white group-hover:border-primary/30 transition-colors">{coupon.code}</span>
                                        </td>
                                        <td className="py-5 font-black text-emerald-500 text-xs">{coupon.discount}</td>
                                        <td className="py-5 font-black text-white text-xs">{coupon.uses}</td>
                                        <td className="py-5 text-right font-black text-white text-xs">${coupon.revenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
