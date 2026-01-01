import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
    Plus, Edit2, Trash2, GripVertical, Settings, Users,
    BarChart3, Box, Loader2, Download, Search, ChevronDown,
    MoreHorizontal, Filter, ArrowUpRight, GraduationCap,
    CircleDollarSign, LayoutGrid
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Studio() {
    const queryClient = useQueryClient();
    const [showCreate, setShowCreate] = useState(false);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [price, setPrice] = useState('49.99');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    const { data, isLoading } = useQuery({
        queryKey: ['studio-courses', page],
        queryFn: async () => {
            const skip = (page - 1) * ITEMS_PER_PAGE;
            const res = await api.get(`/courses?studio=true&skip=${skip}&take=${ITEMS_PER_PAGE}`);
            return res.data;
        },
    });

    const courses = data?.items || [];
    const totalCourses = data?.total || 0;
    const totalPages = Math.ceil(totalCourses / ITEMS_PER_PAGE);

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            return api.post('/courses', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studio-courses'] });
            setShowCreate(false);
            setTitle('');
            setSlug('');
        },
        onError: (error: any) => {
            console.error('Error creating course:', error);
            const message = error.response?.data?.message || 'Error al crear el curso. Por favor revisa los datos e intenta de nuevo.';
            alert(message);
        }
    });

    const slugify = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

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
            {/* Page Header Area */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Gestionar Cursos</h1>
                    <p className="text-[13px] text-gray-500 font-medium">Administra y organiza el contenido educativo de tu academia.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                        <Download className="w-4 h-4" />
                        <span>Exportar</span>
                    </button>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                    >
                        <Plus className="w-4 h-4 mr-2" /> NUEVO CURSO
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="TOTAL DE CURSOS"
                    value="24"
                    trend="+2 nuevos este mes"
                    icon={<LayoutGrid className="w-5 h-5 text-primary" />}
                />
                <StatCard
                    label="ESTUDIANTES ACTIVOS"
                    value="1,245"
                    trend="+12% vs mes anterior"
                    icon={<Users className="w-5 h-5 text-purple-500" />}
                />
                <StatCard
                    label="INGRESOS TOTALES"
                    value="$45.2k"
                    trend="Actualizado hoy"
                    trendIsNeutral
                    icon={<CircleDollarSign className="w-5 h-5 text-emerald-500" />}
                />
            </div>

            {/* Table Area */}
            <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
                {/* Search and Filters */}
                <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar cursos por nombre o instructor..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-xs font-medium text-gray-300 focus:outline-none focus:border-primary/50 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-3">
                        <FilterButton label="Todos los Estados" />
                        <FilterButton label="Cualquier Categoría" />
                    </div>
                </div>

                {/* Main Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Curso</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Instructor</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Precio</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Estudiantes</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Estado</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {courses.map((course: any) => (
                                <tr key={course.id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a1a1f] to-[#0c0c0e] border border-white/5 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                                                <GraduationCap className="w-6 h-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-white truncate leading-tight mb-1">{course.title}</p>
                                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Diseño • 12 Lecciones</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden border border-white/10 flex-shrink-0">
                                                <img src={`https://i.pravatar.cc/150?u=${course.instructorId}`} className="w-full h-full object-cover" alt="avatar" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-400">{course.instructor?.user?.name || 'Ana García'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-xs font-black ${course.price > 0 ? 'text-gray-300' : 'text-emerald-500'}`}>
                                            {course.price > 0 ? `$${course.price}` : 'Gratis'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden shrink-0">
                                                <div className="w-[60%] h-full bg-primary" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">128</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${course.isPublished
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {course.isPublished ? 'Publicado' : 'Borrador'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link
                                                to={`/studio/courses/${course.id}`}
                                                className="p-2.5 bg-white/5 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
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

                {/* Pagination */}
                <div className="p-6 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[11px] font-bold text-gray-600">
                        Mostrando {courses.length > 0 ? (page - 1) * ITEMS_PER_PAGE + 1 : 0} a {Math.min(page * ITEMS_PER_PAGE, totalCourses)} de {totalCourses} resultados
                    </p>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>
                        <div className="text-[10px] font-black text-gray-500 px-2">
                            PÁGINA {page} DE {totalPages || 1}
                        </div>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#111114] border border-white/10 p-10 rounded-[3rem] w-full max-w-lg space-y-8 animate-slide-up shadow-2xl">
                        <h2 className="text-3xl font-black text-white tracking-tight">Nuevo Curso</h2>
                        <div className="space-y-4">
                            <InputField
                                label="Título"
                                value={title}
                                onChange={(val) => { setTitle(val); setSlug(slugify(val)); }}
                                placeholder="Ej. Mastering Design Systems"
                            />
                            <InputField
                                label="Slug"
                                value={slug}
                                onChange={setSlug}
                                placeholder="mastering-design-systems"
                            />
                            <InputField
                                label="Precio (USD)"
                                type="number"
                                value={price}
                                onChange={setPrice}
                            />
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                onClick={() => setShowCreate(false)}
                                className="flex-1 bg-white/5 text-gray-400 font-bold py-4 rounded-2xl hover:bg-white/10 transition-all"
                            >
                                CANCELAR
                            </button>
                            <button
                                onClick={() => createMutation.mutate({ title, slug, price: parseFloat(price) })}
                                disabled={createMutation.isPending}
                                className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl hover:scale-102 active:scale-98 transition-all shadow-xl shadow-primary/20 flex items-center justify-center"
                            >
                                {createMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : 'CONFIRMAR'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const StatCard = ({ label, value, trend, icon, trendIsNeutral }: any) => (
    <div className="bg-[#111114] border border-white/5 p-8 rounded-[2rem] space-y-4 relative overflow-hidden group hover:border-white/10 transition-colors">
        <div className="flex justify-between items-start relative z-10">
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.15em]">{label}</p>
                <p className="text-4xl font-extrabold text-white">{value}</p>
            </div>
            <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 group-hover:scale-110 transition-transform">
                {icon}
            </div>
        </div>
        <div className={`flex items-center text-[11px] font-bold ${trendIsNeutral ? 'text-gray-500' : 'text-emerald-500'} relative z-10 pl-1`}>
            {!trendIsNeutral && <ArrowUpRight className="w-3 h-3 mr-1" />}
            {trend}
        </div>
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] rounded-full -mr-16 -mt-16" />
    </div>
);

const FilterButton = ({ label }: { label: string }) => (
    <button className="flex items-center space-x-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-[11px] font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all">
        <span>{label}</span>
        <ChevronDown className="w-3.5 h-3.5" />
    </button>
);

const InputField = ({ label, type = "text", value, onChange, placeholder }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-sm font-medium text-gray-300 focus:outline-none focus:border-primary/50 transition-colors"
            placeholder={placeholder}
        />
    </div>
);
