import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
    Wallet, DollarSign, TrendingUp, Calendar,
    ArrowUpRight, Download, Eye, Search,
    ChevronDown, CreditCard, Tag, Plus,
    BarChart3, LayoutGrid, Users, MessageSquare, Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstructorFinances() {
    const [timeRange, setTimeRange] = useState('Mes');

    const { data: finances, isLoading } = useQuery({
        queryKey: ['instructor-finances'],
        queryFn: async () => {
            const res = await api.get('/finances/studio');
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const { metrics, trend, courses, transactions } = finances || {
        metrics: { totalEarnings: 0, availableBalance: 0, monthlyIncome: 0, nextPayment: 'N/A' },
        trend: [],
        courses: [],
        transactions: []
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white tracking-tight">Panel Financiero</h1>
                    <p className="text-sm font-medium text-gray-500 max-w-2xl">
                        Gestiona tus ganancias, analiza el rendimiento y solicita retiros.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center space-x-2 px-5 py-3 bg-[#111114] border border-white/5 rounded-2xl text-[10px] font-black text-gray-400 hover:text-white transition-all uppercase tracking-widest">
                        <Download className="w-4 h-4" />
                        <span>Reporte CSV</span>
                    </button>
                    <button className="flex items-center space-x-2 px-6 py-3.5 bg-primary text-white rounded-2xl text-[11px] font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest">
                        <span>Solicitar Retiro</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Ganancias Totales"
                    value={`$${metrics.totalEarnings.toLocaleString()}.00 USD`}
                    trend="+12% vs año pasado"
                    icon={<Wallet className="w-5 h-5 text-blue-500" />}
                />
                <StatCard
                    label="Saldo Disponible"
                    value={`$${metrics.availableBalance.toLocaleString()}.00 USD`}
                    trend="Listo para retirar"
                    icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
                    trendIsNeutral
                />
                <StatCard
                    label="Ingresos este Mes"
                    value={`$${metrics.monthlyIncome.toLocaleString()}.00 USD`}
                    trend="+8% vs mes pasado"
                    icon={<Calendar className="w-5 h-5 text-amber-500" />}
                />
                <StatCard
                    label="Próximo Pago"
                    value={metrics.nextPayment}
                    trend="Procesamiento automático"
                    icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
                    trendIsNeutral
                />
            </div>

            {/* Income Trend Chart */}
            <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-white">Tendencia de Ingresos</h3>
                        <p className="text-xs text-gray-500 font-medium">Resumen de los últimos 6 meses</p>
                    </div>
                    <div className="flex bg-[#0a0a0c] p-1.5 rounded-xl border border-white/5">
                        {['Semana', 'Mes', 'Año'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-400'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-64 mt-10 relative flex items-end justify-between px-2">
                    {/* SVG Line Chart Logic would go here, using a placeholder for visuals */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <div className="w-full h-px bg-white/10" style={{ top: '25%' }} />
                        <div className="w-full h-px bg-white/10" style={{ top: '50%' }} />
                        <div className="w-full h-px bg-white/10" style={{ top: '75%' }} />
                    </div>

                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <motion.path
                            d={`M 0 200 Q 100 150 200 180 T 400 120 T 600 150 T 800 100`}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                        <path
                            d={`M 0 200 Q 100 150 200 180 T 400 120 T 600 150 T 800 100 V 256 H 0 Z`}
                            fill="url(#chartGradient)"
                        />
                    </svg>

                    {trend.map((point: any, i: number) => (
                        <div key={i} className="flex flex-col items-center space-y-4 relative z-10 w-full">
                            <div className="text-[10px] font-black text-gray-700 uppercase tracking-widest mb-1">{point.label}</div>
                            <div className="w-1 h-1 rounded-full bg-primary/20" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Course Performance */}
                <div className="lg:col-span-2 bg-[#111114] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                    <h3 className="text-xl font-black text-white mb-8">Rendimiento por Curso</h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-4 text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] px-4 pb-4 border-b border-white/5">
                            <span className="col-span-1">Curso</span>
                            <span className="text-center">Ventas</span>
                            <span className="text-center">Ingresos</span>
                            <span className="text-right">Reembolsos</span>
                        </div>
                        {courses.map((course: any) => (
                            <div key={course.id} className="grid grid-cols-4 items-center px-4 py-4 hover:bg-white/[0.02] rounded-2xl transition-all group">
                                <span className="text-sm font-black text-white truncate pr-4 group-hover:text-primary">{course.title}</span>
                                <span className="text-center text-sm font-bold text-gray-400">{course.sales}</span>
                                <span className="text-center text-sm font-black text-white">${course.income.toLocaleString()}</span>
                                <span className="text-right text-xs font-bold text-emerald-500">{course.refundRate}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Coupon Analysis */}
                <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-white">Análisis de Cupones</h3>
                        <button className="text-[10px] font-black text-primary hover:text-white uppercase tracking-widest transition-colors">Crear Nuevo</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { code: 'BLACKFRIDAY24', desc: '50% Descuento', uses: 124, revenue: 1850, active: true },
                            { code: 'WELCOME10', desc: '10% Descuento', uses: 45, revenue: 450, active: true },
                            { code: 'SUMMER23', desc: 'Expirado', uses: 89, revenue: 1200, active: false }
                        ].map((coupon, i) => (
                            <div key={i} className={`p-5 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer transition-all ${coupon.active ? 'bg-white/[0.02] hover:border-primary/30' : 'bg-transparent opacity-50 grayscale'}`}>
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl ${coupon.active ? 'bg-primary/10 text-primary' : 'bg-gray-800 text-gray-500'}`}>
                                        <Tag className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-white">{coupon.code}</h4>
                                        <p className="text-[10px] font-bold text-gray-500">{coupon.desc}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-black text-white">{coupon.uses} Usos</p>
                                    <p className="text-[10px] font-bold text-emerald-500">+${coupon.revenue} Gan.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="p-10 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-black text-white">Historial de Transacciones</h3>
                    <div className="relative group max-w-xs w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar transacción..."
                            className="w-full bg-[#0a0a0c] border border-white/5 rounded-[1.25rem] py-3 pl-12 pr-4 text-xs font-bold text-gray-300 focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em]">
                                <th className="px-10 py-6">ID Referencia</th>
                                <th className="px-6 py-6 text-center">Fecha</th>
                                <th className="px-6 py-6 text-center">Concepto</th>
                                <th className="px-6 py-6 text-center">Monto</th>
                                <th className="px-6 py-6 text-center">Estado</th>
                                <th className="px-10 py-6 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.map((trx: any) => (
                                <tr key={trx.id} className="group hover:bg-white/[0.01] transition-all">
                                    <td className="px-10 py-6 text-xs font-black text-gray-500 uppercase tracking-widest">{trx.id}</td>
                                    <td className="px-6 py-6 text-center text-sm font-bold text-gray-400">{trx.date}</td>
                                    <td className="px-6 py-6 text-center text-sm font-black text-white">{trx.concept}</td>
                                    <td className="px-6 py-6 text-center text-sm font-bold text-white">${trx.amount.toLocaleString()}.00</td>
                                    <td className="px-6 py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${trx.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {trx.status === 'PAID' ? 'Pagado' : 'Procesando'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button className="p-2.5 text-gray-600 hover:text-white hover:bg-white/5 transition-all">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ label, value, trend, icon, trendIsNeutral }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-[#111114] border border-white/5 p-8 rounded-[2.5rem] group hover:border-white/10 transition-all shadow-xl"
    >
        <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">{label}</p>
                <p className="text-4xl font-extrabold text-white tracking-tighter">{value}</p>
            </div>
            <div className={`p-4 bg-white/[0.02] border border-white/5 rounded-[1.25rem] transition-all transform group-hover:scale-110 shadow-inner group-hover:shadow-primary/5`}>
                {icon}
            </div>
        </div>
        <div className={`flex items-center text-[11px] font-black ${trendIsNeutral ? 'text-gray-500' : 'text-emerald-500'}`}>
            {!trendIsNeutral && <ArrowUpRight className="w-3.5 h-3.5 mr-1.5" />}
            <span className="uppercase tracking-widest">{trend}</span>
        </div>
    </motion.div>
);
