import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Link } from 'react-router-dom';
import {
    MessageSquare, Users, ChevronRight, BookOpen,
    Sparkles, ArrowRight, MessageCircle
} from 'lucide-react';

export default function Community() {
    const { data: enrollments, isLoading } = useQuery({
        queryKey: ['my-enrollments'],
        queryFn: async () => {
            const res = await api.get('/enrollments/my');
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Cargando Comunidad...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Hero Section */}
            <div className="relative glass rounded-[3rem] p-12 border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-transparent overflow-hidden">
                <div className="relative z-10 max-w-2xl space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-primary italic">Plataforma Social</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter leading-tight">
                        Conecta con la <span className="text-primary italic">Comunidad</span>
                    </h1>
                    <p className="text-gray-400 font-medium leading-relaxed text-lg">
                        Explora los foros de tus cursos activos, comparte conocimientos y resuelve dudas con otros estudiantes e instructores.
                    </p>
                </div>

                {/* Decorative background icons */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-5 scale-150 rotate-12 pointer-events-none">
                    <MessageCircle className="w-96 h-96 text-white" />
                </div>
            </div>

            {/* Courses Forums Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-primary" />
                            Foros de tus Cursos
                        </h2>
                        <p className="text-gray-500 text-sm font-medium mt-1">Selecciona un curso para entrar a su sala de discusión privada.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {enrollments?.length > 0 ? (
                        enrollments.map((enrollment: any) => (
                            <Link
                                key={enrollment.id}
                                to={`/courses/${enrollment.course.id}/forum`}
                                className="group block h-full"
                            >
                                <div className="h-full glass rounded-[2.5rem] p-8 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-500 flex flex-col">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                            <img
                                                src={enrollment.course.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop'}
                                                alt={enrollment.course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-widest group-hover:text-primary group-hover:bg-primary/10 transition-all">
                                            Activo
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-8 flex-1">
                                        <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors line-clamp-2">
                                            Foro: {enrollment.course.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2 italic">
                                            "Únete a la conversación sobre {enrollment.course.title.split(':')[0]}..."
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1.5">
                                                <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                                                <span className="text-[10px] font-black text-gray-400">12 Hilos</span>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/10">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center glass rounded-[3rem] border-dashed border-white/10">
                            <Sparkles className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-white">No tienes cursos inscritos</h3>
                            <p className="text-gray-500 mt-2 font-medium">Inscríbete en un curso para participar en la comunidad.</p>
                            <Link to="/" className="mt-8 inline-block px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-110 transition-all">
                                Explorar Catálogo
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
