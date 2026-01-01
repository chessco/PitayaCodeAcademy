import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
    ChevronLeft, Play, CheckCircle, List, FileText, Info,
    Download, ArrowLeft, ArrowRight, MessageSquare, ChevronDown, ChevronUp,
    Lock, ChevronRight
} from 'lucide-react';

export default function CoursePlayer() {
    const { id } = useParams();
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'descripcion' | 'recursos' | 'discusion'>('descripcion');
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

    const { data: course, isLoading } = useQuery({
        queryKey: ['course-player', id],
        queryFn: async () => {
            if (!id) throw new Error('Course ID is required');
            const res = await api.get(`/courses/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    // Flatten lessons to match sidebar order: Modules first, then General lessons
    const allLessons = [
        ...(course?.modules?.flatMap((m: any) => (m.lessons || []).sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))) || []),
        ...(course?.lessons?.filter((l: any) => !l.moduleId).sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0)) || [])
    ];

    const activeLesson = allLessons.find((l: any) => l.id === (activeLessonId || allLessons[0]?.id));

    const currentIndex = allLessons.findIndex((l: any) => l.id === activeLesson?.id);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    // Dynamic Progress
    const totalLessons = allLessons.length;
    const completedCount = 0; // Mock until real enrollment data is added
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Helper to get YouTube Embed URL
    const getYoutubeEmbedUrl = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11)
            ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
            : url;
    };

    if (isLoading) return (
        <div className="h-screen bg-[#050505] flex animate-pulse">
            <div className="w-80 border-r border-white/5 bg-black/40" />
            <div className="flex-1 flex flex-col pt-16 px-12">
                <div className="aspect-video glass rounded-3xl" />
                <div className="mt-10 h-10 w-1/3 glass rounded-lg" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col -m-8">
            {/* Top Toolbar */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center space-x-4">
                    <Link to="/my-courses" className="flex items-center text-xs font-bold text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Dashboard
                    </Link>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-white/10 pr-6 mr-6">
                        <span className="hover:text-white cursor-pointer">Mis Cursos</span>
                        <span className="hover:text-white cursor-pointer">Comunidad</span>
                        <span className="hover:text-white cursor-pointer">Ayuda</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold border border-primary/30">
                            CR
                        </div>
                        <span className="text-sm font-bold text-gray-300">Carlos R.</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Curriculum (Left Side) */}
                <aside className="w-80 border-r border-white/5 flex flex-col bg-black/20 backdrop-blur-xl shrink-0 overflow-y-auto custom-scrollbar">
                    {/* Course Progress */}
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Progreso del Curso</span>
                            <span className="text-[10px] font-bold text-primary">{progressPercent}%</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mb-3 italic">{completedCount} de {totalLessons} Lecciones completadas</p>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>

                    <div className="flex-1 p-2">
                        {course.modules?.map((module: any, mIdx: number) => (
                            <div key={module.id} className="mb-2">
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group mb-1"
                                >
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase text-gray-500 mb-1">MÓDULO {mIdx + 1}</p>
                                        <p className="text-xs font-bold text-gray-200">{module.title.replace(/^Módulo \d+: /, '')}</p>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedModules[module.id] === false ? '' : 'rotate-180'}`} />
                                </button>

                                <div className={`space-y-1 mt-1 px-1 ${expandedModules[module.id] === false ? 'hidden' : 'block'}`}>
                                    {(module.lessons || []).sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((lesson: any) => {
                                        const isActive = (activeLessonId || allLessons[0]?.id) === lesson.id;
                                        const isCompleted = false; // Mock data

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => setActiveLessonId(lesson.id)}
                                                className={`w-full text-left p-3 rounded-xl transition-all flex items-start space-x-3 ${isActive
                                                    ? 'bg-primary/10 border border-primary/20 text-white'
                                                    : 'hover:bg-white/5 text-gray-500'
                                                    }`}
                                            >
                                                <div className="mt-0.5">
                                                    {isCompleted ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    ) : isActive ? (
                                                        <Play className="w-4 h-4 text-primary fill-primary" />
                                                    ) : (
                                                        <div className="w-4 h-4 rounded-full border border-gray-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-[12px] font-medium leading-tight mb-1 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                                        {lesson.title}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-gray-600 uppercase">
                                                        {isActive ? 'Reproduciendo' : '15 min'}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                        {/* Lessons without modules */}
                        {course.lessons?.filter((l: any) => !l.moduleId).length > 0 && (
                            <div className="mb-4 mt-2">
                                <div className="px-3 mb-2">
                                    <p className="text-[10px] font-black uppercase text-gray-500 mb-1">CONTENIDO GENERAL</p>
                                </div>
                                <div className="space-y-1 px-1">
                                    {course.lessons
                                        .filter((l: any) => !l.moduleId)
                                        .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
                                        .map((lesson: any) => {
                                            const isActive = (activeLessonId || allLessons[0]?.id) === lesson.id;
                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => setActiveLessonId(lesson.id)}
                                                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start space-x-3 ${isActive
                                                        ? 'bg-primary/10 border border-primary/20 text-white'
                                                        : 'hover:bg-white/5 text-gray-500'
                                                        }`}
                                                >
                                                    <div className="mt-0.5">
                                                        {isActive ? (
                                                            <Play className="w-4 h-4 text-primary fill-primary" />
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full border border-gray-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`text-[12px] font-medium leading-tight mb-1 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                                            {lesson.title}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-gradient-to-b from-black to-[#050505]">
                    <div className="max-w-5xl w-full mx-auto space-y-10 pb-20">
                        {/* Video Player Area */}
                        <div className="aspect-video glass rounded-3xl overflow-hidden relative group shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/5 bg-black">
                            {activeLesson?.videoUrl ? (
                                <div className="w-full h-full">
                                    {activeLesson.videoUrl.includes('youtube.com') || activeLesson.videoUrl.includes('youtu.be') ? (
                                        <iframe
                                            key={activeLesson.id}
                                            src={getYoutubeEmbedUrl(activeLesson.videoUrl) || ''}
                                            className="w-full h-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <video
                                            key={activeLesson.id}
                                            src={activeLesson.videoUrl}
                                            controls
                                            className="w-full h-full"
                                            poster={course.thumbnail}
                                        />
                                    )}
                                </div>
                            ) : (
                                <>
                                    {/* Abstract Wave Background Placeholder */}
                                    <div className="absolute inset-0 z-0">
                                        <div className="absolute inset-0 bg-black/60 z-10" />
                                        <img
                                            src={course.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}
                                            alt="background"
                                            className="w-full h-full object-cover opacity-30 grayscale"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-[150%] h-[150%] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse" />
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-8">
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                            <Lock className="w-8 h-8 text-gray-600" />
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-2">Contenido de solo lectura</h3>
                                        <p className="text-sm text-gray-500 max-w-sm">Esta lección no contiene video. Por favor, revisa la descripción y los recursos adjuntos.</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Lesson Header & Navigation */}
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                        <span>
                                            {course.modules?.find((m: any) => m.lessons.some((l: any) => l.id === activeLesson?.id))?.title.replace(/^Módulo \d+: /, '') || 'Contenido General'}
                                        </span>
                                        <ArrowRight className="w-3 h-3" />
                                        <span>Lección {currentIndex + 1} de {allLessons.length}</span>
                                    </div>
                                    <h1 className="text-4xl font-black tracking-tight text-white">{activeLesson?.title || 'Seleccionando lección...'}</h1>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => prevLesson && setActiveLessonId(prevLesson.id)}
                                        disabled={!prevLesson}
                                        className="h-10 px-6 rounded-xl border border-white/10 text-xs font-bold bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Anterior
                                    </button>
                                    <button className="h-10 px-6 rounded-xl bg-primary text-white text-xs font-bold flex items-center hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Marcar como Completado
                                    </button>
                                    <button
                                        onClick={() => nextLesson && setActiveLessonId(nextLesson.id)}
                                        disabled={!nextLesson}
                                        className="h-10 px-6 rounded-xl border border-white/10 text-xs font-bold bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center"
                                    >
                                        Siguiente
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="border-b border-white/5">
                                <div className="flex space-x-8">
                                    {(['descripcion', 'recursos', 'discusion'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pb-4 text-[12px] font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-primary' : 'text-gray-500 hover:text-white'
                                                }`}
                                        >
                                            {tab === 'descripcion' ? 'Descripción' : tab === 'recursos' ? `Recursos (${activeLesson?.resources?.length || 0})` : 'Discusión'}
                                            {activeTab === tab && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content based on Tabs */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                <div className="lg:col-span-2 space-y-8">
                                    {activeTab === 'descripcion' && (
                                        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-sm">
                                            <p className="mb-6">{activeLesson?.content || 'Selecciona una lección para ver su contenido.'}</p>

                                            <h3 className="text-white font-bold mb-4">Lo que aprenderás:</h3>
                                            <ul className="space-y-4 list-none p-0">
                                                {[
                                                    'Los significados psicológicos de los colores primarios en UI.',
                                                    'Cómo crear paletas de colores accesibles según WCAG.',
                                                    'El uso del color para guiar la atención del usuario (Jerarquía Visual).',
                                                    'La regla del 60-30-10 para la distribución del color.'
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <p className="mt-8 italic text-gray-400">
                                                Prepárate para realizar ejercicios prácticos donde analizaremos aplicaciones populares y deconstruiremos sus decisiones cromáticas.
                                            </p>
                                        </div>
                                    )}

                                    {activeTab === 'recursos' && (
                                        <div className="space-y-4">
                                            {activeLesson?.resources && activeLesson.resources.length > 0 ? (
                                                activeLesson.resources.map((res: any) => (
                                                    <a
                                                        key={res.id}
                                                        href={res.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-4 glass rounded-2xl border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${res.fileType === 'PDF' ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
                                                                <FileText className={`w-5 h-5 ${res.fileType === 'PDF' ? 'text-red-500' : 'text-blue-500'}`} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-200">{res.title}</p>
                                                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{res.fileSize || (res.fileType || 'Archivo')}</p>
                                                            </div>
                                                        </div>
                                                        <Download className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                                                    </a>
                                                ))
                                            ) : (
                                                <div className="p-12 text-center rounded-3xl border border-dashed border-white/10">
                                                    <Info className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                                                    <p className="text-sm font-bold text-gray-500">No hay recursos adicionales para esta lección.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'discusion' && (
                                        <div className="space-y-8">
                                            <div className="glass rounded-[2rem] p-10 border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-transparent relative overflow-hidden text-center">
                                                <div className="relative z-10 space-y-6">
                                                    <div className="w-20 h-20 rounded-3xl bg-primary mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                                        <MessageSquare className="w-10 h-10 text-white fill-white/20" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="text-2xl font-black tracking-tight text-white">Comunidad del Curso</h3>
                                                        <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                                                            ¿Tienes dudas sobre esta lección? Únete a la conversación en el foro oficial del curso.
                                                        </p>
                                                    </div>
                                                    <Link
                                                        to={`/courses/${id}/forum`}
                                                        className="inline-flex items-center h-12 px-8 bg-primary text-white rounded-2xl text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-primary/90 transition-all group"
                                                    >
                                                        Ir al Foro de Discusión
                                                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                                            </div>

                                            <div className="p-8 border border-white/5 rounded-3xl bg-white/[0.02] flex items-start space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                                    <Info className="w-5 h-5 text-blue-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-gray-200">Consejo de Mentor</p>
                                                    <p className="text-xs text-gray-500 leading-relaxed">
                                                        Revisa si otros estudiantes ya han tenido la misma duda. El foro es una excelente herramienta de aprendizaje colaborativo.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {/* Related Resources Widget */}
                                    <div className="glass rounded-3xl p-6 border-white/5">
                                        <div className="flex items-center space-x-2 text-primary mb-6">
                                            <List className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Recursos de la Lección</span>
                                        </div>
                                        <div className="space-y-4">
                                            {activeLesson?.resources && activeLesson.resources.length > 0 ? (
                                                activeLesson.resources.map((res: any) => (
                                                    <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${res.fileType === 'PDF' ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
                                                                <FileText className={`w-4 h-4 ${res.fileType === 'PDF' ? 'text-red-500' : 'text-blue-500'}`} />
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <p className="text-xs font-bold text-gray-300 truncate">{res.title}</p>
                                                                <p className="text-[8px] font-black text-gray-600 uppercase">{res.fileSize || res.fileType}</p>
                                                            </div>
                                                        </div>
                                                        <Download className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                                                    </a>
                                                ))
                                            ) : (
                                                <p className="text-[10px] font-bold text-gray-600 text-center py-4">Sin recursos adjuntos</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Instructor Card */}
                                    <div className="glass rounded-3xl p-6 border-white/5 flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-400 overflow-hidden shrink-0 border border-white/10 p-0.5">
                                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover rounded-[14px]" alt="instructor" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white">{course.instructor?.user?.name || 'Ana García'}</p>
                                            <p className="text-[10px] font-medium text-gray-500">Senior Product Designer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Next Lesson Preview */}
                            <div className="mt-12 pt-12 border-t border-white/5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">SIGUIENTE LECCIÓN</p>
                                {nextLesson ? (
                                    <button
                                        onClick={() => setActiveLessonId(nextLesson.id)}
                                        className="w-full flex items-center space-x-6 p-6 glass border-white/5 rounded-[2rem] hover:border-primary/20 hover:bg-primary/[0.02] transition-all group text-left"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                                            <Lock className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-white mb-1">Lección {currentIndex + 2}: {nextLesson.title}</p>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                {course.modules?.find((m: any) => m.lessons.some((l: any) => l.id === nextLesson.id))?.title || 'Módulo Siguiente'} • 20 min
                                            </p>
                                        </div>
                                    </button>
                                ) : (
                                    <div className="p-12 text-center glass rounded-3xl border-dashed border-white/10">
                                        <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4 opacity-50" />
                                        <p className="text-sm font-bold text-gray-500">¡Has llegado al final del curso! Felicidades.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
