import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
    ChevronRight, Save, X, Eye, Info, Layout, GripVertical,
    Plus, Clock, CheckCircle, Smartphone, Globe, Shield,
    Upload, MoreVertical, Bold, Italic, Underline, List, Link as LinkIcon,
    ChevronDown, FileText, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // New Lesson State
    const [isAddingLesson, setIsAddingLesson] = useState(false);
    const [newLessonData, setNewLessonData] = useState({
        title: '',
        content: '',
        videoUrl: '',
        sortOrder: 0
    });

    // Resource State
    const [isAddingResource, setIsAddingResource] = useState(false);
    const [activeLessonForResource, setActiveLessonForResource] = useState<string | null>(null);
    const [newResourceData, setNewResourceData] = useState({
        title: '',
        url: '',
        fileSize: '',
        fileType: 'PDF'
    });

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Desarrollo Web',
        price: '49.99',
        level: 'Avanzado',
        isPublished: false,
        thumbnail: ''
    });

    const { data: course, isLoading } = useQuery({
        queryKey: ['course-editor', id],
        queryFn: async () => {
            const res = await api.get(`/courses/${id}`);
            return res.data;
        },
    });

    useEffect(() => {
        if (course) {
            setFormData({
                title: course.title || '',
                description: course.description || '',
                category: course.category || 'Desarrollo Web',
                price: course.price?.toString() || '49.99',
                level: course.level || 'Avanzado',
                isPublished: course.isPublished || false,
                thumbnail: course.thumbnail || ''
            });
        }
    }, [course]);

    const saveMutation = useMutation({
        mutationFn: async (updatedData: any) => {
            return api.patch(`/courses/${id}`, updatedData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-editor', id] });
            queryClient.invalidateQueries({ queryKey: ['studio-courses'] });
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: (error) => {
            console.error('Error saving course:', error);
            setIsSaving(false);
            alert('Error al guardar los cambios: ' + ((error as any).response?.data?.message || error.message));
        }
    });

    const handleSave = () => {
        setIsSaving(true);
        saveMutation.mutate({
            ...formData,
            price: parseFloat(formData.price)
        });
    };

    const addLessonMutation = useMutation({
        mutationFn: async (data: any) => {
            return api.post(`/courses/${id}/lessons`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-editor', id] });
            setIsAddingLesson(false);
            setNewLessonData({ title: '', content: '', videoUrl: '', sortOrder: (course?.lessons?.length || 0) + 1 });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: (error) => {
            console.error('Error adding lesson:', error);
            alert('Error al añadir la lección: ' + ((error as any).response?.data?.message || error.message));
        }
    });

    const handleAddLesson = () => {
        addLessonMutation.mutate({
            ...newLessonData,
            sortOrder: (course?.lessons?.length || 0) + 1
        });
    };

    const addResourceMutation = useMutation({
        mutationFn: async ({ lessonId, data }: { lessonId: string, data: any }) => {
            return api.post(`/courses/${id}/lessons/${lessonId}/resources`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-editor', id] });
            setIsAddingResource(false);
            setNewResourceData({ title: '', url: '', fileSize: '', fileType: 'PDF' });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: (error) => {
            console.error('Error adding resource:', error);
            alert('Error al añadir el recurso: ' + ((error as any).response?.data?.message || error.message));
        }
    });

    const handleAddResource = () => {
        if (!activeLessonForResource) return;
        addResourceMutation.mutate({
            lessonId: activeLessonForResource,
            data: newResourceData
        });
    };

    const removeResourceMutation = useMutation({
        mutationFn: async ({ lessonId, resourceId }: { lessonId: string, resourceId: string }) => {
            return api.delete(`/courses/${id}/lessons/${lessonId}/resources/${resourceId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-editor', id] });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
    });

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#09090b] text-white">
            {/* Top Bar */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-[#09090b]/80 backdrop-blur-xl z-50">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Layout className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black">Editor de Cursos</h2>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest"
                            >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>CAMBIOS GUARDADOS</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Link to={`/courses/${id}`} target="_blank" className="flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                        <Eye className="w-4 h-4" />
                        <span>Vista Previa</span>
                    </Link>
                    <div className="w-px h-6 bg-white/10 mx-2" />
                    <button
                        onClick={() => navigate('/studio')}
                        className="px-6 py-3 text-xs font-bold text-gray-500 hover:text-white transition-colors"
                    >
                        Descartar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        className="flex items-center space-x-2 px-8 py-3 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saveMutation.isPending ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : <Save className="w-4 h-4" />}
                        <span>GUARDAR CAMBIOS</span>
                    </button>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto p-12 lg:p-16">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-3 text-[11px] font-bold text-gray-600 mb-8 uppercase tracking-widest">
                    <Link to="/studio" className="hover:text-primary transition-colors">Inicio</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="hover:text-primary transition-colors cursor-pointer">Mis Cursos</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-400">Editando: {formData.title}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Left Column - Main Content */}
                    <div className="flex-1 space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black tracking-tight">{formData.title || 'Nuevo Curso'}</h1>
                            <p className="text-gray-500 font-medium max-w-2xl">Gestiona los detalles, el precio y el contenido del plan de estudios.</p>
                        </div>

                        {/* Basic Info Section */}
                        <section className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center space-x-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Info className="w-4 h-4 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-black tracking-tight">Información Básica</h3>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Título del Curso</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-[1.5rem] text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                                        placeholder="Ej. Curso de React Avanzado: Hooks y Patrones"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Descripción</label>
                                    <div className="border border-white/10 rounded-[1.5rem] overflow-hidden">
                                        <div className="flex items-center space-x-1 p-3 bg-white/[0.02] border-b border-white/5">
                                            <EditorAction icon={<Bold className="w-3.5 h-3.5" />} />
                                            <EditorAction icon={<Italic className="w-3.5 h-3.5" />} />
                                            <EditorAction icon={<Underline className="w-3.5 h-3.5" />} />
                                            <div className="w-px h-4 bg-white/5 mx-2" />
                                            <EditorAction icon={<List className="w-3.5 h-3.5" />} />
                                            <EditorAction icon={<LinkIcon className="w-3.5 h-3.5" />} />
                                        </div>
                                        <textarea
                                            rows={6}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-transparent p-6 text-sm font-medium text-gray-400 focus:outline-none leading-relaxed resize-none"
                                            placeholder="Introduce una descripción detallada del curso..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Curriculum Section */}
                        <section className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <Layout className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-black tracking-tight">Plan de Estudios</h3>
                                </div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{course?.lessons?.length || 0} Lecciones</span>
                            </div>
                            <div className="p-10 space-y-6">
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Arrastra las lecciones para reordenar la secuencia del curso.</p>

                                <div className="space-y-3">
                                    {course?.lessons?.map((lesson: any, idx: number) => (
                                        <div key={lesson.id} className="space-y-2">
                                            <div className="flex items-center p-5 bg-[#09090b]/50 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                                                <button className="mr-4 text-gray-700 hover:text-gray-400 cursor-grab active:cursor-grabbing">
                                                    <GripVertical className="w-5 h-5" />
                                                </button>
                                                <div className="flex-1 flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-xs font-black text-gray-600">{idx + 1}.</span>
                                                        <span className="text-sm font-bold text-gray-200">{lesson.title}</span>
                                                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase rounded border border-emerald-500/20">Publicado</span>
                                                    </div>
                                                    <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-gray-600">
                                                        <button
                                                            onClick={() => {
                                                                setActiveLessonForResource(lesson.id);
                                                                setIsAddingResource(true);
                                                            }}
                                                            className="flex items-center hover:text-primary transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3 mr-1.5" />
                                                            <span>Recurso</span>
                                                        </button>
                                                        <div className="flex items-center">
                                                            <Clock className="w-3 h-3 mr-1.5" />
                                                            <span>12:45</span>
                                                        </div>
                                                        <button className="p-1.5 hover:bg-white/5 rounded-lg transition-all">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Resource List for this lesson */}
                                            {lesson.resources && lesson.resources.length > 0 && (
                                                <div className="ml-12 space-y-2">
                                                    {lesson.resources.map((res: any) => (
                                                        <div key={res.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl group">
                                                            <div className="flex items-center space-x-3">
                                                                <FileText className="w-3.5 h-3.5 text-gray-500" />
                                                                <span className="text-[11px] font-bold text-gray-400">{res.title}</span>
                                                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{res.fileType || 'Archivo'}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => removeResourceMutation.mutate({ lessonId: lesson.id, resourceId: res.id })}
                                                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => setIsAddingLesson(true)}
                                        className="w-full py-6 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center space-x-3 text-gray-600 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all group mt-4">
                                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-black uppercase tracking-widest font-sans">Añadir Nueva Lección</span>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Sidebar Config */}
                    <div className="w-full lg:w-96 space-y-8 lg:sticky lg:top-32">
                        {/* Status Widget */}
                        <SidebarWidget title="ESTADO Y VISIBILIDAD">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-[11px] font-bold text-gray-500">Estado actual</span>
                                <span className={`px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded-lg border border-amber-500/20`}>
                                    {formData.isPublished ? 'PUBLICADO' : 'EN BORRADOR'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                                <span className="text-xs font-bold text-gray-300">Publicar curso</span>
                                <button
                                    onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                                    className={`w-12 h-6 rounded-full relative transition-all ${formData.isPublished ? 'bg-primary' : 'bg-gray-800'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isPublished ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </SidebarWidget>

                        {/* Configuration Widget */}
                        <SidebarWidget title="CONFIGURACIÓN">
                            <div className="space-y-6">
                                <SidebarSelect
                                    label="Categoría"
                                    value={formData.category}
                                    onChange={(v: string) => setFormData({ ...formData, category: v })}
                                    options={['Desarrollo Web', 'Diseño', 'Marketing', 'Negocios']}
                                />
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Precio (USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-[#09090b] border border-white/10 p-4 pl-10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                    </div>
                                </div>
                                <SidebarSelect
                                    label="Nivel"
                                    value={formData.level}
                                    onChange={(v: string) => setFormData({ ...formData, level: v })}
                                    options={['Principiante', 'Intermedio', 'Avanzado', 'Experto']}
                                />
                            </div>
                        </SidebarWidget>

                        {/* Thumbnail Widget */}
                        <SidebarWidget title="IMAGEN DE PORTADA">
                            <div className="aspect-video w-full rounded-2xl bg-[#09090b] border border-white/10 relative overflow-hidden group mb-4">
                                {formData.thumbnail ? (
                                    <img src={formData.thumbnail} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 animate-pulse">
                                        <Layout className="w-10 h-10 mb-2" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button className="p-3 bg-primary text-white rounded-xl shadow-xl hover:scale-110 transition-transform">
                                        <Upload className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <button className="w-full text-[11px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors">
                                Cambiar imagen
                            </button>
                            <p className="text-[9px] text-center text-gray-600 mt-4 leading-relaxed font-bold">Recomendado: 1280×720px .JPG, .PNG</p>
                        </SidebarWidget>
                    </div>
                </div>
            </main>

            {/* Add Lesson Modal */}
            <AnimatePresence>
                {isAddingLesson && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-white">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddingLesson(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-[#111114] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-xl font-black tracking-tight">Nueva Lección</h3>
                                <button onClick={() => setIsAddingLesson(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Título de la Lección</label>
                                    <input
                                        type="text"
                                        value={newLessonData.title}
                                        onChange={(e) => setNewLessonData({ ...newLessonData, title: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                                        placeholder="Ej. Introducción a los Componentes"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">URL del Video (Opcional)</label>
                                    <input
                                        type="text"
                                        value={newLessonData.videoUrl}
                                        onChange={(e) => setNewLessonData({ ...newLessonData, videoUrl: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                                        placeholder="Ej. https://youtube.com/..."
                                    />
                                </div>
                                <div className="pt-4 flex items-center justify-end space-x-4">
                                    <button
                                        onClick={() => setIsAddingLesson(false)}
                                        className="px-6 py-3 text-xs font-bold text-gray-500 hover:text-white transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleAddLesson}
                                        disabled={!newLessonData.title || addLessonMutation.isPending}
                                        className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center space-x-2"
                                    >
                                        {addLessonMutation.isPending && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        <span>{addLessonMutation.isPending ? 'CREANDO...' : 'CREAR LECCIÓN'}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Add Resource Modal */}
            <AnimatePresence>
                {isAddingResource && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-white">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddingResource(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-[#111114] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-xl font-black tracking-tight">Nuevo Recurso</h3>
                                <button onClick={() => setIsAddingResource(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Título del Recurso</label>
                                    <input
                                        type="text"
                                        value={newResourceData.title}
                                        onChange={(e) => setNewResourceData({ ...newResourceData, title: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                                        placeholder="Ej. Guía Práctica de Hooks"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">URL del Archivo</label>
                                    <input
                                        type="text"
                                        value={newResourceData.url}
                                        onChange={(e) => setNewResourceData({ ...newResourceData, url: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                                        placeholder="Ej. https://storage.com/pdf/guia.pdf"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tipo</label>
                                        <select
                                            value={newResourceData.fileType}
                                            onChange={(e) => setNewResourceData({ ...newResourceData, fileType: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                                        >
                                            <option value="PDF">PDF</option>
                                            <option value="ZIP">ZIP</option>
                                            <option value="LINK">Link</option>
                                            <option value="IMG">Imagen</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tamaño (opcional)</label>
                                        <input
                                            type="text"
                                            value={newResourceData.fileSize}
                                            onChange={(e) => setNewResourceData({ ...newResourceData, fileSize: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                                            placeholder="Ej. 2.5 MB"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex items-center justify-end space-x-4">
                                    <button
                                        onClick={() => setIsAddingResource(false)}
                                        className="px-6 py-3 text-xs font-bold text-gray-500 hover:text-white transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleAddResource}
                                        disabled={!newResourceData.title || !newResourceData.url || addResourceMutation.isPending}
                                        className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center space-x-2"
                                    >
                                        {addResourceMutation.isPending && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        <span>{addResourceMutation.isPending ? 'AÑADIENDO...' : 'AÑADIR RECURSO'}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

const EditorAction = ({ icon }: { icon: React.ReactNode }) => (
    <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
        {icon}
    </button>
);

const SidebarWidget = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-[#111114] border border-white/5 rounded-[2rem] p-8 shadow-xl">
        <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">{title}</h4>
        {children}
    </div>
);

const SidebarSelect = ({ label, value, onChange, options }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="space-y-2 relative">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{label}</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[#09090b] border border-white/10 p-4 rounded-2xl text-xs font-bold text-white flex items-center justify-between hover:border-white/20 transition-all"
            >
                <span>{value}</span>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-[100] top-full left-0 w-full mt-2 bg-[#1a1a1f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {options.map((opt: string) => (
                            <button
                                key={opt}
                                onClick={() => { onChange(opt); setIsOpen(false); }}
                                className="w-full p-4 text-left text-xs font-bold text-gray-400 hover:bg-primary/10 hover:text-primary transition-all"
                            >
                                {opt}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
