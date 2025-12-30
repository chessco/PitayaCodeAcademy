import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Plus, Edit2, Trash2, GripVertical, Settings, Users, BarChart3, Box, Loader2 } from 'lucide-react';

export default function Studio() {
    const queryClient = useQueryClient();
    const [showCreate, setShowCreate] = useState(false);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [price, setPrice] = useState('49.99');

    const { data: courses, isLoading } = useQuery({
        queryKey: ['studio-courses'],
        queryFn: async () => {
            const res = await api.get('/courses');
            return res.data;
        },
    });

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
    });

    if (isLoading) return <div className="space-y-6 animate-pulse">
        {[1, 2, 3].map(i => <div key={i} className="h-24 glass rounded-3xl" />)}
    </div>;

    return (
        <div className="space-y-8 pb-40">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Studio</h1>
                    <p className="text-sm text-gray-500">Crea y gestiona tus cursos premium</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="bg-primary text-white p-4 px-6 rounded-2xl font-bold flex items-center hover:scale-[1.05] transition-transform shadow-xl shadow-primary/20"
                >
                    <Plus className="w-5 h-5 mr-2" /> NUEVO CURSO
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-8 rounded-[2rem] border-white/5 space-y-2">
                    <Users className="w-6 h-6 text-blue-500" />
                    <p className="text-xs font-black uppercase text-gray-600 tracking-widest">Estudiantes Totales</p>
                    <p className="text-4xl font-black">12.5k</p>
                </div>
                <div className="glass p-8 rounded-[2rem] border-white/5 space-y-2">
                    <BarChart3 className="w-6 h-6 text-purple-500" />
                    <p className="text-xs font-black uppercase text-gray-600 tracking-widest">Ingresos del Mes</p>
                    <p className="text-4xl font-black">$4,250</p>
                </div>
                <div className="glass p-8 rounded-[2rem] border-white/5 space-y-2">
                    <Box className="w-6 h-6 text-orange-500" />
                    <p className="text-xs font-black uppercase text-gray-600 tracking-widest">Cursos Activos</p>
                    <p className="text-4xl font-black">{courses?.length || 0}</p>
                </div>
            </div>

            <div className="space-y-4">
                {courses?.map((course: any) => (
                    <div key={course.id} className="glass p-6 rounded-[2.5rem] flex items-center justify-between group border-white/5 hover:border-white/20 transition-all">
                        <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Box className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold leading-none mb-2">{course.title}</h3>
                                <div className="flex items-center space-x-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    <span className="flex items-center"><Users className="w-3 h-3 mr-1" /> 125 Ventas</span>
                                    <span className="flex items-center"><GripVertical className="w-3 h-3 mr-1" /> 12 Lecciones</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button className="p-4 bg-white/5 rounded-2xl text-gray-500 hover:bg-white/10 hover:text-white transition-all">
                                <Edit2 className="w-5 h-5" />
                            </button>
                            <button className="p-4 bg-red-400/5 rounded-2xl text-red-400/50 hover:bg-red-400/10 hover:text-red-400 transition-all">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {courses?.length === 0 && !showCreate && (
                    <div className="py-20 text-center glass rounded-3xl border-dashed border-white/10">
                        <Plus className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-600">No has creado ningún curso todavía</p>
                    </div>
                )}
            </div>

            {showCreate && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                    <div className="glass p-10 rounded-[3rem] w-full max-w-lg border-white/10 space-y-8 animate-slide-up">
                        <h2 className="text-3xl font-black tracking-tight">Nuevo Curso</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Título</label>
                                <input
                                    value={title}
                                    onChange={(e) => { setTitle(e.target.value); setSlug(e.target.value.toLowerCase().replace(/ /g, '-')); }}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-primary"
                                    placeholder="Ej. Mastering Design Systems"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Slug</label>
                                <input
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-primary"
                                    placeholder="mastering-design-systems"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Precio (USD)</label>
                                <input
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-primary"
                                    type="number"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowCreate(false)}
                                className="flex-1 bg-white/5 text-gray-400 font-bold py-4 rounded-2xl hover:bg-white/10 transition-all"
                            >
                                CANCELAR
                            </button>
                            <button
                                onClick={() => createMutation.mutate({ title, slug, price: parseFloat(price) })}
                                disabled={createMutation.isPending}
                                className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center"
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
