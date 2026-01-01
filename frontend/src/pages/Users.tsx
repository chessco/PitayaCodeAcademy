import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
    Users as UsersIcon, UserPlus, Search, Filter,
    MoreHorizontal, Mail, Shield, ChevronDown,
    ArrowUpRight, UserCheck, UserMinus, Download, Loader2
} from 'lucide-react';

export default function Users() {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await api.get('/users');
            return res.data;
        },
        // DEBUG: Log error
        meta: {
            onError: (err: any) => console.error('Users load error:', err)
        }
    });

    if (error) {
        console.error('Query error object:', error);
        return <div className="p-10 text-white">Error loading users: {JSON.stringify(error)}</div>;
    }

    if (isLoading) return (
        <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Gestionar Usuarios</h1>
                    <p className="text-[13px] text-gray-500 font-medium">Controla los accesos y roles de todos los miembros de tu academia.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                        <Download className="w-4 h-4" />
                        <span>Exportar CSV</span>
                    </button>
                    <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                        <UserPlus className="w-4 h-4 mr-2" /> INVITAR USUARIO
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Usuarios Totales" value="1,248" trend="+45 este mes" icon={<UsersIcon className="w-5 h-5 text-primary" />} />
                <StatCard label="Usuarios Activos" value="982" trend="78% del total" trendIsNeutral icon={<UserCheck className="w-5 h-5 text-emerald-500" />} />
                <StatCard label="Nuevas Solicitudes" value="12" trend="Pendientes de revisión" trendIsNeutral icon={<Mail className="w-5 h-5 text-amber-500" />} />
            </div>

            {/* Users Table Area */}
            <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
                {/* Filters */}
                <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o rol..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs font-medium text-gray-300 focus:outline-none focus:border-primary/50 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-[11px] font-bold text-gray-400 hover:text-white transition-all">
                            <span>Todos los Roles</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-[11px] font-bold text-gray-400 hover:text-white transition-all">
                            <span>Estado: Activos</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Usuario</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Rol</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Estado</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Última Conexión</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users?.map((user: any) => (
                                <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/5 overflow-hidden flex-shrink-0">
                                                <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt="avatar" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white leading-tight mb-0.5">{user.name || 'Usuario'}</p>
                                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-lg w-fit">
                                            <Shield className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-[10px] font-black uppercase text-gray-300 tracking-wider font-mono">{(user.memberships?.[0]?.role) || 'STUDENT'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500`}>
                                            Activo
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-bold text-gray-500">Hace 1 min</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2.5 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all">
                                            <MoreHorizontal className="w-4 h-4" />
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
    <div className="bg-[#111114] border border-white/5 p-8 rounded-[2.5rem] space-y-4 group hover:border-white/10 transition-colors">
        <div className="flex justify-between items-start">
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{label}</p>
                <p className="text-4xl font-extrabold text-white">{value}</p>
            </div>
            <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </div>
        <div className={`flex items-center text-[11px] font-bold ${trendIsNeutral ? 'text-gray-500' : 'text-emerald-500'}`}>
            {!trendIsNeutral && <ArrowUpRight className="w-3 h-3 mr-1" />}
            {trend}
        </div>
    </div>
);
