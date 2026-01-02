import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
    FileBarChart, Users, TrendingUp, Star,
    Download, Filter, ChevronDown, Search,
    Plus, Calendar, DollarSign, PieChart,
    ChevronRight, ChevronLeft, MoreHorizontal,
    PlayCircle, CheckCircle, GraduationCap, Tag, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstructorReports() {
    const [reportType, setReportType] = useState('Sales');
    const [dateRange, setDateRange] = useState({ start: '2023-10-01', end: '2023-10-31' });

    const { data: summary, isLoading: loadingSummary } = useQuery({
        queryKey: ['reports-summary'],
        queryFn: async () => (await api.get('/reports/studio/summary')).data
    });

    const { data: income, isLoading: loadingIncome } = useQuery({
        queryKey: ['reports-income'],
        queryFn: async () => (await api.get('/reports/studio/income')).data
    });

    const { data: topCourses, isLoading: loadingTop } = useQuery({
        queryKey: ['reports-top-courses'],
        queryFn: async () => (await api.get('/reports/studio/courses/top')).data
    });

    const { data: transactions, isLoading: loadingTrx } = useQuery({
        queryKey: ['reports-transactions'],
        queryFn: async () => (await api.get('/reports/studio/transactions')).data
    });

    if (loadingSummary || loadingIncome || loadingTop || loadingTrx) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const reportTypes = [
        { id: 'Sales', label: 'Ventas por Curso', sub: 'Ingresos y transacciones', icon: DollarSign },
        { id: 'Progress', label: 'Progreso Estudiantes', sub: 'Tasas de finalización', icon: TrendingUp },
        { id: 'Coupons', label: 'Cupones', sub: 'Efectividad de descuentos', icon: Tag },
        { id: 'Retention', label: 'Retención', sub: 'Participación activa', icon: GraduationCap },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                        <span>Instructor</span>
                        <ChevronRight className="w-3 h-3 opacity-50" />
                        <span className="text-white">Reportes</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Reportes del Instructor</h1>
                    <p className="text-sm font-medium text-gray-500 max-w-2xl">
                        Genere análisis detallados sobre el rendimiento de sus cursos, progreso de estudiantes y métricas financieras.
                    </p>
                </div>
                <button className="flex items-center space-x-3 px-6 py-3.5 bg-white/5 border border-white/10 text-gray-400 rounded-2xl text-[11px] font-black hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">
                    <Download className="w-4 h-4" />
                    <span>Exportar Todo</span>
                </button>
            </div>

            {/* Config Panel */}
            <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                <div className="flex items-center space-x-3 mb-10 text-primary">
                    <Filter className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-black text-white">Configuración del Reporte</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {reportTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setReportType(type.id)}
                            className={`p-6 rounded-[1.5rem] text-left border transition-all space-y-4 group ${reportType === type.id ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                        >
                            <div className={`p-3 rounded-xl w-fit transition-all ${reportType === type.id ? 'bg-primary text-white' : 'bg-white/5 text-gray-500 group-hover:text-white'}`}>
                                <type.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white">{type.label}</h4>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{type.sub}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-end gap-6 pt-10 border-t border-white/5">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">Fecha de Inicio</label>
                        <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary" />
                            <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-gray-300 focus:outline-none focus:border-primary/50" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">Fecha de Fin</label>
                        <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary" />
                            <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-gray-300 focus:outline-none focus:border-primary/50" />
                        </div>
                    </div>
                    <div className="space-y-3 flex-1 min-w-[200px]">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">Filtrar por Curso</label>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <select className="w-full appearance-none bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-10 text-xs font-bold text-gray-300 focus:outline-none focus:border-primary/50">
                                <option>Todos los Cursos</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                    <button className="flex items-center space-x-3 px-10 py-3.5 bg-primary text-white rounded-xl text-xs font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest whitespace-nowrap">
                        <FileBarChart className="w-4 h-4" />
                        <span>Generar</span>
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="Ventas Totales"
                    value={`$${summary.totalSales.toLocaleString()}.00`}
                    trend="+15.3% vs mes anterior"
                    icon={<DollarSign className="w-5 h-5 text-blue-500" />}
                />
                <MetricCard
                    label="Estudiantes Nuevos"
                    value={summary.newStudents.toString()}
                    trend="+4.2% vs mes anterior"
                    icon={<Users className="w-5 h-5 text-purple-500" />}
                />
                <MetricCard
                    label="Tasa de Finalización"
                    value={`${summary.completionRate}%`}
                    trend="-2.1% vs mes anterior"
                    trendColor="red"
                    icon={<PlayCircle className="w-5 h-5 text-amber-500" />}
                />
                <MetricCard
                    label="Valoración Prom."
                    value={`${summary.avgRating}/5.0`}
                    trend="Basado en 45 reseñas"
                    trendIsNeutral
                    icon={<Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-[#111114] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden text-clip">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-white">Rendimiento de Ingresos</h3>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Últimos 30 días</span>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-4 mt-10 px-2">
                        {income.map((week: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center space-y-4 group">
                                <div className="h-full w-full relative flex items-end justify-center">
                                    <AnimatePresence>
                                        {week.isCurrent && (
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="absolute -top-10 px-3 py-1 bg-white text-[#111114] rounded-lg text-[9px] font-black z-10 shadow-xl"
                                            >
                                                ${week.value}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(week.value / 4000) * 100}%` }}
                                        className={`w-full max-w-[40px] rounded-t-xl transition-all duration-1000 ${week.isCurrent ? 'bg-primary shadow-[0_0_25px_rgba(59,130,246,0.3)]' : 'bg-white/5 group-hover:bg-white/10'}`}
                                    />
                                </div>
                                <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{week.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                    <h3 className="text-xl font-black text-white mb-8">Cursos Top Ventas</h3>
                    <div className="space-y-6">
                        {topCourses.map((course: any, i: number) => (
                            <div key={i} className="flex items-center space-x-4 group p-2 hover:bg-white/[0.02] rounded-2xl transition-all">
                                <div className="w-14 h-14 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-primary/30 transition-all">
                                    <img src={course.thumbnail || `https://api.dicebear.com/7.x/abstract/svg?seed=${course.id}`} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-black text-white truncate group-hover:text-primary transition-colors">{course.title}</h4>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{course.sales} ventas externas</p>
                                </div>
                                <span className="text-sm font-black text-emerald-500 tabular-nums">${course.revenue.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-4 text-[10px] font-black text-primary hover:text-white uppercase tracking-widest underline decoration-2 underline-offset-8 decoration-primary/20 hover:decoration-white/20 transition-all">
                        Ver todos los cursos
                    </button>
                </div>
            </div>

            {/* Transaction List */}
            <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="p-10 border-b border-white/5 flex flex-wrap items-center justify-between gap-6">
                    <h3 className="text-xl font-black text-white">Detalle de Transacciones</h3>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center space-x-2 px-5 py-3 bg-[#0a0a0c] border border-white/5 rounded-2xl text-[10px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-widest">
                            <Filter className="w-3.5 h-3.5" />
                            <span>Filtrar</span>
                        </button>
                        <button className="flex items-center space-x-2 px-5 py-3 bg-[#0a0a0c] border border-white/5 rounded-2xl text-[10px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-widest">
                            <Download className="w-3.5 h-3.5" />
                            <span>CSV</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em]">
                                <th className="px-10 py-6">ID transacción</th>
                                <th className="px-6 py-6">Estudiante</th>
                                <th className="px-6 py-6">Curso</th>
                                <th className="px-6 py-6 text-center">Fecha</th>
                                <th className="px-6 py-6 text-center">Monto</th>
                                <th className="px-10 py-6 text-right">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.map((trx: any) => (
                                <tr key={trx.id} className="group hover:bg-white/[0.01] transition-all">
                                    <td className="px-10 py-6 text-[11px] font-black text-gray-500 uppercase tracking-widest">{trx.id}</td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center text-[10px] font-black text-primary">
                                                {trx.student.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-xs font-black text-white">{trx.student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="text-xs font-bold text-gray-400">{trx.course}</span>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <span className="text-[10px] font-black text-gray-600 uppercase">{trx.date}</span>
                                    </td>
                                    <td className="px-6 py-6 text-center text-sm font-black text-white">${trx.amount.toFixed(2)}</td>
                                    <td className="px-10 py-6 text-right">
                                        <span className={`inline-flex px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500`}>
                                            ● Completado
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.01]">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Mostrando 1-4 de 128 resultados</p>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-500 hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></button>
                        {[1, 2, 3].map((p) => (
                            <button key={p} className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${p === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-gray-500 hover:text-white'}`}>{p}</button>
                        ))}
                        <button className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-500 hover:text-white transition-all"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const MetricCard = ({ label, value, trend, icon, trendColor = 'emerald', trendIsNeutral = false }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-[#111114] border border-white/5 p-8 rounded-[2.5rem] group hover:border-white/10 transition-all shadow-xl"
    >
        <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">{label}</p>
                <p className="text-4xl font-extrabold text-white tracking-tighter tabular-nums">{value}</p>
            </div>
            <div className={`p-4 bg-white/[0.02] border border-white/5 rounded-[1.25rem] transition-all transform group-hover:scale-110 shadow-inner`}>
                {icon}
            </div>
        </div>
        <div className={`flex items-center text-[10px] font-black uppercase tracking-widest ${trendIsNeutral ? 'text-gray-500' : (trendColor === 'red' ? 'text-red-500' : 'text-emerald-500')}`}>
            {!trendIsNeutral && <ArrowUpRight className={`w-3.5 h-3.5 mr-1.5 ${trendColor === 'red' && 'rotate-90'}`} />}
            {trend}
        </div>
    </motion.div>
);
