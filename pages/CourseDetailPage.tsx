
import React from 'react';
import { useParams, Link } from 'react-router-dom';

interface CourseDetailPageProps {
  isAuthenticated?: boolean;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ isAuthenticated }) => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-200">
      <header className="border-b dark:border-border-dark bg-white dark:bg-surface-dark sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary group">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-[24px]">school</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Academia Pro</h2>
          </Link>
          
          <div className="flex gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="h-9 flex items-center px-4 rounded-lg font-bold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Iniciar sesión</Link>
                <Link to="/register" className="h-9 flex items-center px-4 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-sm shadow-primary/20 transition-colors">Registrarse</Link>
              </>
            ) : (
              <Link to="/admin" className="h-9 flex items-center px-4 rounded-lg bg-slate-100 dark:bg-surface-dark font-bold text-sm hover:bg-slate-200 dark:hover:bg-border-dark transition-colors">
                Ir a mi Panel
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight font-lexend">
                Curso Completo de Marketing Digital 2024
              </h1>
              <p className="text-lg text-slate-500 dark:text-text-secondary leading-relaxed">
                Domina el SEO, SEM, Email Marketing y Redes Sociales con proyectos prácticos desde cero. Conviértete en un experto digital.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold px-2 py-0.5 rounded">Bestseller</span>
                <div className="flex items-center gap-1 text-primary font-bold">
                  <span className="text-lg">4.8</span>
                  <div className="flex"><span className="material-symbols-outlined text-[18px] fill">star</span></div>
                </div>
                <span className="text-slate-500 underline underline-offset-4 cursor-pointer hover:text-primary transition-colors">(1,240 reseñas)</span>
                <span className="text-slate-500 font-medium">• 10,500 estudiantes</span>
              </div>
            </div>

            {/* Video Preview */}
            <Link to={`/player/${id}`} className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-surface-dark group cursor-pointer border dark:border-border-dark">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-60 transition-opacity duration-300 group-hover:opacity-40" 
                style={{ backgroundImage: "url('https://picsum.photos/1200/800?education')" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-[48px] ml-1">play_arrow</span>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className="text-white font-bold drop-shadow-md">Vista previa del curso</span>
                <span className="bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">02:35</span>
              </div>
            </Link>

            <div className="border dark:border-border-dark rounded-xl p-6 bg-white dark:bg-surface-dark shadow-sm">
              <h3 className="text-xl font-bold mb-4 font-lexend">Lo que aprenderás</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                {[
                  "Estrategias avanzadas de SEO on-page y off-page.",
                  "Creación y optimización de campañas en Google Ads.",
                  "Gestión profesional de Facebook e Instagram Ads.",
                  "Email Marketing y automatización con Mailchimp.",
                  "Analítica web con Google Analytics 4.",
                  "Copywriting persuasivo para ventas."
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white dark:bg-surface-dark border dark:border-border-dark rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-4xl font-black font-lexend">$49.99</span>
                    <span className="text-lg text-slate-500 line-through mb-1">$99.99</span>
                    <span className="text-sm font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded mb-1.5">-50%</span>
                  </div>
                  <div className="space-y-3 mb-6">
                    <Link to="/cart" className="flex w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg text-lg items-center justify-center shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                      Comprar ahora
                    </Link>
                    <button className="w-full py-3.5 border dark:border-slate-700 font-bold rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      Añadir al carrito
                    </button>
                  </div>
                  <p className="text-center text-xs text-slate-500 mb-6 font-medium">Garantía de devolución de 30 días</p>
                  <div className="space-y-4">
                    <p className="font-bold text-sm uppercase tracking-wider text-slate-400">Este curso incluye:</p>
                    <ul className="space-y-3 text-sm text-slate-500 font-medium">
                      <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[20px]">ondemand_video</span> 20 horas de video</li>
                      <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[20px]">all_inclusive</span> Acceso de por vida</li>
                      <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[20px]">smartphone</span> Acceso en dispositivos móviles</li>
                      <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[20px]">trophy</span> Certificado de finalización</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetailPage;
