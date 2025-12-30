import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ChevronLeft, Play, CheckCircle, List, FileText, Info } from 'lucide-react';

export default function CoursePlayer() {
    const { id } = useParams();
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

    const { data: course, isLoading } = useQuery({
        queryKey: ['course-player', id],
        queryFn: async () => {
            const res = await api.get(`/courses/${id}`);
            return res.data;
        },
    });

    const activeLesson = course?.lessons?.find((l: any) => l.id === (activeLessonId || course.lessons[0]?.id));

    if (isLoading) return <div className="h-screen bg-background flex animate-pulse">
        <div className="flex-1 glass" />
        <div className="w-80 glass ml-4" />
    </div>;

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col -m-8">
            {/* Top Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md">
                <Link to="/" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Volver a la Academia
                </Link>
                <h2 className="text-sm font-bold tracking-tight text-gray-300">{course.title}</h2>
                <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-primary" />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase">30% COMPLETO</span>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto custom-scrollbar">
                    <div className="max-w-4xl w-full mx-auto space-y-10">
                        {/* Video Container */}
                        <div className="aspect-video glass rounded-3xl overflow-hidden relative group shadow-2xl border-white/10">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-black z-0" />
                            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center space-y-4">
                                <Play className="w-20 h-20 text-primary animate-pulse" />
                                <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">Streaming lesson content...</p>
                            </div>

                            {/* Controls Mockup */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                <div className="w-2/3 h-full bg-primary" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-4xl font-black">{activeLesson?.title || 'Selecciona una lección'}</h1>
                                <button className="flex items-center space-x-2 px-5 py-2 bg-green-500/20 text-green-500 border border-green-500/30 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Marcar como completada</span>
                                </button>
                            </div>

                            <div className="flex space-x-4">
                                <button className="flex items-center text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary pb-2">
                                    <Info className="w-4 h-4 mr-2" /> Información
                                </button>
                                <button className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-500 pb-2 hover:text-white transition-colors">
                                    <list className="w-4 h-4 mr-2" /> Recursos
                                </button>
                            </div>

                            <div className="prose prose-invert max-w-none text-gray-400 leading-loose">
                                <p>{activeLesson?.content || 'En esta lección aprenderás los fundamentos necesarios para dominar este módulo. Sigue los pasos del video para completar el ejercicio práctico.'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Curriculum */}
                <aside className="w-96 border-l border-white/5 flex flex-col bg-card/10 backdrop-blur-xl">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Contenido</span>
                        <FileText className="w-4 h-4 text-gray-500" />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        <div className="space-y-1">
                            {course.lessons?.map((lesson: any, idx: number) => (
                                <button
                                    key={lesson.id}
                                    onClick={() => setActiveLessonId(lesson.id)}
                                    className={`w-full text-left p-4 rounded-xl transition-all flex items-center space-x-4 border-l-4 ${(activeLessonId || course.lessons[0]?.id) === lesson.id
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'hover:bg-white/5 border-transparent text-gray-400'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${(activeLessonId || course.lessons[0]?.id) === lesson.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/5'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold truncate leading-none mb-1">{lesson.title}</p>
                                        <p className="text-[10px] font-black text-gray-600 uppercase">15:00 MIN</p>
                                    </div>
                                    {(activeLessonId || course.lessons[0]?.id) === lesson.id && (
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
