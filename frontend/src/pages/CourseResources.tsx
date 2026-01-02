import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import {
    Upload, Search, Filter, FileText, Video, Trash2,
    ChevronRight, ChevronDown, CheckCircle2, XCircle,
    Eye, EyeOff, MoreHorizontal, Download, Plus,
    FileCode, FileArchive, Globe, MoreVertical, X,
    FileUp, CheckCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function CourseResources() {
    const { id: courseId } = useParams();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('Todos los tipos');
    const [lessonFilter, setLessonFilter] = useState('Todas las lecciones');
    const [visibilityFilter, setVisibilityFilter] = useState('Visibilidad');

    // Modal & Upload State
    const [isAddingResource, setIsAddingResource] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [newResourceData, setNewResourceData] = useState({
        title: '',
        lessonId: '',
        isVisible: true
    });

    const { data: course } = useQuery({
        queryKey: ['course-detail', courseId],
        queryFn: async () => {
            const res = await api.get(`/courses/${courseId}`);
            return res.data;
        }
    });

    const { data: lessons } = useQuery({
        queryKey: ['course-lessons', courseId],
        queryFn: async () => {
            const res = await api.get(`/lessons/course/${courseId}`);
            return res.data;
        }
    });

    const { data: resources, isLoading: loadingResources } = useQuery({
        queryKey: ['course-resources', courseId],
        queryFn: async () => {
            const res = await api.get(`/resources/course/${courseId}`);
            return res.data;
        }
    });

    const addResourceMutation = useMutation({
        mutationFn: async (data: any) => {
            return api.post(`/resources/course/${courseId}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-resources', courseId] });
            resetForm();
        },
        onError: (error: any) => {
            alert('Error al añadir recurso: ' + (error.response?.data?.message || error.message));
            setIsUploading(false);
        }
    });

    const toggleVisibilityMutation = useMutation({
        mutationFn: async ({ id, isVisible }: { id: string, isVisible: boolean }) => {
            return api.patch(`/resources/${id}`, { isVisible });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-resources', courseId] });
        }
    });

    const deleteResourceMutation = useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/resources/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-resources', courseId] });
        }
    });

    const resetForm = () => {
        setIsAddingResource(false);
        setIsUploading(false);
        setUploadProgress(0);
        setSelectedFile(null);
        setNewResourceData({ title: '', lessonId: '', isVisible: true });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setNewResourceData(prev => ({ ...prev, title: file.name }));
            setIsAddingResource(true);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);

        // Simulating upload progress
        for (let i = 0; i <= 100; i += 10) {
            setUploadProgress(i);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // After simulation, send to backend
        // Note: In a real app, you'd upload the file to S3/Cloudinary first and get a URL
        // Here we simulate it by sending the metadata with a mock URL
        addResourceMutation.mutate({
            ...newResourceData,
            url: `https://storage.pitayacode.io/mock/${selectedFile.name}`,
            fileType: selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE',
            fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
        });
    };

    const getIcon = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('pdf')) return { icon: FileText, color: 'text-orange-500', bg: 'bg-orange-500/10' };
        if (t.includes('video') || t.includes('mp4')) return { icon: Video, color: 'text-red-500', bg: 'bg-red-500/10' };
        if (t.includes('zip') || t.includes('rar')) return { icon: FileArchive, color: 'text-amber-500', bg: 'bg-amber-500/10' };
        if (t.includes('doc')) return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' };
        return { icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    };

    const filteredResources = resources?.filter((r: any) => {
        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'Todos los tipos' || r.fileType.toLowerCase().includes(typeFilter.toLowerCase());
        const matchesLesson = lessonFilter === 'Todas las lecciones' || (r.lesson?.title === lessonFilter);
        return matchesSearch && matchesType && matchesLesson;
    }) || [];

    if (loadingResources) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                        <Link to="/studio" className="hover:text-white transition-colors">Inicio</Link>
                        <ChevronRight className="w-3 h-3 opacity-50" />
                        <Link to="/studio/courses" className="hover:text-white transition-colors">Cursos</Link>
                        <ChevronRight className="w-3 h-3 opacity-50" />
                        <span className="text-primary">{course?.title}</span>
                        <ChevronRight className="w-3 h-3 opacity-50" />
                        <span className="text-white">Recursos</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Gestión de Recursos</h1>
                    <p className="text-sm font-medium text-gray-500 max-w-2xl">
                        Administra y organiza los materiales, videos y documentos de tu curso.
                    </p>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-3 px-6 py-3.5 bg-primary text-white rounded-2xl text-xs font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest"
                >
                    <Upload className="w-4 h-4" />
                    <span>Subir Nuevo Recurso</span>
                </button>
            </div>

            {/* Upload Area */}
            <div
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#111114] border-2 border-dashed border-white/5 rounded-[2.5rem] p-16 flex flex-col items-center justify-center space-y-6 group hover:border-primary/30 transition-all cursor-pointer"
            >
                <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/5 transition-all">
                    <Upload className="w-8 h-8 text-gray-600 group-hover:text-primary" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-black text-white">Haz clic para subir <span className="text-gray-500 font-medium">o arrastra y suelta tus archivos aquí</span></h3>
                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em]">MP4, PDF, DOCX, ZIP (Max 500MB)</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar archivo..."
                        className="w-full bg-[#111114] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-gray-300 focus:outline-none focus:border-primary/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        className="bg-[#111114] border border-white/5 rounded-2xl px-5 py-3.5 text-[10px] font-black text-gray-400 focus:outline-none focus:border-primary uppercase tracking-widest cursor-pointer"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option>Todos los tipos</option>
                        <option>PDF</option>
                        <option>Video</option>
                        <option>DOC</option>
                        <option>ZIP</option>
                    </select>
                    <select
                        className="bg-[#111114] border border-white/5 rounded-2xl px-5 py-3.5 text-[10px] font-black text-gray-400 focus:outline-none focus:border-primary uppercase tracking-widest cursor-pointer"
                        value={lessonFilter}
                        onChange={(e) => setLessonFilter(e.target.value)}
                    >
                        <option>Todas las lecciones</option>
                        {lessons?.map((l: any) => (
                            <option key={l.id} value={l.title}>{l.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Resources Table */}
            <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-10 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <input type="checkbox" className="w-4 h-4 rounded-md border-white/10 bg-white/5 text-primary focus:ring-primary/20" />
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Nombre del Archivo</span>
                    </div>
                    <div className="flex items-center space-x-20 pr-20">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] w-20">Tipo</span>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] w-20">Tamaño</span>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] w-40">Asociado a</span>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] w-24">Visibilidad</span>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] w-12 text-right pr-4">Acciones</span>
                    </div>
                </div>

                <div className="divide-y divide-white/5">
                    {filteredResources.map((resource: any) => {
                        const style = getIcon(resource.fileType);
                        return (
                            <motion.div
                                key={resource.id}
                                className="p-10 flex items-center justify-between hover:bg-white/[0.01] transition-all group"
                            >
                                <div className="flex items-center space-x-6">
                                    <input type="checkbox" className="w-4 h-4 rounded-md border-white/10 bg-white/5 text-primary focus:ring-primary/20" />
                                    <div className={`p-4 rounded-2xl border border-white/5 ${style.bg}`}>
                                        <style.icon className={`w-6 h-6 ${style.color}`} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-white group-hover:text-primary transition-colors cursor-pointer">{resource.title}</h4>
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">Subido el {format(new Date(resource.createdAt), 'd MMM, yyyy', { locale: es })}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-20 pr-10">
                                    <div className="w-20">
                                        <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-widest">{resource.fileType}</span>
                                    </div>
                                    <div className="w-20">
                                        <span className="text-[11px] font-bold text-gray-400">{resource.fileSize || 'N/A'}</span>
                                    </div>
                                    <div className="w-40 flex items-center space-x-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${resource.lesson ? 'bg-primary' : 'bg-gray-700'}`} />
                                        <span className={`text-[11px] font-bold ${resource.lesson ? 'text-gray-300' : 'text-gray-600 italic'}`}>
                                            {resource.lesson?.title || 'Sin asignar'}
                                        </span>
                                    </div>
                                    <div className="w-24">
                                        <button
                                            onClick={() => toggleVisibilityMutation.mutate({ id: resource.id, isVisible: !resource.isVisible })}
                                            className={`w-12 h-6 rounded-full relative transition-all ${resource.isVisible ? 'bg-primary/20' : 'bg-white/5'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${resource.isVisible ? 'right-1 bg-primary' : 'left-1 bg-gray-600'}`} />
                                        </button>
                                    </div>
                                    <div className="w-12 flex justify-end">
                                        <button
                                            onClick={() => { if (window.confirm('¿Eliminar recurso?')) deleteResourceMutation.mutate(resource.id); }}
                                            className="p-3 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredResources.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mx-auto text-gray-700">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-white">No hay recursos encontrados</h3>
                            <p className="text-sm text-gray-600 font-medium">Empieza subiendo el primer material para tus estudiantes.</p>
                        </div>
                    </div>
                )}

                <div className="p-10 border-t border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Mostrando {filteredResources.length} de {resources?.length || 0} recursos</p>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-widest">Anterior</button>
                        <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-widest">Siguiente</button>
                    </div>
                </div>
            </div>

            {/* Add Resource Modal */}
            <AnimatePresence>
                {isAddingResource && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-white">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isUploading && resetForm()}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-[#111114] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-xl font-black tracking-tight">Finalizar Carga</h3>
                                <button onClick={() => !isUploading && resetForm()} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                {/* File Info Card */}
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <FileUp className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-white truncate">{selectedFile?.name}</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase">{(selectedFile?.size || 0) / 1024 < 1024 ? `${((selectedFile?.size || 0) / 1024).toFixed(2)} KB` : `${((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB`}</p>
                                    </div>
                                    {uploadProgress === 100 && (
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Título del Recurso</label>
                                    <input
                                        type="text"
                                        value={newResourceData.title}
                                        disabled={isUploading}
                                        onChange={(e) => setNewResourceData({ ...newResourceData, title: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                                        placeholder="Ej. Guía Práctica de Hooks"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Vincular a Lección (Opcional)</label>
                                    <select
                                        value={newResourceData.lessonId}
                                        disabled={isUploading}
                                        onChange={(e) => setNewResourceData({ ...newResourceData, lessonId: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50 appearance-none"
                                    >
                                        <option value="">Sin asignar (Material general)</option>
                                        {lessons?.map((l: any) => (
                                            <option key={l.id} value={l.id}>{l.title}</option>
                                        ))}
                                    </select>
                                </div>

                                {isUploading && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-gray-500">Subiendo archivo...</span>
                                            <span className="text-primary">{uploadProgress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-primary"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 flex items-center justify-end space-x-4">
                                    {!isUploading && (
                                        <button
                                            onClick={resetForm}
                                            className="px-6 py-3 text-xs font-bold text-gray-500 hover:text-white transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                    <button
                                        onClick={handleUpload}
                                        disabled={!newResourceData.title || isUploading}
                                        className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center space-x-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>{addResourceMutation.isPending ? 'GUARDANDO...' : 'PROCESANDO...'}</span>
                                            </>
                                        ) : (
                                            <span>AÑADIR RECURSO</span>
                                        )}
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
