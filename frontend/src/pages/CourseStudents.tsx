import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
    Users, Search, Filter, Download, Mail, MoreVertical,
    ChevronLeft, ChevronRight, GraduationCap, CheckCircle2,
    AlertCircle, Clock, Plus, X, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CourseStudents() {
    const { id: courseId } = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [enrollEmail, setEnrollEmail] = useState('');
    const queryClient = useQueryClient();

    const enrollMutation = useMutation({
        mutationFn: async (email: string) => {
            return api.post('/enrollments/course', { email, courseId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-students', courseId] });
            setShowEnrollModal(false);
            setEnrollEmail('');
            alert('Estudiante inscrito exitosamente');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al inscribir estudiante';
            alert(message);
        }
    });

    const { data: course } = useQuery({
        queryKey: ['course-detail', courseId],
        queryFn: async () => {
            const res = await api.get(`/courses/${courseId}`);
            return res.data;
        }
    });

    const { data: students, isLoading } = useQuery({
        queryKey: ['course-students', courseId],
        queryFn: async () => {
            const res = await api.get(`/enrollments/course/${courseId}`);
            return res.data;
        }
    });

    const filteredStudents = students?.filter((s: any) => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'Todos' || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    }) || [];

    if (isLoading) return (
        <div className="space-y-8 animate-pulse">
            <div className="h-10 w-64 bg-white/5 rounded-xl" />
            <div className="h-[500px] glass rounded-[2.5rem]" />
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Breadcrumbs & Header */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                    <Link to="/studio/courses" className="hover:text-primary transition-colors">Cursos</Link>
                    <ChevronRight className="w-3 h-3 opacity-50" />
                    <span className="truncate max-w-[200px]">{course?.title || 'Curso'}</span>
                    <ChevronRight className="w-3 h-3 opacity-50" />
                    <span className="text-white bg-primary/10 px-2 py-0.5 rounded-lg text-[9px]">ESTUDIANTES</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Gestión de Estudiantes</h1>
                        <div className="flex items-center space-x-3 text-gray-500 font-medium">
                            <GraduationCap className="w-4 h-4" />
                            <span>Curso: {course?.title}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex -space-x-2 mr-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#09090b] bg-white/10 overflow-hidden shadow-lg">
                                    <img src={`https://i.pravatar.cc/100?u=${i + (courseId || '')}`} alt="avatar" />
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-[#09090b] bg-[#1a1a1f] flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                                +{students?.length > 3 ? students.length - 3 : 42}
                            </div>
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                            <Download className="w-4 h-4" />
                            <span>Exportar CSV</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5 space-y-2">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Buscar estudiante</label>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Nombre o correo electrónico"
                            className="w-full bg-[#111114] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-xs font-medium text-gray-300 focus:outline-none focus:border-primary/50 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="md:col-span-3 space-y-2">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Filtrar por estado</label>
                    <select
                        className="w-full bg-[#111114] border border-white/5 rounded-xl py-3.5 px-4 text-xs font-medium text-gray-400 focus:outline-none focus:border-primary/50 cursor-pointer appearance-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option>Todos</option>
                        <option>Activo</option>
                        <option>En Riesgo</option>
                        <option>Completado</option>
                    </select>
                </div>
                <div className="md:col-span-4 flex justify-end space-x-3">
                    <button
                        onClick={() => setShowEnrollModal(true)}
                        className="bg-white/10 border border-white/5 text-white px-6 py-3.5 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 hover:bg-white/20 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="uppercase tracking-widest hidden lg:block">NUEVO ESTUDIANTE</span>
                        <span className="uppercase tracking-widest lg:hidden">NUEVO</span>
                    </button>
                    <button className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-xs flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                        <Mail className="w-4 h-4" />
                        <span className="uppercase tracking-widest hidden lg:block">Mensaje Grupal</span>
                    </button>
                </div>
            </div>

            {/* Enroll Modal */}
            {showEnrollModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
                    <div className="bg-[#111114] border border-white/10 p-10 rounded-[3rem] w-full max-w-lg space-y-8 animate-in fade-in zoom-in duration-300 relative">
                        <button
                            onClick={() => setShowEnrollModal(false)}
                            className="absolute top-8 right-8 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all text-gray-500 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div>
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                <GraduationCap className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Inscribir Estudiante</h2>
                            <p className="text-gray-500 text-sm font-medium">
                                Ingresa el correo electrónico del estudiante para agregarlo a este curso.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    placeholder="ejemplo@pitayacode.io"
                                    value={enrollEmail}
                                    onChange={(e) => setEnrollEmail(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-sm font-medium text-white focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>

                            <button
                                onClick={() => enrollMutation.mutate(enrollEmail)}
                                disabled={enrollMutation.isPending || !enrollEmail}
                                className="w-full bg-primary text-white font-black text-xs py-4 rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {enrollMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>INSCRIBIENDO...</span>
                                    </>
                                ) : (
                                    <span>CONFIRMAR INSCRIPCIÓN</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Students Table */}
            <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-8 py-5 w-16">
                                    <input type="checkbox" className="w-4 h-4 rounded-md border-white/10 bg-white/5 text-primary focus:ring-primary/50" />
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Estudiante</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Estado</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Progreso</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Último Acceso</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredStudents.map((student: any, idx: number) => (
                                <motion.tr
                                    key={student.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-white/[0.01] transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <input type="checkbox" className="w-4 h-4 rounded-md border-white/10 bg-white/5 text-primary focus:ring-primary/50" />
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-11 h-11 rounded-full bg-white/10 overflow-hidden border border-white/10 p-0.5 group-hover:scale-105 transition-transform">
                                                <img src={student.avatar || `https://i.pravatar.cc/100?u=${student.email}`} className="w-full h-full object-cover rounded-full" alt="student" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-white leading-tight mb-0.5">{student.name}</p>
                                                <p className="text-[11px] font-medium text-gray-500 truncate">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={student.status || (idx % 3 === 0 ? 'En Riesgo' : idx % 3 === 1 ? 'Completado' : 'Activo')} />
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-2 max-w-[180px]">
                                            <div className="flex justify-between items-center text-[10px] font-black">
                                                <span className="text-white">{student.progress}%</span>
                                                <span className="text-gray-600">{student.completedLessons}/{student.totalLessons} Lecciones</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${student.progress}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={`h-full rounded-full ${student.progress > 90 ? 'bg-emerald-500' :
                                                        student.progress < 20 ? 'bg-amber-500' : 'bg-primary'
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-gray-500">
                                        {student.lastAccess || 'Hace 2 horas'}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2.5 bg-white/5 rounded-xl text-gray-600 hover:text-white hover:bg-white/10 transition-all">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">
                        Mostrando <span className="text-white">1-4</span> de <span className="text-white">{students?.length || 45}</span> estudiantes
                    </p>
                    <div className="flex items-center space-x-2">
                        <button className="px-6 py-3 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-all">Anterior</button>
                        <div className="flex items-center space-x-1">
                            <button className="w-10 h-10 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20">1</button>
                            <button className="w-10 h-10 hover:bg-white/5 text-gray-500 hover:text-white rounded-xl text-xs font-black transition-all">2</button>
                            <button className="w-10 h-10 hover:bg-white/5 text-gray-500 hover:text-white rounded-xl text-xs font-black transition-all">3</button>
                        </div>
                        <button className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatusBadge = ({ status }: { status: string }) => {
    let colorClass = 'bg-primary/10 text-primary';
    let dotClass = 'bg-primary';

    if (status === 'Activo') {
        colorClass = 'bg-emerald-500/10 text-emerald-500';
        dotClass = 'bg-emerald-500';
    } else if (status === 'En Riesgo') {
        colorClass = 'bg-amber-500/10 text-amber-500';
        dotClass = 'bg-amber-500';
    } else if (status === 'Completado') {
        colorClass = 'bg-blue-500/10 text-blue-500';
        dotClass = 'bg-blue-500';
    }

    return (
        <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-white/5 ${colorClass}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${dotClass} animate-pulse`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
        </div>
    );
};
