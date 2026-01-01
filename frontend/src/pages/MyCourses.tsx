import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import {
    Play, Sparkles, Star, Search, Filter, Clock,
    CheckCircle2, BookOpen, MessageSquare, Trash2, Edit3, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
    { id: 'all', label: 'Todos' },
    { id: 'progress', label: 'En Progreso' },
    { id: 'completed', label: 'Completadas' },
    { id: 'upcoming', label: 'Próximas' },
    { id: 'reviews', label: 'Mis Reseñas' },
];

export default function MyCourses() {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const { data: enrollments, isLoading: loadingCourses } = useQuery({
        queryKey: ['my-enrollments'],
        queryFn: async () => {
            const res = await api.get('/enrollments/my');
            return res.data;
        },
    });

    const { data: reviews, isLoading: loadingReviews } = useQuery({
        queryKey: ['my-reviews'],
        queryFn: async () => {
            const res = await api.get('/reviews/my');
            return res.data;
        },
        enabled: activeTab === 'reviews'
    });

    const filteredEnrollments = enrollments?.filter((e: any) => {
        const matchesSearch = e.course.title.toLowerCase().includes(searchQuery.toLowerCase());
        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'progress') return matchesSearch && e.progress < 100;
        if (activeTab === 'completed') return matchesSearch && e.progress === 100;
        // Mocking upcoming for now
        if (activeTab === 'upcoming') return false;
        return matchesSearch;
    });

    const isLoading = loadingCourses || (activeTab === 'reviews' && loadingReviews);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Mis Cursos</h1>
                    <p className="text-gray-500 font-medium">Gestiona tu progreso y continúa aprendiendo.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative group flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar en mis cursos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 text-xs font-medium focus:outline-none focus:border-primary/30 transition-all"
                        />
                    </div>
                    <Link
                        to="/"
                        className="h-12 px-6 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all shadow-xl shadow-primary/20 flex items-center space-x-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Explorar Cursos</span>
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-2xl w-fit">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                            ? 'bg-white/10 text-white shadow-lg'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-[4/5] bg-white/5 rounded-[2.5rem] animate-pulse" />
                    ))}
                </div>
            ) : activeTab === 'reviews' ? (
                <div className="space-y-6">
                    {reviews?.length === 0 ? (
                        <EmptyState
                            icon={MessageSquare}
                            title="Aún no has escrito reseñas"
                            desc="Comparte tu experiencia con otros estudiantes."
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {reviews?.map((review: any) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredEnrollments?.length === 0 ? (
                            <EmptyState
                                icon={BookOpen}
                                title="No hay resultados"
                                desc="Intenta con otros términos o filtros."
                            />
                        ) : (
                            filteredEnrollments?.map((enrollment: any) => (
                                <CourseProgressCard key={enrollment.id} enrollment={enrollment} />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

function CourseProgressCard({ enrollment }: any) {
    const course = enrollment.course;
    const progress = enrollment.progress || 0;
    const isCompleted = progress === 100;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col"
        >
            <div className="aspect-video relative overflow-hidden">
                <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    alt={course.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent blend-multiply" />

                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-lg text-[9px] font-black uppercase tracking-widest text-primary">
                        {course.category || 'FRONTEND'}
                    </span>
                </div>

                <div className="absolute bottom-4 right-4">
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                        <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-primary animate-pulse'}`} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">
                            {isCompleted ? 'Completado' : 'En Progreso'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-6 flex-1 flex flex-col">
                <div className="space-y-3">
                    <h3 className="text-xl font-black text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {course.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed line-clamp-2">
                        {course.description || 'Domina conceptos avanzados y mejora tus habilidades profesionales.'}
                    </p>
                </div>

                <div className="flex items-center space-x-4 text-[10px] font-bold text-gray-400">
                    <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>4h 20m restantes</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-gray-500">Progreso general</span>
                        <span className="text-white">{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                        />
                    </div>
                </div>

                <div className="pt-2 grid grid-cols-5 gap-3 mt-auto">
                    <Link
                        to={`/courses/${course.id}/player`}
                        className="col-span-3 h-14 bg-primary text-white rounded-2xl flex items-center justify-center space-x-3 text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
                    >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isCompleted ? 'Repasar' : 'Continuar'}</span>
                    </Link>
                    <Link
                        to={`/my-courses/${course.id}/review`}
                        className="h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <Star className="w-4 h-4" />
                    </Link>
                    <Link
                        to={`/notifications`}
                        className="h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all relative"
                    >
                        <Bell className="w-4 h-4" />
                        <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#0c0c0e]" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

function ReviewCard({ review }: any) {
    return (
        <div className="glass rounded-[2rem] p-8 border-white/5 bg-white/[0.02] space-y-6 group hover:border-primary/20 transition-all">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10">
                        <img src={review.course.thumbnail} className="w-full h-full object-cover" alt={review.course.title} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white group-hover:text-primary transition-colors underline-offset-4 decoration-primary/50">{review.course.title}</h4>
                        <div className="flex items-center mt-1 text-yellow-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-current' : 'opacity-20'}`} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2.5 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                    <button className="p-2.5 bg-white/5 rounded-xl text-gray-500 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
            </div>

            <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                "{review.comment || 'Sin comentarios.'}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-600">
                <span>Publicado el {new Date(review.createdAt).toLocaleDateString()}</span>
                <span className="text-primary">Ver en el curso</span>
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, title, desc }: any) {
    return (
        <div className="col-span-full py-24 text-center glass rounded-[3rem] border-white/5 bg-white/[0.01]">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <Icon className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-black mb-3 text-white">{title}</h2>
            <p className="text-gray-500 mb-10 max-w-md mx-auto">{desc}</p>
            <Link to="/" className="px-10 py-5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-primary/20 inline-block">
                Explorar Catálogo
            </Link>
        </div>
    );
}
