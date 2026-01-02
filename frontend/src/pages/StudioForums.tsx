import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
    MessageSquare, Search, Filter, ThumbsUp, Trash2,
    Pin, CheckCircle2, MoreHorizontal, User, Send,
    ChevronRight, AlertCircle, Plus, PinOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function StudioForums() {
    const queryClient = useQueryClient();
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'Todos' | 'Sin responder' | 'Reportados'>('Todos');
    const [replyContent, setReplyContent] = useState('');

    const { data: topics, isLoading: loadingTopics } = useQuery({
        queryKey: ['studio-topics'],
        queryFn: async () => {
            const res = await api.get('/discussions/studio');
            return res.data;
        }
    });

    const { data: topicDetail, isLoading: loadingDetail } = useQuery({
        queryKey: ['topic-detail', selectedTopicId],
        queryFn: async () => {
            if (!selectedTopicId) return null;
            const res = await api.get(`/discussions/topic/${selectedTopicId}`);
            return res.data;
        },
        enabled: !!selectedTopicId
    });

    const createPostMutation = useMutation({
        mutationFn: async (content: string) => {
            return api.post('/discussions/post', { topicId: selectedTopicId, content });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['topic-detail', selectedTopicId] });
            queryClient.invalidateQueries({ queryKey: ['studio-topics'] });
            setReplyContent('');
        }
    });

    const updateTopicMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            return api.patch(`/discussions/topic/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studio-topics'] });
            queryClient.invalidateQueries({ queryKey: ['topic-detail', selectedTopicId] });
        }
    });

    const deleteTopicMutation = useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/discussions/topic/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studio-topics'] });
            setSelectedTopicId(null);
        }
    });

    const filteredTopics = topics?.filter((t: any) => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.content.toLowerCase().includes(searchQuery.toLowerCase());
        if (filter === 'Sin responder') return t._count.posts === 0 && matchesSearch;
        // Mock 'Reportados' logic since not in schema yet
        if (filter === 'Reportados') return false;
        return matchesSearch;
    }) || [];

    if (loadingTopics) return (
        <div className="flex h-[calc(100vh-120px)] items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-120px)] -m-10 lg:-mx-12 bg-[#0c0c0e] border-t border-white/5 overflow-hidden">
            {/* Left Sidebar: Topic List */}
            <div className="w-[450px] border-r border-white/5 flex flex-col bg-[#111114]">
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-black text-white tracking-tight">Gestión de Foros</h1>
                        <button className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar preguntas, estudiantes..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-xs font-medium text-gray-300 focus:outline-none focus:border-primary/50 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl">
                        {['Todos', 'Sin responder', 'Reportados'].map((f: any) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === f ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                    <div className="divide-y divide-white/5">
                        {filteredTopics.map((topic: any) => (
                            <button
                                key={topic.id}
                                onClick={() => setSelectedTopicId(topic.id)}
                                className={`w-full text-left p-8 transition-all relative group ${selectedTopicId === topic.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-white/[0.01]'
                                    }`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${topic.course.title.includes('React') ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                                            }`}>
                                            {topic.course.title}
                                        </span>
                                        <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-600">
                                            {topic.isPinned && <Pin className="w-3 h-3 text-primary fill-primary" />}
                                            <span>Hace 2h</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className={`text-sm font-black transition-colors ${selectedTopicId === topic.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                            {topic.title}
                                        </h3>
                                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 font-medium leading-relaxed">
                                            {topic.content}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-5 h-5 rounded-full bg-white/10 overflow-hidden border border-white/10">
                                                <img src={`https://i.pravatar.cc/50?u=${topic.author.user.email}`} alt="avatar" />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400">{topic.author.user.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5 text-gray-600">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-black">{topic._count.posts}</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Pane: Discussion Detail */}
            <div className="flex-1 flex flex-col bg-[#0c0c0e]">
                <AnimatePresence mode="wait">
                    {!selectedTopicId ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 flex flex-col items-center justify-center space-y-6"
                        >
                            <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center text-gray-700">
                                <MessageSquare className="w-10 h-10" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-black text-white">Selecciona una discusión</h3>
                                <p className="text-sm text-gray-600 font-medium">Elige un hilo de la izquierda para empezar a responder.</p>
                            </div>
                        </motion.div>
                    ) : loadingDetail ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <motion.div
                            key={selectedTopicId}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 flex flex-col h-full overflow-hidden"
                        >
                            {/* Detail Header */}
                            <div className="p-10 pb-0 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                                        <span className="text-primary">{topicDetail.course.title}</span>
                                        <ChevronRight className="w-3 h-3 opacity-50" />
                                        <span>Módulo 4: Hooks</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white tracking-tight leading-tight max-w-[800px]">
                                        {topicDetail.title}
                                    </h2>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => updateTopicMutation.mutate({ id: topicDetail.id, data: { isPinned: !topicDetail.isPinned } })}
                                        className={`p-3 bg-white/5 rounded-xl border border-white/5 transition-all ${topicDetail.isPinned ? 'text-primary border-primary/20' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        {topicDetail.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => updateTopicMutation.mutate({ id: topicDetail.id, data: { isResolved: !topicDetail.isResolved } })}
                                        className={`p-3 bg-white/5 rounded-xl border border-white/5 transition-all ${topicDetail.isResolved ? 'text-emerald-500 border-emerald-500/20' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => { if (window.confirm('¿Eliminar discusión?')) deleteTopicMutation.mutate(topicDetail.id); }}
                                        className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Thread Content */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
                                {/* OP */}
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 overflow-hidden border border-white/10 shrink-0">
                                        <img src={`https://i.pravatar.cc/100?u=${topicDetail.author.user.email}`} alt="avatar" />
                                    </div>
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-black text-white">{topicDetail.author.user.name}</span>
                                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{format(new Date(topicDetail.createdAt), "HH:mm '•' d MMM", { locale: es })}</span>
                                        </div>
                                        <div className="text-[15px] text-gray-300 font-medium leading-relaxed whitespace-pre-wrap selection:bg-primary/30">
                                            {topicDetail.content}
                                        </div>
                                        <div className="flex items-center space-x-6 pt-2">
                                            <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-primary transition-colors">
                                                <Send className="w-3.5 h-3.5" />
                                                <span>Responder</span>
                                            </button>
                                            <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-red-400 transition-colors">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                <span>Reportar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Replies */}
                                <div className="space-y-12 relative">
                                    <div className="absolute left-6 top-[-20px] bottom-10 w-px bg-white/5" />

                                    <div className="flex items-center space-x-4 ml-6 relative">
                                        <div className="h-px w-8 bg-white/10" />
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Respuestas ({topicDetail.posts.length})</span>
                                        <div className="flex-1 h-px bg-white/10" />
                                    </div>

                                    {topicDetail.posts.map((post: any) => (
                                        <div key={post.id} className="flex gap-6 relative ml-6">
                                            <div className="w-10 h-10 rounded-2xl bg-white/10 overflow-hidden border border-white/10 shrink-0 relative z-10">
                                                <img src={`https://i.pravatar.cc/100?u=${post.author.user.email}`} alt="avatar" />
                                            </div>
                                            <div className={`p-8 rounded-[2rem] border border-white/5 flex-1 relative ${post.author.role === 'INSTRUCTOR' ? 'bg-primary/5 border-primary/20' : 'bg-white/[0.02]'
                                                }`}>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-sm font-black text-white">{post.author.user.name}</span>
                                                        {post.author.role === 'INSTRUCTOR' && (
                                                            <span className="bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shadow-lg shadow-primary/20">INSTRUCTOR</span>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-600">{format(new Date(post.createdAt), "HH:mm '•' d MMM", { locale: es })}</span>
                                                </div>
                                                <div className="text-[14px] text-gray-300 font-medium leading-relaxed whitespace-pre-wrap">
                                                    {post.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reply Editor */}
                            <div className="p-10 bg-[#111114] border-t border-white/5">
                                <div className="bg-[#09090b] border border-white/10 rounded-[2.5rem] p-6 focus-within:border-primary/50 transition-all shadow-2xl">
                                    <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-white/5">
                                        <button className="p-2 text-gray-600 hover:text-white transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                                        <div className="flex-1" />
                                        <div className="flex items-center space-x-3 opacity-50">
                                            <button className="p-2 text-gray-600 hover:text-white transition-colors italic">I</button>
                                            <button className="p-2 text-gray-600 hover:text-white transition-colors font-bold">B</button>
                                        </div>
                                    </div>
                                    <textarea
                                        className="w-full bg-transparent text-sm text-gray-300 font-medium placeholder:text-gray-700 focus:outline-none min-h-[100px] resize-none px-2 no-scrollbar"
                                        placeholder={`Escribe una respuesta para ${topicDetail.author.user.name.split(' ')[0]}...`}
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                    />
                                    <div className="flex items-center justify-between mt-4">
                                        <p className="text-[10px] font-bold text-gray-700 tracking-wider">Presiona Enter para enviar</p>
                                        <button
                                            disabled={!replyContent.trim() || createPostMutation.isPending}
                                            onClick={() => createPostMutation.mutate(replyContent)}
                                            className="px-8 py-3.5 bg-primary text-white text-xs font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center space-x-3"
                                        >
                                            {createPostMutation.isPending ? 'Enviando...' : 'Publicar respuesta'}
                                            {!createPostMutation.isPending && <ChevronRight className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
