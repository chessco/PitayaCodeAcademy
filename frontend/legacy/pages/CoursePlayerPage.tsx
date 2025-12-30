
import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

interface CoursePlayerPageProps {
  onLogout: () => void;
}

const CoursePlayerPage: React.FC<CoursePlayerPageProps> = ({ onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="bg-slate-950 text-slate-200 font-display h-screen flex flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-6 z-20">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
              <span className="material-symbols-outlined">school</span>
            </div>
            <h2 className="text-white text-lg font-bold font-lexend">Academia Pro</h2>
          </Link>
          <div className="h-6 w-px bg-slate-700 hidden md:block"></div>
          <Link to="/" className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span> Volver a Cursos
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-cover rounded-full size-9 border-2 border-slate-700 p-0.5">
              <img src="https://i.pravatar.cc/100?u=4" alt="Avatar" className="rounded-full" />
            </div>
            <span className="text-sm font-medium hidden lg:block">Carlos R.</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            title="Cerrar Sesión"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Syllabus */}
        <aside className="hidden lg:flex w-80 min-w-[320px] flex-col border-r border-slate-800 bg-slate-900 overflow-y-auto">
          <div className="p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10 space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white text-sm font-bold">Progreso</p>
                <p className="text-slate-400 text-xs">3 de 12 completadas</p>
              </div>
              <p className="text-primary text-sm font-bold">25%</p>
            </div>
            <div className="rounded-full bg-slate-800 h-2 overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '25%' }} />
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Módulo 1: Fundamentos</div>
            {[
              { title: 'Bienvenida al Curso', dur: '5 min', done: true },
              { title: 'La Psicología del Color', dur: '15 min', active: true },
              { title: 'Tipografía Digital', dur: '20 min' }
            ].map((l, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors ${l.active ? 'bg-primary/10 border border-primary/20' : ''}`}>
                 <span className={`material-symbols-outlined text-[20px] ${l.done ? 'text-green-500' : l.active ? 'text-primary' : 'text-slate-600'}`}>
                    {l.done ? 'check_circle' : l.active ? 'play_circle' : 'radio_button_unchecked'}
                 </span>
                 <div className="flex flex-col">
                   <span className={`text-sm ${l.active ? 'text-white font-bold' : 'text-slate-400 font-medium'}`}>{l.title}</span>
                   <span className="text-[10px] text-slate-500">{l.dur} {l.active ? '• Reproduciendo' : ''}</span>
                 </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Player View */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-slate-950">
           <div className="w-full bg-slate-900 p-4 md:p-8 flex justify-center border-b border-slate-800">
             <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden relative group shadow-2xl border border-slate-800">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-30 transition-opacity" 
                  style={{ backgroundImage: "url('https://picsum.photos/1280/720?video')" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <button className="bg-primary hover:bg-primary/90 text-white rounded-full size-20 flex items-center justify-center transform transition-all hover:scale-110 shadow-2xl">
                     <span className="material-symbols-outlined text-[48px] ml-1">play_arrow</span>
                   </button>
                </div>
                {/* Overlay Controls */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black p-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="relative h-1 bg-white/20 rounded-full"><div className="absolute left-0 top-0 h-full bg-primary w-1/3 rounded-full" /></div>
                   <div className="flex justify-between text-white text-xs">
                      <div className="flex items-center gap-4"><span className="material-symbols-outlined">play_arrow</span> <span>05:12 / 15:00</span></div>
                      <div className="flex items-center gap-4"><span className="material-symbols-outlined">settings</span> <span className="material-symbols-outlined">fullscreen</span></div>
                   </div>
                </div>
             </div>
           </div>

           <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-6">
                 <div>
                    <div className="flex items-center gap-2 text-primary text-xs font-bold mb-2 uppercase">Módulo 1 • Lección 2</div>
                    <h1 className="text-2xl md:text-3xl font-bold font-lexend">La Psicología del Color</h1>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 border border-slate-700 rounded-lg hover:bg-slate-800"><span className="material-symbols-outlined">chevron_left</span></button>
                    <button className="px-6 py-2 bg-primary rounded-lg font-bold text-sm shadow-lg hover:bg-primary-dark transition-all">Completar</button>
                    <button className="p-2 border border-slate-700 rounded-lg hover:bg-slate-800"><span className="material-symbols-outlined">chevron_right</span></button>
                 </div>
              </div>
              <div className="flex gap-8 border-b border-slate-800">
                <button className="pb-3 text-primary border-b-2 border-primary font-bold text-sm transition-colors">Descripción</button>
                <button className="pb-3 text-slate-500 font-bold text-sm hover:text-white transition-colors">Recursos (2)</button>
              </div>
              <div className="text-slate-400 leading-relaxed text-sm space-y-4">
                 <p>En esta lección fundamental, exploraremos cómo el color influye directamente en la percepción y el comportamiento del usuario dentro de una interfaz digital.</p>
                 <h3 className="text-white font-bold text-lg">Lo que aprenderás:</h3>
                 <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                    <li>Significados psicológicos de los colores primarios.</li>
                    <li>Crear paletas accesibles (WCAG).</li>
                    <li>Regla del 60-30-10.</li>
                 </ul>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default CoursePlayerPage;
