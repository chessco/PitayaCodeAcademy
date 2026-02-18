import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
    Users as UsersIcon, UserPlus, Search, Filter,
    MoreHorizontal, Mail, Shield, ChevronDown,
    ArrowUpRight, UserCheck, UserMinus, Download, Loader2,
    ChevronRight, ChevronLeft, MoreVertical, Ban, GraduationCap,
    Crown, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Users() {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('Todos los Roles');
    const [statusFilter, setStatusFilter] = useState('Todos los Estados');

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await api.get('/users');
            return res.data;
        }
    });

    const getRoleStyles = (role: string) => {
        const r = role?.toUpperCase() || 'STUDENT';
        if (r === 'ADMIN') return {
            bg: 'bg-amber-500/10',
            text: 'text-amber-500',
            icon: Crown,
            label: 'Admin'
        };
        if (r === 'INSTRUCTOR') return {
            bg: 'bg-purple-500/10',
            text: 'text-purple-500',
            icon: Shield,
            label: 'Instructor'
        };
        return {
            bg: 'bg-blue-500/10',
            text: 'text-blue-500',
            icon: GraduationCap,
            label: 'Estudiante'
        };
    };

    const getStatusStyles = (status: string) => {
        if (status === 'Suspended') return { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Suspendido' };
        if (status === 'Offline') return { bg: 'bg-gray-500/10', text: 'text-gray-500', label: 'Offline' };
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', label: 'Activo' };
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const filteredUsers = users?.filter((u: any) => {
        const matchesSearch = u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const role = u.memberships?.[0]?.role || 'STUDENT';
        const matchesRole = roleFilter === 'Todos los Roles' || role === roleFilter.toUpperCase();
        return matchesSearch && matchesRole;
    }) || [];

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                        <span>Inicio</span>
                        <ChevronRight className="w-3 h-3 opacity-50" />
                        <span>Usuarios</span>
                        <ChevronRight className="w-3 h-3 opacity-50" />
                        <span className="text-white">Gestión</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight text-glow">Gestión de Usuarios</h1>
                    <p className="text-sm font-medium text-gray-500 max-w-2xl">
                        Administra los usuarios, roles y permisos de tu academia.
                    </p>
                </div>
                <button className="flex items-center space-x-3 px-6 py-3.5 bg-primary text-white rounded-2xl text-xs font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest">
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Usuario</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Usuarios"
                    value="540"
                    trend="+12%"
                    icon={<UsersIcon className="w-5 h-5 text-blue-500" />}
                    color="blue"
                />
                <StatCard
                    label="Activos"
                    value="485"
                    trend="+5%"
                    icon={<UserCheck className="w-5 h-5 text-emerald-500" />}
                    color="emerald"
                />
                <StatCard
                    label="Suspendidos"
                    value="25"
                    trend="-2%"
                    icon={<Ban className="w-5 h-5 text-red-500" />}
                    color="red"
                />
                <StatCard
                    label="Instructores"
                    value="30"
                    trend="Estable"
                    icon={<Shield className="w-5 h-5 text-purple-500" />}
                    color="purple"
                    trendIsNeutral
                />
            </div>

            {/* Filters Area */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, correo o ID..."
                        className="w-full bg-[#111114] border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-xs font-bold text-gray-300 focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            className="appearance-none bg-[#111114] border border-white/5 rounded-2xl px-6 py-4 pr-12 text-[10px] font-black text-gray-400 focus:outline-none focus:border-primary uppercase tracking-widest cursor-pointer hover:bg-white/[0.02] transition-all"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option>Todos los Roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="INSTRUCTOR">Instructor</option>
                            <option value="STUDENT">Estudiante</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select className="appearance-none bg-[#111114] border border-white/5 rounded-2xl px-6 py-4 pr-12 text-[10px] font-black text-gray-400 focus:outline-none focus:border-primary uppercase tracking-widest cursor-pointer hover:bg-white/[0.02] transition-all">
                            <option>Todos los Estados</option>
                            <option>Activo</option>
                            <option>Suspendido</option>
                            <option>Offline</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" />
                    </div>
                    <button className="flex items-center space-x-2 px-6 py-4 bg-[#111114] border border-white/5 rounded-2xl text-[10px] font-black text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all uppercase tracking-widest">
                        <Download className="w-4 h-4" />
                        <span>Exportar</span>
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-10 py-6">
                                    <input type="checkbox" className="w-4 h-4 rounded-md border-white/10 bg-white/5 text-primary focus:ring-primary/20 cursor-pointer" />
                                </th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Usuario</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Rol</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Estado</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Último Acceso</th>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((user: any) => {
                                const role = getRoleStyles(user.memberships?.[0]?.role);
                                const status = getStatusStyles('Activo'); // Mock status
                                return (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-white/[0.01] transition-all"
                                    >
                                        <td className="px-10 py-6">
                                            <input type="checkbox" className="w-4 h-4 rounded-md border-white/10 bg-white/5 text-primary focus:ring-primary/20 cursor-pointer" />
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 p-0.5 overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                                        <img
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                                            alt=""
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#111114] rounded-full flex items-center justify-center border-2 border-[#111114]">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-white leading-tight group-hover:text-primary transition-colors">{user.name || 'Sin Nombre'}</h4>
                                                    <p className="text-[11px] font-bold text-gray-600">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className={`inline-flex items-center space-x-2 px-3 py-1.5 ${role.bg} ${role.text} rounded-xl border border-white/5`}>
                                                <role.icon className="w-3 h-3" />
                                                <span className="text-[9px] font-black uppercase tracking-wider">{role.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${status.bg} ${status.text}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-0.5">
                                                <p className="text-[11px] font-black text-gray-300 uppercase">Oct 24, 2023</p>
                                                <p className="text-[10px] font-bold text-gray-600">10:45 AM</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button className="p-2.5 text-gray-600 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="p-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.01]">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        Mostrando <span className="text-white">1-5</span> de <span className="text-white">{filteredUsers.length}</span> resultados
                    </p>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-500 hover:text-white transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {[1, 2, 3, '...', 54].map((page, i) => (
                            <button
                                key={i}
                                className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${page === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-500 hover:text-white transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ label, value, trend, icon, color, trendIsNeutral }: any) => {
    const colors: any = {
        blue: 'group-hover:text-blue-500 group-hover:bg-blue-500/5',
        emerald: 'group-hover:text-emerald-500 group-hover:bg-emerald-500/5',
        red: 'group-hover:text-red-500 group-hover:bg-red-500/5',
        purple: 'group-hover:text-purple-500 group-hover:bg-purple-500/5',
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#111114] border border-white/5 p-8 rounded-[2.5rem] group hover:border-white/10 transition-all shadow-xl"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">{label}</p>
                    <div className="flex items-end space-x-3">
                        <p className="text-4xl font-extrabold text-white tracking-tighter tabular-nums">{value}</p>
                        <div className={`flex items-center text-[10px] font-black px-2 py-0.5 rounded-lg mb-1.5 ${trendIsNeutral ? 'bg-gray-500/10 text-gray-500' : (trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500')}`}>
                            {!trendIsNeutral && <ArrowUpRight className={`w-3 h-3 mr-0.5 ${!trend.startsWith('+') && 'rotate-90'}`} />}
                            {trend}
                        </div>
                    </div>
                </div>
                <div className={`p-4 bg-white/[0.02] border border-white/5 rounded-[1.25rem] transition-all transform group-hover:scale-110 shadow-inner`}>
                    {icon}
                </div>
            </div>
        </motion.div>
    );
};
