import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
    Plus, Search, Filter, HelpCircle,
    Ticket, ShoppingBag, PiggyBank, Copy,
    ChevronDown, Edit2, Trash2, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Coupons() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: coupons, isLoading } = useQuery({
        queryKey: ['coupons'],
        queryFn: async () => {
            const res = await api.get('/coupons');
            return res.data;
        },
    });

    if (isLoading) return (
        <div className="space-y-8 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="h-10 w-48 bg-white/5 rounded-xl" />
                <div className="h-12 w-32 bg-white/5 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-32 glass rounded-3xl" />)}
            </div>
            <div className="h-[400px] glass rounded-[2.5rem]" />
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Cupones de Descuento</h1>
                    <p className="text-[13px] text-gray-500 font-medium">Gestiona los códigos promocionales para cursos y campañas de marketing.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                        <HelpCircle className="w-4 h-4" />
                        <span>Ayuda</span>
                    </button>
                    <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" /> CREAR NUEVO CUPÓN
                    </button>
                </div>
            </div>

            {/* Breadcrumbs (Mock for design) */}
            <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                <span className="hover:text-primary cursor-pointer">Inicio</span>
                <span>/</span>
                <span className="hover:text-primary cursor-pointer">Marketing</span>
                <span>/</span>
                <span className="text-white">Cupones</span>
            </nav>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<Ticket className="w-5 h-5 text-emerald-400" />}
                    label="CUPONES ACTIVOS"
                    value="12"
                    bgColor="bg-emerald-500/10"
                />
                <StatCard
                    icon={<ShoppingBag className="w-5 h-5 text-orange-400" />}
                    label="TOTAL CANJES"
                    value="1,438"
                    bgColor="bg-orange-500/10"
                />
                <StatCard
                    icon={<PiggyBank className="w-5 h-5 text-blue-400" />}
                    label="AHORRO TOTAL"
                    value="$8.5k"
                    bgColor="bg-blue-500/10"
                />
            </div>

            {/* Filter & Table Container */}
            <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar por código..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs font-medium text-gray-300 focus:outline-none focus:border-primary/50 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-5 py-3 bg-[#1a1a1f] border border-white/5 rounded-xl text-[11px] font-bold text-gray-400 hover:text-white transition-all">
                        <span>Todos los estados</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Código</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest text-center">Tipo & Valor</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest text-center">Cursos Asociados</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest text-center">Canjes</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest text-center">Validez</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest text-center">Estado</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {coupons?.map((coupon: any) => (
                                <tr key={coupon.id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-black text-white tracking-widest group-hover:border-primary/30 transition-colors uppercase">
                                                {coupon.code}
                                            </div>
                                            <button className="p-2 text-gray-700 hover:text-gray-400 transition-colors">
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-white">
                                                {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% Descuento` : `$${coupon.discountValue} USD`}
                                            </p>
                                            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                                                {coupon.discountType === 'PERCENTAGE' ? 'Porcentaje' : 'Monto Fijo'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-xs font-bold text-gray-400">
                                            {coupon.courses?.length > 0 ? (coupon.courses.length === 1 ? coupon.courses[0].title : `${coupon.courses.length} cursos`) : 'Todos los cursos'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col items-center space-y-2 max-w-[120px] mx-auto">
                                            <div className="flex justify-between w-full text-[10px] font-black">
                                                <span className="text-primary">{coupon.usedCount}</span>
                                                <span className="text-gray-700">/ {coupon.maxUses || '∞'}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                                    style={{ width: `${coupon.maxUses ? (coupon.usedCount / coupon.maxUses) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center space-y-1 text-gray-500 font-bold">
                                            <div className="flex items-center space-x-2 text-[10px]">
                                                <Calendar className="w-3 h-3" />
                                                <span>Jun 1, 2024</span>
                                            </div>
                                            <span className="text-[9px] uppercase tracking-tighter opacity-50">hasta Ago 31, 2024</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <StatusBadge status={coupon.usedCount >= (coupon.maxUses || Infinity) ? 'Agotado' : 'Activo'} />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-2.5 bg-white/5 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 bg-white/5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[11px] font-bold text-gray-600 tracking-wide uppercase">Mostrando {coupons?.length || 0} de 12 cupones</p>
                    <div className="flex items-center space-x-3">
                        <button className="px-5 py-2.5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white hover:bg-white/5 transition-all">Anterior</button>
                        <button className="px-5 py-2.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ icon, label, value, bgColor }: any) => (
    <div className="bg-[#111114] border border-white/5 p-8 rounded-[2rem] flex items-center space-x-6 hover:border-white/10 transition-all group">
        <div className={`w-16 h-16 ${bgColor} rounded-[1.8rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black text-white">{value}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        'Activo': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        'Agotado': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        'Programado': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    };

    return (
        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${styles[status]}`}>
            {status}
        </span>
    );
};
