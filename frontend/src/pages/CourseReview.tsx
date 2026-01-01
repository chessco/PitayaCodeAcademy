import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Star, Save, X, ThumbsUp, ThumbsDown,
    MessageSquare, CheckCircle2, ChevronRight,
    Send, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function CourseReview() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [course, setCourse] = useState<any>(null);
    const [summary, setSummary] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedPros, setSelectedPros] = useState<string[]>([]);
    const [selectedContras, setSelectedContras] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const prosOptions = ["Buen Contenido", "Profesor Experto", "Ejercicios Prácticos", "Audio Excelente", "Explicación Clara"];
    const contrasOptions = ["Audio Bajo", "Ritmo Acelerado", "Falta Actualización", "Falta material descargable", "Demasiado Básico"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, summaryRes, myReviewRes] = await Promise.all([
                    api.get(`/courses/${courseId}`),
                    api.get(`/reviews/course/${courseId}`),
                    api.get(`/reviews/my/${courseId}`, { data: { studentId: user?.memberships?.[0]?.id } }).catch(() => ({ data: null }))
                ]);

                setCourse(courseRes.data);
                setSummary(summaryRes.data);

                if (myReviewRes.data) {
                    setRating(myReviewRes.data.rating);
                    setComment(myReviewRes.data.comment || '');
                    setSelectedPros(myReviewRes.data.pros?.split(',') || []);
                    setSelectedContras(myReviewRes.data.contras?.split(',') || []);
                }
            } catch (error) {
                console.error("Error fetching review data:", error);
            }
        };

        if (courseId && user) fetchData();
    }, [courseId, user]);

    const toggleTag = (tag: string, list: string[], setList: any) => {
        if (list.includes(tag)) {
            setList(list.filter(t => t !== tag));
        } else {
            setList([...list, tag]);
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) return alert("Por favor selecciona una calificación");
        setIsSaving(true);
        try {
            await api.post('/reviews', {
                courseId,
                studentId: user?.memberships?.[0]?.id,
                rating,
                comment,
                pros: selectedPros.join(','),
                contras: selectedContras.join(',')
            });
            setStatus('success');
            setTimeout(() => navigate('/my-courses'), 2000);
        } catch (error) {
            setStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    if (!course) return <div className="p-20 text-center text-white">Cargando...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                <Link to="/my-courses" className="hover:text-white transition-colors">Mis Cursos</Link>
                <ChevronRight className="w-3 h-3 mx-3 opacity-30" />
                <span className="text-gray-600 truncate max-w-[200px]">{course.title}</span>
                <ChevronRight className="w-3 h-3 mx-3 opacity-30" />
                <span className="text-white">Reseñas</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                    <img src={course.thumbnail || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop'} className="w-full h-full object-cover" alt="Course" />
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                    <h1 className="text-4xl font-black text-white tracking-tight leading-none">{course.title}</h1>
                    <div className="flex items-center justify-center md:justify-start space-x-3">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-bold text-gray-400">Curso Completado el 14 de Oct, 2023</span>
                    </div>
                    <div className="inline-flex px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-green-400">
                        Certificado Obtenido
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10 items-start">
                {/* Form Area */}
                <div className="lg:col-span-8 bg-[#111114] border border-white/5 rounded-[3rem] p-10 space-y-10">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black text-white">Escribe tu reseña</h2>
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 text-gray-500 rounded-lg border border-white/5">Público</span>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-bold text-gray-400">¿Cómo calificarías este curso?</p>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform active:scale-90"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${(hoverRating || rating) >= star
                                                        ? 'fill-yellow-500 text-yellow-500'
                                                        : 'text-gray-800'
                                                    } transition-colors`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">
                                    {rating > 0 ? `${rating} de 5 - ${["Muy Malo", "Malo", "Regular", "Bueno", "Muy Bueno"][rating - 1]}` : "Sin calificar"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400">Cuéntanos más sobre tu experiencia</label>
                        <div className="relative">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="¿Qué fue lo que más te gustó? ¿Cómo te pareció el instructor? Tu opinión ayuda a otros estudiantes."
                                className="w-full h-40 bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 text-sm font-medium text-white focus:outline-none focus:border-primary/50 transition-all resize-none placeholder:text-gray-700"
                            />
                            <div className="absolute bottom-6 right-8 text-[10px] font-black text-gray-700 uppercase tracking-widest">
                                Minimo 20 caracteres
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-green-400">
                                <ThumbsUp className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Pros</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {prosOptions.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag, selectedPros, setSelectedPros)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedPros.includes(tag)
                                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                                : 'bg-white/5 border-white/5 text-gray-600 hover:text-white'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-red-400">
                                <ThumbsDown className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Contras</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {contrasOptions.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag, selectedContras, setSelectedContras)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedContras.includes(tag)
                                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                                : 'bg-white/5 border-white/5 text-gray-600 hover:text-white'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 flex items-center justify-end space-x-6">
                        <button
                            onClick={() => navigate('/my-courses')}
                            className="text-xs font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className={`flex items-center space-x-3 px-10 py-5 ${status === 'success' ? 'bg-green-500' : 'bg-primary'} text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20`}
                        >
                            {isSaving ? (
                                <span>Enviando...</span>
                            ) : status === 'success' ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>¡Reseña Enviada!</span>
                                </>
                            ) : (
                                <>
                                    <span>Enviar Reseña</span>
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#111114] border border-white/5 rounded-[3rem] p-10 space-y-8">
                        <h3 className="text-lg font-black text-white">Resumen de Opiniones</h3>
                        <div className="flex items-end space-x-4">
                            <span className="text-6xl font-black text-white leading-none">{summary?.averageRating || "0.0"}</span>
                            <div className="space-y-1 pb-1">
                                <div className="flex text-yellow-500">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} className={`w-4 h-4 ${i <= (summary?.averageRating || 0) ? 'fill-current' : 'opacity-20'}`} />
                                    ))}
                                </div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Basado en {summary?.totalReviews || 0} reseñas</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[5, 4, 3, 2, 1].map(num => (
                                <div key={num} className="flex items-center space-x-4 group">
                                    <span className="text-[10px] font-black text-gray-600 w-4">{num} ★</span>
                                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-500/80 rounded-full"
                                            style={{ width: `${summary?.totalReviews ? (summary.distribution[num] / summary.totalReviews) * 100 : 0}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-600 w-8 text-right">
                                        {summary?.totalReviews ? Math.round((summary.distribution[num] / summary.totalReviews) * 100) : 0}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#111114] border border-white/5 rounded-[3rem] p-10 space-y-8">
                        <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">LO QUE DICEN LOS ALUMNOS</h3>
                        <div className="space-y-6">
                            <InsightItem
                                icon={<CheckCircle2 className="w-4 h-4 text-green-400" />}
                                title="Contenido Práctico"
                                subtitle="Mencionado en 450 reseñas"
                            />
                            <InsightItem
                                icon={<CheckCircle2 className="w-4 h-4 text-green-400" />}
                                title="Excelente Instructor"
                                subtitle="Mencionado en 320 reseñas"
                            />
                            <InsightItem
                                icon={<X className="w-4 h-4 text-red-500" />}
                                title="Falta material descargable"
                                subtitle="Mencionado en 45 reseñas"
                                isNegative
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InsightItem({ icon, title, subtitle, isNegative }: any) {
    return (
        <div className="flex items-start space-x-4 group">
            <div className={`mt-1 w-8 h-8 rounded-xl ${isNegative ? 'bg-red-500/10' : 'bg-green-500/10'} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div>
                <h4 className="text-[13px] font-black text-white">{title}</h4>
                <p className="text-[10px] font-medium text-gray-500">{subtitle}</p>
            </div>
        </div>
    );
}
