import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
    ChevronRight, Save, X, Eye, Info, Layout, GripVertical,
    Plus, Clock, CheckCircle, Smartphone, Globe, Shield,
    Upload, MoreVertical, Bold, Italic, Underline, List, Link as LinkIcon,
    ChevronDown, FileText, Trash2, Edit2, FolderInput
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    useDroppable,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function CourseEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isAddingLesson, setIsAddingLesson] = useState(false);
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [isAddingResource, setIsAddingResource] = useState(false);
    const [activeLessonForResource, setActiveLessonForResource] = useState<string | null>(null);

    // DND State
    const [activeId, setActiveId] = useState<string | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );



    // New Lesson State
    const [newLessonData, setNewLessonData] = useState({
        title: '',
        content: '',
        videoUrl: '',
        sortOrder: 0
    });

    // Resource State

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
        thumbnail: '',
        learningOutcomes: [] as string[]
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
                thumbnail: course.thumbnail || '',
                learningOutcomes: course.learningOutcomes ? JSON.parse(course.learningOutcomes) : ['']
            });
        }
    }, [course]);

    const saveMutation = useMutation({
        mutationFn: async (updatedData: any) => {
            const payload = {
                ...updatedData,
                learningOutcomes: JSON.stringify(updatedData.learningOutcomes.filter((o: string) => o.trim() !== ''))
            };
            return api.patch(`/courses/${id}`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-editor', id] });
            queryClient.invalidateQueries({ queryKey: ['studio-courses'] });
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: (error: any) => {
            console.error('Error saving course:', error);
            setIsSaving(false);
            const message = error.response?.data?.message || error.message || 'Error desconocido al guardar';
            alert(`Error al guardar los cambios: ${Array.isArray(message) ? message.join(', ') : message}`);
        }
    });

    const handleSave = () => {
        setIsSaving(true);
        const priceValue = parseFloat(formData.price);
        saveMutation.mutate({
            ...formData,
            price: isNaN(priceValue) ? 0 : priceValue
        });
    };

    const updateLessonMutation = useMutation({
        mutationFn: async ({ lessonId, data }: { lessonId: string, data: any }) => {
            return api.put(`/courses/${id}/lessons/${lessonId}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-editor', id] });
            setIsAddingLesson(false);
            setEditingLessonId(null);
            setNewLessonData({ title: '', content: '', videoUrl: '', sortOrder: 0 });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: (error: any) => {
            console.error('Error updating lesson:', error);
            alert('Error al actualizar la lección: ' + (error.response?.data?.message || error.message));
        }
    });

    const deleteLessonMutation = useMutation({
        mutationFn: async (lessonId: string) => {
            return api.delete(`/courses/${id}/lessons/${lessonId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-editor', id] });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: (error: any) => {
            console.error('Error deleting lesson:', error);
            alert('Error al eliminar la lección: ' + (error.response?.data?.message || error.message));
        }
    });

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
        onError: (error: any) => { // Fixed type to any
            console.error('Error adding lesson:', error);
            alert('Error al añadir la lección: ' + (error.response?.data?.message || error.message));
        }
    });

    const handleSaveLesson = () => {
        if (editingLessonId) {
            updateLessonMutation.mutate({
                lessonId: editingLessonId,
                data: newLessonData
            });
        } else {
            addLessonMutation.mutate({
                ...newLessonData,
                sortOrder: (course?.lessons?.length || 0) + 1
            });
        }
    };

    const openEditLesson = (lesson: any) => {
        setNewLessonData({
            title: lesson.title,
            content: lesson.content || '',
            videoUrl: lesson.videoUrl || '',
            sortOrder: lesson.sortOrder
        });
        setEditingLessonId(lesson.id);
        setIsAddingLesson(true);
    };

    const handleDeleteLesson = (lessonId: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta lección?')) {
            deleteLessonMutation.mutate(lessonId);
        }
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

    // Module Mutations
    const createModuleMutation = useMutation({
        mutationFn: async (title: string) => {
            return api.post(`/courses/${id}/modules`, { title, sortOrder: course?.modules?.length || 0 });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-editor', id] });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
    });

    const deleteModuleMutation = useMutation({
        mutationFn: async (moduleId: string) => {
            return api.delete(`/courses/${id}/modules/${moduleId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-editor', id] });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
    });

    const moveLessonMutation = useMutation({
        mutationFn: async ({ lessonId, moduleId }: { lessonId: string, moduleId: string | null }) => {
            // Update lesson with new moduleId
            return api.put(`/courses/${id}/lessons/${lessonId}`, { moduleId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-editor', id] });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;
        if (active.id === over.id) return;

        const activeLessonId = active.id as string;
        const overId = over.id as string;

        let targetModuleId: string | null = null;

        // Check where we dropped
        if (overId.startsWith('module-')) {
            targetModuleId = overId.replace('module-', '');
        } else if (overId === 'unassigned-container') {
            targetModuleId = null;
        } else {
            // Find module of the lesson we dropped over
            const targetModule = course.modules?.find((m: any) => m.lessons?.some((l: any) => l.id === overId));
            if (targetModule) targetModuleId = targetModule.id;
            else targetModuleId = null; // Default to unassigned if not found in module (assuming dropped on unassigned lesson)
        }

        // Optimistic update logic is tricky, so rely on mutation
        moveLessonMutation.mutate({ lessonId: activeLessonId, moduleId: targetModuleId });
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

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

                        {/* Learning Outcomes Section */}
                        <section className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center space-x-4">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-black tracking-tight">Lo que aprenderás</h3>
                            </div>
                            <div className="p-10 space-y-4">
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Añade los objetivos principales del curso.</p>
                                {formData.learningOutcomes.map((outcome, idx) => (
                                    <div key={idx} className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <input
                                            type="text"
                                            value={outcome}
                                            onChange={(e) => {
                                                const newOutcomes = [...formData.learningOutcomes];
                                                newOutcomes[idx] = e.target.value;
                                                setFormData({ ...formData, learningOutcomes: newOutcomes });
                                            }}
                                            className="flex-1 bg-white/[0.03] border border-white/10 p-3 rounded-xl text-sm font-medium text-gray-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                            placeholder="Ej. Dominar el uso avanzado de Hooks en React"
                                        />
                                        <button
                                            onClick={() => {
                                                const newOutcomes = formData.learningOutcomes.filter((_, i) => i !== idx);
                                                setFormData({ ...formData, learningOutcomes: newOutcomes });
                                            }}
                                            className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setFormData({ ...formData, learningOutcomes: [...formData.learningOutcomes, ''] })}
                                    className="flex items-center space-x-2 text-xs font-bold text-primary hover:text-white transition-colors mt-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>AÑADIR OBJETIVO</span>
                                </button>
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
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => {
                                            const title = prompt('Nombre de la nueva sección:');
                                            if (title) createModuleMutation.mutate(title);
                                        }}
                                        className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-white transition-colors flex items-center"
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Nueva Sección
                                    </button>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        {(course?.modules?.length || 0)} Secciones • {(course?.lessons?.length || 0) + (course?.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0)} Lecciones
                                    </span>
                                </div>
                            </div>
                            <div className="p-10 space-y-8">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                >
                                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Organiza tu contenido arrastrando las lecciones.</p>

                                    {/* Modules List */}
                                    {course?.modules && course.modules.map((module: any) => (
                                        <SortableContext
                                            key={module.id}
                                            id={`module-${module.id}`}
                                            items={module.lessons?.map((l: any) => l.id) || []}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between group">
                                                    <h4 className="text-sm font-black text-gray-300 uppercase tracking-wide flex items-center">
                                                        <span className="w-2 h-2 rounded-full bg-purple-500 mr-3"></span>
                                                        {module.title}
                                                    </h4>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('¿Eliminar sección? Las lecciones pasarán a "Sin Asignar".')) {
                                                                    deleteModuleMutation.mutate(module.id);
                                                                }
                                                            }}
                                                            className="p-1.5 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <DroppableContainer id={`module-${module.id}`} className="space-y-3 pl-4 border-l-2 border-white/5 ml-1 min-h-[60px]">
                                                    {module.lessons && module.lessons.map((lesson: any) => (
                                                        <SortableLessonItem
                                                            key={lesson.id}
                                                            lesson={lesson}
                                                            idx={lesson.sortOrder}
                                                            startEdit={openEditLesson}
                                                            deleteLesson={handleDeleteLesson}
                                                            addResource={() => { setActiveLessonForResource(lesson.id); setIsAddingResource(true); }}
                                                            removeResource={removeResourceMutation.mutate}
                                                            moveLesson={(moduleId: string | null) => moveLessonMutation.mutate({ lessonId: lesson.id, moduleId })}
                                                            modules={course.modules}
                                                        />
                                                    ))}
                                                    {(!module.lessons || module.lessons.length === 0) && (
                                                        <div className="p-4 border-2 border-dashed border-white/5 rounded-xl text-center">
                                                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Arrastra lecciones aquí</span>
                                                        </div>
                                                    )}
                                                </DroppableContainer>
                                            </div>
                                        </SortableContext>
                                    ))}

                                    {/* Unassigned Lessons */}
                                    <SortableContext
                                        id="unassigned-container"
                                        items={course?.lessons?.map((l: any) => l.id) || []}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-4 pt-8 border-t border-white/5">
                                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center">
                                                <Info className="w-3.5 h-3.5 mr-2" />
                                                Lecciones sin asignar / Generales
                                            </h4>

                                            <DroppableContainer id="unassigned-container" className="space-y-3 min-h-[60px]">
                                                {course?.lessons?.map((lesson: any, idx: number) => (
                                                    <SortableLessonItem
                                                        key={lesson.id}
                                                        lesson={lesson}
                                                        idx={idx}
                                                        startEdit={openEditLesson}
                                                        deleteLesson={handleDeleteLesson}
                                                        addResource={() => { setActiveLessonForResource(lesson.id); setIsAddingResource(true); }}
                                                        removeResource={removeResourceMutation.mutate}
                                                        moveLesson={(moduleId: string | null) => moveLessonMutation.mutate({ lessonId: lesson.id, moduleId })}
                                                        modules={course.modules || []}
                                                    />
                                                ))}

                                                <button
                                                    onClick={() => {
                                                        setEditingLessonId(null);
                                                        setNewLessonData({ title: '', content: '', videoUrl: '', sortOrder: (course?.lessons?.length || 0) + 1 });
                                                        setIsAddingLesson(true);
                                                    }}
                                                    className="w-full py-6 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center space-x-3 text-gray-600 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all group mt-4">
                                                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                    <span className="text-xs font-black uppercase tracking-widest font-sans">Añadir Nueva Lección</span>
                                                </button>
                                            </DroppableContainer>
                                        </div>
                                    </SortableContext>

                                    <DragOverlay>
                                        {activeId ? (
                                            <div className="p-4 bg-[#1a1a1f] text-white rounded-xl border border-white/20 shadow-2xl skew-y-2 opacity-90 scale-105 w-[300px]">
                                                <span className="text-sm font-bold">Moviendo lección...</span>
                                            </div>
                                        ) : null}
                                    </DragOverlay>
                                </DndContext>
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
                                <h3 className="text-xl font-black tracking-tight">{editingLessonId ? 'Editar Lección' : 'Nueva Lección'}</h3>
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
                                        onClick={handleSaveLesson}
                                        disabled={!newLessonData.title || addLessonMutation.isPending || updateLessonMutation.isPending}
                                        className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center space-x-2"
                                    >
                                        {(addLessonMutation.isPending || updateLessonMutation.isPending) && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        <span>{(addLessonMutation.isPending || updateLessonMutation.isPending) ? (editingLessonId ? 'ACTUALIZANDO...' : 'CREANDO...') : (editingLessonId ? 'ACTUALIZAR' : 'CREAR LECCIÓN')}</span>
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

const LessonItem = ({ lesson, idx, startEdit, deleteLesson, addResource, removeResource, moveLesson, modules, listeners }: any) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center p-5 bg-[#09090b]/50 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                <button
                    className="mr-4 text-gray-700 hover:text-gray-400 cursor-grab active:cursor-grabbing"
                    {...listeners}
                >
                    <GripVertical className="w-5 h-5" />
                </button>
                <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="text-xs font-black text-gray-600">{(idx || 0) + 1}.</span>
                        <span className="text-sm font-bold text-gray-200">{lesson.title}</span>
                        {lesson.isPublished && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase rounded border border-emerald-500/20">Publicado</span>}
                    </div>
                    <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-gray-600 transition-opacity">
                        {/* Module Selector - Always visible */}
                        <div className="flex items-center px-3 py-1 bg-white/[0.03] border border-white/5 rounded-lg hover:border-white/20 transition-colors">
                            <FolderInput className="w-3.5 h-3.5 mr-2 text-gray-500 group-hover:text-primary transition-colors" />
                            <select
                                value={lesson.moduleId || ''}
                                onChange={(e) => moveLesson(e.target.value || null)}
                                className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white cursor-pointer focus:outline-none border-none py-0.5 max-w-[150px]"
                            >
                                <option value="" className="bg-[#111114]">Sin Sección (General)</option>
                                {modules?.map((m: any) => (
                                    <option key={m.id} value={m.id} className="bg-[#111114]">{m.title}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={addResource}
                            className="flex items-center hover:text-primary transition-colors"
                        >
                            <Plus className="w-3 h-3 mr-1.5" />
                            <span>Recurso</span>
                        </button>
                        <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1.5" />
                            <span>15:00</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={() => startEdit(lesson)}
                                className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-gray-400 hover:text-white"
                                title="Editar"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => deleteLesson(lesson.id)}
                                className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-gray-400 hover:text-red-500"
                                title="Eliminar"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resource List for this lesson */}
            {lesson.resources && lesson.resources.length > 0 && (
                <div className="ml-12 space-y-2">
                    {lesson.resources.map((res: any) => (
                        <div key={res.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl group/res">
                            <div className="flex items-center space-x-3">
                                <FileText className="w-3.5 h-3.5 text-gray-500" />
                                <span className="text-[11px] font-bold text-gray-400">{res.title}</span>
                                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{res.fileType || 'Archivo'}</span>
                            </div>
                            <button
                                onClick={() => removeResource({ lessonId: lesson.id, resourceId: res.id })}
                                className="opacity-0 group-hover/res:opacity-100 p-1 hover:text-red-500 transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SortableLessonItem = (props: any) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: props.lesson.id,
        data: {
            type: 'Lesson',
            lesson: props.lesson
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none',
        zIndex: isDragging ? 999 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <LessonItem {...props} listeners={listeners} />
        </div>
    );
};
const DroppableContainer = ({ id, children, className }: any) => {
    const { setNodeRef } = useDroppable({ id });
    return <div ref={setNodeRef} className={className}>{children}</div>;
};
