import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { Play, CheckCircle, Shield, Clock, Users, Globe, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: course, isLoading } = useQuery({
        queryKey: ['course', id],
        queryFn: async () => {
            const res = await api.get(`/courses/${id}`);
            return res.data;
        },
    });

    const enrollMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post('/cart/checkout', { courseIds: [id] });
            const orderId = res.data.id;
            // Immediate fulfillment for demo
            await api.post(`/cart/fulfill/${orderId}`);
            return res.data;
        },
        onSuccess: () => {
            navigate(`/courses/${id}/player`);
        },
    });

    if (isLoading) return <div className="space-y-8 animate-pulse">
        <div className="h-[400px] glass rounded-[3rem]" />
        <div className="h-64 glass rounded-[2rem] w-2/3" />
    </div>;

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            <div className="relative rounded-[3rem] overflow-hidden bg-[#0a0a0c] border border-white/5 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1031&auto=format&fit=crop"
                    alt="Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />

                <div className="relative z-20 p-12 lg:p-20 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 text-primary font-black uppercase tracking-[0.2em] text-xs">
                            <span className="w-8 h-[2px] bg-primary" />
                            <span>Full Access Course</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black leading-[0.9]">{course.title}</h1>
                        <p className="text-gray-400 text-lg max-w-lg leading-relaxed">{course.description || 'Domina esta tecnología de principio a fin con una metodología enfocada en resultados.'}</p>

                        <div className="flex flex-wrap gap-6 pt-4 text-sm text-gray-500 font-medium">
                            <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /> 12h de contenido</div>
                            <div className="flex items-center"><Users className="w-4 h-4 mr-2" /> 500+ Estudiantes</div>
                            <div className="flex items-center"><Globe className="w-4 h-4 mr-2" /> Español</div>
                        </div>

                        <div className="pt-8">
                            <button
                                onClick={() => enrollMutation.mutate()}
                                disabled={enrollMutation.isPending}
                                className="group bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center hover:scale-[1.02] transition-all shadow-2xl shadow-primary/20"
                            >
                                {enrollMutation.isPending ? 'PROCESANDO...' : 'EMPEZAR A APRENDER'}
                                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <div className="glass aspect-video rounded-3xl flex items-center justify-center relative group cursor-pointer border-white/10">
                            <div className="w-20 h-20 bg-primary/20 backdrop-blur-xl rounded-full border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 fill-current translate-x-1" />
                            </div>
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Plan de Estudios</h2>
                        <div className="space-y-3">
                            {course.lessons?.map((lesson: any, idx: number) => (
                                <div key={lesson.id} className="flex items-center justify-between p-5 glass rounded-2xl border-white/5 hover:border-white/20 transition-all cursor-default group">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-xs font-black text-gray-600 w-6 uppercase tracking-tighter">0{idx + 1}</span>
                                        <span className="font-bold text-gray-300 group-hover:text-white transition-colors">{lesson.title}</span>
                                    </div>
                                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-600">
                                        <Clock className="w-3 h-3 mr-1" /> 15 MIN
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass p-8 rounded-[2rem] border-primary/20">
                        <h3 className="text-xl font-bold mb-6">¿Qué incluye?</h3>
                        <ul className="space-y-4">
                            {[
                                'Acceso de por vida',
                                'Recursos descargables',
                                'Certificado de finalización',
                                'Comunidad premium',
                                'Actualizaciones constantes'
                            ].map(text => (
                                <li key={text} className="flex items-start text-sm text-gray-400">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass p-8 rounded-[2rem] border-white/5">
                        <Shield className="w-10 h-10 text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Garantía Pitaya</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Si no estás satisfecho con el contenido en los primeros 7 días, te devolvemos tu dinero sin preguntas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { ArrowRight } from 'lucide-react';
