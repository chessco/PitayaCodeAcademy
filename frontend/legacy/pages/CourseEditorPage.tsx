
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz';
  isPublished: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseEditorPageProps {
  onLogout: () => void;
}

const CourseEditorPage: React.FC<CourseEditorPageProps> = ({ onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'basics' | 'content'>('content');
  const [courseTitle, setCourseTitle] = useState('Curso de React Avanzado: Hooks y Patrones');
  const [description, setDescription] = useState('Aprende los conceptos avanzados de React.js...');
  const [isGenerating, setIsGenerating] = useState(false);

  // Estado para la estructura del curso
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'm1',
      title: 'Fundamentos de Hooks Pro',
      lessons: [
        { id: 'l1', title: 'Introducción a Hooks personalizados', type: 'video', isPublished: true },
        { id: 'l2', title: 'Gestión de estados complejos', type: 'video', isPublished: true },
      ]
    },
    {
      id: 'm2',
      title: 'Patrones de Componentes',
      lessons: [
        { id: 'l3', title: 'Compound Components pattern', type: 'video', isPublished: false },
        { id: 'l4', title: 'Render Props vs Hooks', type: 'document', isPublished: false },
      ]
    }
  ]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleMagicWrite = async () => {
    setIsGenerating(true);
    try {
      const result = await geminiService.generateCourseDescription(courseTitle);
      if (result) setDescription(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateOutline = async (moduleId: string, mTitle: string) => {
    setIsGenerating(true);
    try {
      const result = await geminiService.generateModuleOutline(mTitle, courseTitle);
      if (result) {
        // En una app real, parsearíamos esto para añadir las lecciones al estado
        console.log("IA Sugiere:", result);
        alert("Gemini sugiere estas lecciones para este módulo:\n" + result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      {/* Sidebar de navegación del editor */}
      <aside className="w-64 flex-none border-r dark:border-border-dark bg-[#111621] p-4 flex flex-col justify-between">
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-3 px-2 group">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-sm font-bold leading-tight">Academia Pro</h1>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Instructor Workspace</p>
            </div>
          </Link>

          <nav className="flex flex-col gap-1">
            <p className="px-2 pb-2 text-[10px] font-black text-slate-500 uppercase">Menú Principal</p>
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-surface-dark transition-all">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link to="/admin/courses" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <span className="material-symbols-outlined text-[20px]">library_books</span>
              <span className="text-sm font-bold">Mis Cursos</span>
            </Link>
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-background-dark">
        {/* Header Superior */}
        <header className="flex-none flex items-center justify-between border-b dark:border-border-dark bg-white dark:bg-[#111722]/50 backdrop-blur-md px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/courses" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-500">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div>
              <h2 className="text-xl font-bold font-lexend leading-none">{courseTitle}</h2>
              <p className="text-xs text-slate-500 mt-1">ID: COURSE-8291 • Último cambio: hace 2m</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-4 py-2 border dark:border-border-dark rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors">Vista Previa</button>
             <button className="px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2">
               <span className="material-symbols-outlined text-[20px]">publish</span> Publicar Cambios
             </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex-none flex px-8 border-b dark:border-border-dark bg-white dark:bg-background-dark">
          <button 
            onClick={() => setActiveTab('basics')}
            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'basics' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Ajustes Básicos
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'content' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Contenido del Curso
          </button>
        </div>

        {/* Workspace Central */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-background-dark/30">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'basics' ? (
              <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section className="bg-white dark:bg-surface-dark rounded-2xl border dark:border-border-dark p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 border-b dark:border-border-dark pb-6">
                    <div className="size-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <span className="material-symbols-outlined">info</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Información General</h3>
                      <p className="text-xs text-slate-500">Define los cimientos de tu curso.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Título del Curso</label>
                      <input 
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-background-dark border dark:border-border-dark outline-none focus:ring-2 focus:ring-primary transition-all"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                         <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Descripción detallada</label>
                         <button 
                           onClick={handleMagicWrite}
                           disabled={isGenerating}
                           className="flex items-center gap-2 text-xs font-black text-primary bg-primary/10 px-4 py-1.5 rounded-full hover:bg-primary/20 transition-all disabled:opacity-50"
                         >
                           <span className="material-symbols-outlined text-[16px] animate-pulse">auto_fix</span>
                           {isGenerating ? 'Generando...' : 'Mejorar con Gemini'}
                         </button>
                      </div>
                      <textarea 
                        className="w-full p-5 rounded-xl bg-slate-50 dark:bg-background-dark border dark:border-border-dark focus:ring-2 focus:ring-primary outline-none transition-all"
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Escribe de qué trata tu curso..."
                      />
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center mb-2">
                   <div>
                     <h2 className="text-2xl font-black font-lexend">Estructura del Curso</h2>
                     <p className="text-slate-500 text-sm">Organiza tu contenido en módulos y lecciones.</p>
                   </div>
                   <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all">
                     <span className="material-symbols-outlined">add</span> Nuevo Módulo
                   </button>
                </div>

                {/* Lista de Módulos */}
                <div className="flex flex-col gap-6">
                  {modules.map((module, mIndex) => (
                    <div key={module.id} className="bg-white dark:bg-surface-dark border dark:border-border-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Header de Módulo */}
                      <div className="p-5 border-b dark:border-border-dark bg-slate-50/50 dark:bg-background-dark/20 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="size-10 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                               {mIndex + 1}
                            </div>
                            <div>
                               <h4 className="font-bold text-lg">{module.title}</h4>
                               <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">{module.lessons.length} Lecciones • 45 min total</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleGenerateOutline(module.id, module.title)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Sugerir lecciones con IA">
                               <span className="material-symbols-outlined">auto_awesome</span>
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors">
                               <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                               <span className="material-symbols-outlined">delete</span>
                            </button>
                            <button className="p-2 text-slate-400">
                               <span className="material-symbols-outlined">expand_more</span>
                            </button>
                         </div>
                      </div>

                      {/* Lista de Lecciones */}
                      <div className="p-2 space-y-1">
                         {module.lessons.map((lesson) => (
                           <div key={lesson.id} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-border-dark">
                              <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-400 cursor-grab">drag_indicator</span>
                              <div className={`size-8 rounded-lg flex items-center justify-center ${
                                lesson.type === 'video' ? 'bg-blue-500/10 text-blue-500' : 
                                lesson.type === 'quiz' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                              }`}>
                                 <span className="material-symbols-outlined text-[20px]">
                                   {lesson.type === 'video' ? 'play_circle' : lesson.type === 'quiz' ? 'quiz' : 'description'}
                                 </span>
                              </div>
                              <span className="flex-1 font-medium text-sm text-slate-700 dark:text-slate-300">{lesson.title}</span>
                              <div className="flex items-center gap-3">
                                 <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${lesson.isPublished ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                                   {lesson.isPublished ? 'Publicada' : 'Borrador'}
                                 </span>
                                 <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all">
                                   <span className="material-symbols-outlined text-[18px]">settings</span>
                                 </button>
                              </div>
                           </div>
                         ))}
                         <button className="w-full mt-2 py-3 border-2 border-dashed dark:border-border-dark rounded-xl text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-bold flex items-center justify-center gap-2 group">
                            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span> Añadir Lección
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseEditorPage;
