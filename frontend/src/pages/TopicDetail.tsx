import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
    ArrowLeft, MessageSquare, Send, CheckCircle,
    MoreVertical, Share2, Pin, Trash2, Edit3,
    HelpCircle, Lightbulb, MessageCircle
} from 'lucide-react';

const CATEGORY_MAP: Record<string, { label: string, color: string, icon: any }> = {
    ANNOUNCEMENT: { label: 'ANUNCIO', color: 'bg-blue-500', icon: MessageSquare },
    QUESTION: { label: 'PREGUNTA', color: 'bg-orange-500', icon: HelpCircle },
    PROPOSAL: { label: 'APORTE', color: 'bg-purple-500', icon: Lightbulb },
    GENERAL: { label: 'GENERAL', color: 'bg-gray-500', icon: MessageCircle }
};

export default function TopicDetail() {
    const { id: courseId, topicId } = useParams();
    const queryClient = useQueryClient();
    const [replyContent, setReplyContent] = useState('');

    const { data: topic, isLoading } = useQuery({
        queryKey: ['topic-detail', topicId],
        queryFn: async () => {
            const res = await api.get(`/discussions/topic/${topicId}`);
            return res.data;
        }
    });

    const replyMutation = useMutation({
        mutationFn: async (content: string) => {
            return api.post('/discussions/post', {
                topicId,
                content
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['topic-detail', topicId] });
            setReplyContent('');
        }
    });

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        replyMutation.mutate(replyContent);
    };

    if (isLoading) return (
        <div className="min-h-screen bg-[#050505] p-8 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        </div>
    );

    const cat = CATEGORY_MAP[topic.category] || CATEGORY_MAP.GENERAL;
    const Icon = cat.icon;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Back Link */}
                <Link
                    to={`/courses/${courseId}/forum`}
                    className="inline-flex items-center text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al foro
                </Link>

                {/* Main Topic Header */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                        <span className={`${cat.color} text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest`}>
                            {cat.label}
                        </span>
                        {topic.isPinned && (
                            <span className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest flex items-center">
                                <Pin className="w-3 h-3 mr-1.5 fill-primary" />
                                FIJADO
                            </span>
                        )}
                        {topic.isResolved && (
                            <span className="bg-green-500/20 text-green-500 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1.5" />
                                RESUELTO
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl font-black tracking-tighter leading-tight">
                        {topic.title}
                    </h1>

                    <div className="flex items-center justify-between py-4 border-y border-white/5">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent border border-white/10 overflow-hidden">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.author.user.name}`}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white">{topic.author.user.name}</p>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    Publicado el {new Date(topic.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Share2 className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Topic Content */}
                <div className="glass rounded-[2rem] p-10 border-white/5 bg-white/[0.01] leading-relaxed text-gray-300">
                    <p className="whitespace-pre-wrap">{topic.content}</p>
                </div>

                {/* Replies Section */}
                <div className="space-y-6 pt-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black tracking-tight flex items-center">
                            <MessageSquare className="w-5 h-5 mr-3 text-primary" />
                            Respuestas ({topic.posts.length})
                        </h2>
                        <div className="h-px flex-1 bg-white/5 mx-8" />
                    </div>

                    <div className="space-y-6">
                        {topic.posts.map((post: any) => (
                            <div key={post.id} className="flex space-x-6">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 mt-2">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.user.name}`}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="glass rounded-[1.5rem] p-6 border-white/5 bg-white/[0.02] relative group">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <p className="text-[12px] font-black text-white">{post.author.user.name}</p>
                                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    {new Date(post.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                                            {post.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reply Form */}
                <div className="pt-12">
                    <div className="glass rounded-[2rem] p-8 border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent shadow-2xl">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                                <Edit3 className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-black tracking-tight">Tu Respuesta</h3>
                        </div>

                        <form onSubmit={handleReply} className="space-y-4">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Escribe tu comentario aquí..."
                                className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-6 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:italic"
                            />
                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    disabled={replyMutation.isPending || !replyContent.trim()}
                                    className="px-8 h-12 bg-primary text-white rounded-2xl text-sm font-black flex items-center shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-all group"
                                >
                                    <span>Publicar Comentario</span>
                                    <Send className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
