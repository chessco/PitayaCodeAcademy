import React from 'react';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

export default function Analytics() {
    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Análisis</h1>
                <p className="text-[13px] text-gray-500 font-medium">Visualiza el rendimiento y crecimiento de tus contenidos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'VISTAS TOTALES', value: '12.4k', trend: '+18%', icon: Eye },
                    { label: 'TIEMPO DE ESTUDIO', value: '450h', trend: '+5%', icon: Clock },
                    { label: 'COMPLETITUD', value: '82%', trend: '+12%', icon: TrendingUp },
                    { label: 'ESTUDIANTES NUEVOS', value: '156', trend: '+24%', icon: Users },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#111114] border border-white/5 p-8 rounded-[2rem] space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                            </div>
                            <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5">
                                <stat.icon className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <div className="text-[11px] font-bold text-emerald-500">
                            {stat.trend} vs mes anterior
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-[400px] bg-[#111114] border border-white/5 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <div className="text-center space-y-4">
                    <BarChart3 className="w-16 h-16 text-white/5 mx-auto" />
                    <p className="text-sm font-bold text-gray-500">Gráfico de rendimiento próximamente</p>
                </div>
            </div>
        </div>
    );
}

const Eye = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);
