import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
    Plus, Search, MessageSquare, Eye, Clock, Pin,
    CheckCircle, ChevronRight, Filter, MoreVertical,
    HelpCircle, Lightbulb, MessageCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_MAP: Record<string, { label: string, color: string, icon: any }> = {
    ANNOUNCEMENT: { label: 'ANUNCIO', color: 'bg-blue-500', icon: MessageSquare },
    QUESTION: { label: 'PREGUNTA', color: 'bg-orange-500', icon: HelpCircle },
    PROPOSAL: { label: 'APORTE', color: 'bg-purple-500', icon: Lightbulb },
    GENERAL: { label: 'GENERAL', color: 'bg-gray-500', icon: MessageCircle }
};

export default function CourseForum() {
    const { id: courseId } = useParams();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [categoryFilter, setCategoryFilter] = useState('Cualquier categoría');

    // Create Topic State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTopicTitle, setNewTopicTitle] = useState('');
    const [newTopicContent, setNewTopicContent] = useState('');
    const [newTopicCategory, setNewTopicCategory] = useState('GENERAL');

    const createTopicMutation = useMutation({
        mutationFn: async (data: { title: string, content: string, category: string }) => {
            return api.post('/discussions/topic', {
                ...data,
                courseId
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['forum-topics', courseId] });
            setIsModalOpen(false);
            setNewTopicTitle('');
            setNewTopicContent('');
            setNewTopicCategory('GENERAL');
        }
    });

    const handleCreateTopic = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTopicTitle.trim() || !newTopicContent.trim()) return;
        createTopicMutation.mutate({
            title: newTopicTitle,
            content: newTopicContent,
            category: newTopicCategory
        });
    };

    const { data: topics, isLoading } = useQuery({
        queryKey: ['forum-topics', courseId],
        queryFn: async () => {
            const res = await api.get(`/discussions/course/${courseId}`);
            return res.data;
        }
    });

    const { data: course } = useQuery({
        queryKey: ['course-basic', courseId],
        queryFn: async () => {
            const res = await api.get(`/courses/${courseId}`);
            return res.data;
        }
    });

    const filteredTopics = topics?.filter((topic: any) => {
        const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topic.content.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter === 'Cualquier categoría' || topic.category === categoryFilter;

        let matchesStatus = true;
        if (activeFilter === 'Sin Respuesta') matchesStatus = topic._count.posts === 0;
        if (activeFilter === 'Mis Hilos') matchesStatus = false; // logic would go here if we had current userId

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Simplified skeleton loader for the forum topics
    if (isLoading) return (
        <div className="min-h-screen bg-[#050505] text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center">
                    <div className="h-4 w-48 bg-white/5 rounded-full" />
                    <div className="flex space-x-4">
                        <div className="h-12 w-80 bg-white/5 rounded-2xl" />
                        <div className="h-12 w-32 bg-white/5 rounded-2xl" />
                    </div>
                </div>
                {/* Hero Skeleton */}
                <div className="h-64 w-full bg-white/5 rounded-[2.5rem]" />
                {/* Content Layout Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-4">
                        <div className="h-8 w-full bg-white/5 rounded-xl mb-8" />
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 w-full bg-white/[0.02] border border-white/5 rounded-3xl" />
                        ))}
                    </div>
                    <div className="space-y-8">
                        <div className="h-64 w-full bg-white/5 rounded-[2rem]" />
                        <div className="h-64 w-full bg-white/5 rounded-[2rem]" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#050505] text-white p-8"
        >
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        <Link to="/my-courses" className="hover:text-white transition-colors">Mis Cursos</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link to={`/courses/${courseId}/player`} className="hover:text-white transition-colors">{course?.title}</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-primary italic">Foro de Discusión</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar en los foros del curso..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-12 pl-12 pr-6 bg-white/5 border border-white/10 rounded-2xl w-80 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="h-12 px-6 bg-primary text-white rounded-2xl text-sm font-bold flex items-center shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:bg-primary/90 transition-all"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Hilo
                        </button>
                    </div>
                </div>

                {/* Hero Card */}
                <div className="glass rounded-[2.5rem] p-10 border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-transparent relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                        <div className="flex items-start space-x-8">
                            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] shrink-0">
                                <MessageSquare className="w-10 h-10 text-white fill-white/20" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <span className="bg-primary/20 text-primary text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">CURSO</span>
                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{course?.title}</span>
                                </div>
                                <h1 className="text-5xl font-black tracking-tighter">Foro de Discusión</h1>
                                <p className="text-gray-400 text-sm max-w-xl leading-relaxed font-medium">
                                    Un espacio para compartir dudas, colaborar en proyectos y discutir sobre las lecciones del curso con tus compañeros y mentores.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-8">
                            <div className="text-center">
                                <p className="text-3xl font-black">{topics?.length || 0}</p>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Hilos Activos</p>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div className="text-center">
                                <p className="text-3xl font-black">{topics?.reduce((acc: number, t: any) => acc + t._count.posts, 0) || 0}</p>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Comentarios</p>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div className="text-center">
                                <p className="text-3xl font-black text-green-500">{topics?.filter((t: any) => t.isResolved).length || 0}</p>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Resueltos</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* List Section */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Filters Bar */}
                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                            <div className="flex items-center space-x-6">
                                {['Todos', 'Recientes', 'Sin Respuesta', 'Mis Hilos'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveFilter(f)}
                                        className={`text-xs font-bold transition-all relative pb-2 ${activeFilter === f ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        {f}
                                        {activeFilter === f && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Filtrar por:</span>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold focus:outline-none transition-all cursor-pointer"
                                >
                                    <option>Cualquier categoría</option>
                                    <option value="ANNOUNCEMENT">Anuncios</option>
                                    <option value="QUESTION">Preguntas</option>
                                    <option value="PROPOSAL">Proyectos</option>
                                    <option value="GENERAL">General</option>
                                </select>
                            </div>
                        </div>

                        {/* Topics List */}
                        <div className="space-y-4">
                            {filteredTopics?.map((topic: any) => {
                                const cat = CATEGORY_MAP[topic.category] || CATEGORY_MAP.GENERAL;
                                return (
                                    <Link
                                        key={topic.id}
                                        to={`/courses/${courseId}/forum/${topic.id}`}
                                        className="block group"
                                    >
                                        <div className="glass rounded-3xl p-6 border-white/5 hover:border-white/20 transition-all bg-white/[0.02] hover:bg-white/[0.04]">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden">
                                                        <img
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.author.user.name}`}
                                                            alt="avatar"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center space-x-3">
                                                            <span className={`${cat.color} text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest flex items-center`}>
                                                                {cat.label}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-gray-500">
                                                                por <span className="text-gray-300">{topic.author.user.name}</span> • hace {new Date(topic.createdAt).toLocaleDateString()}
                                                            </span>
                                                            {topic.isPinned && <Pin className="w-3 h-3 text-primary fill-primary rotate-45" />}
                                                        </div>

                                                        <h3 className="text-xl font-black group-hover:text-primary transition-colors tracking-tight">
                                                            {topic.title}
                                                        </h3>
                                                        <p className="text-gray-500 text-sm line-clamp-1 font-medium">
                                                            {topic.content}
                                                        </p>

                                                        <div className="flex items-center space-x-6 pt-2">
                                                            <div className="flex items-center text-[10px] font-bold text-gray-500 space-x-1.5">
                                                                <MessageSquare className="w-3.5 h-3.5" />
                                                                <span>{topic._count.posts} respuestas</span>
                                                            </div>
                                                            <div className="flex items-center text-[10px] font-bold text-gray-500 space-x-1.5">
                                                                <Eye className="w-3.5 h-3.5" />
                                                                <span>{topic.views} vistas</span>
                                                            </div>
                                                            {topic.isResolved && (
                                                                <div className="flex items-center text-[10px] font-bold text-green-500 space-x-1.5">
                                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                                    <span>Resuelto</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic mb-2">Última actividad:</p>
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <span className="text-[11px] font-bold text-gray-400">Alex M.</span>
                                                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}

                            {filteredTopics?.length === 0 && (
                                <div className="py-20 text-center glass rounded-3xl border-dashed border-white/10">
                                    <MessageCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-gray-400">No se encontraron hilos</h3>
                                    <p className="text-sm text-gray-600 font-bold italic mt-2">¡Sé el primero en iniciar la conversación!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Categories Widget */}
                        <div className="glass rounded-[2rem] p-8 border-white/5 bg-white/[0.02]">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-8 flex items-center">
                                <Filter className="w-4 h-4 mr-3 text-primary" />
                                Categorías
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { id: 'ANNOUNCEMENT', title: 'Anuncios', color: 'bg-blue-500', count: topics?.filter((t: any) => t.category === 'ANNOUNCEMENT').length || 0 },
                                    { id: 'QUESTION', title: 'Preguntas', color: 'bg-orange-500', count: topics?.filter((t: any) => t.category === 'QUESTION').length || 0 },
                                    { id: 'PROPOSAL', title: 'Proyectos', color: 'bg-purple-500', count: topics?.filter((t: any) => t.category === 'PROPOSAL').length || 0 },
                                    { id: 'GENERAL', title: 'General', color: 'bg-gray-500', count: topics?.filter((t: any) => t.category === 'GENERAL').length || 0 }
                                ].map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategoryFilter(cat.id)}
                                        className="w-full flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                                            <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{cat.title}</span>
                                        </div>
                                        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-gray-600 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                            {cat.count}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Top Contributors */}
                        <div className="glass rounded-[2rem] p-8 border-white/5 bg-white/[0.02]">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-8">Top Contribuidores</h3>
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent border border-white/5" />
                                            <div>
                                                <p className="text-xs font-black text-white">Contribuidor {i}</p>
                                                <p className="text-[10px] font-bold text-gray-500">12 respuestas</p>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black text-primary italic">#{i}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Create Topic Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div
                        className="glass w-full max-w-2xl rounded-[2rem] p-8 border-white/10 bg-[#0A0A0A] shadow-2xl animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black tracking-tight flex items-center">
                                <MessageSquare className="w-6 h-6 mr-3 text-primary" />
                                Crear Nuevo Hilo
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTopic} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Título del Hilo</label>
                                <input
                                    type="text"
                                    value={newTopicTitle}
                                    onChange={(e) => setNewTopicTitle(e.target.value)}
                                    placeholder="Escribe un título descriptivo..."
                                    className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-6 text-white focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-gray-700"
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Categoría</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {Object.entries(CATEGORY_MAP).map(([key, value]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setNewTopicCategory(key)}
                                            className={`h-12 rounded-xl border flex items-center justify-center space-x-2 transition-all ${newTopicCategory === key
                                                ? 'bg-primary/20 border-primary text-white'
                                                : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${value.color}`} />
                                            <span className="text-xs font-bold">{value.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Contenido</label>
                                <textarea
                                    value={newTopicContent}
                                    onChange={(e) => setNewTopicContent(e.target.value)}
                                    placeholder="Describe tu pregunta o aporte en detalle..."
                                    className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-6 text-white focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-gray-700 resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="h-12 px-8 rounded-2xl text-sm font-bold text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newTopicTitle.trim() || !newTopicContent.trim() || createTopicMutation.isPending}
                                    className="h-12 px-8 bg-primary text-white rounded-2xl text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {createTopicMutation.isPending ? 'Publicando...' : 'Publicar Hilo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
