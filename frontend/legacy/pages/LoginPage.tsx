
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular un pequeño retraso para mejorar la sensación de proceso
    setTimeout(() => {
      onLogin();
      navigate('/');
    }, 800);
  };

  return (
    <div className="flex min-h-screen h-full bg-white dark:bg-background-dark">
      {/* Sección Izquierda: Branding & Visuals (Oculto en móviles) */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 scale-105 animate-pulse-slow" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            filter: 'brightness(0.7)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-dark/60 to-background-dark/90 z-10"></div>
        
        <div className="relative z-20 flex flex-col items-start justify-end h-full w-full p-20 text-white">
          <div className="mb-12 group">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-4xl text-white">school</span>
            </div>
            <h2 className="text-5xl font-black tracking-tight mb-4 font-lexend leading-tight">
              Aprende sin <br /><span className="text-primary-light text-blue-300">límites.</span>
            </h2>
            <p className="text-xl text-slate-200 max-w-md font-light leading-relaxed">
              Únete a la comunidad de aprendizaje más grande de habla hispana y transforma tu carrera hoy mismo.
            </p>
          </div>
          
          <div className="flex items-center gap-6 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <img 
                  key={i}
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-primary-dark object-cover" 
                  src={`https://i.pravatar.cc/100?u=user${i}`}
                  alt="Estudiante"
                />
              ))}
            </div>
            <div className="text-sm">
              <p className="font-bold text-white">+15,000 estudiantes</p>
              <p className="text-slate-300 text-xs">ya están mejorando sus habilidades</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Derecha: Formulario de Login */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-[440px]">
          {/* Logo para Mobile */}
          <div className="lg:hidden mb-10 flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-3xl text-white">school</span>
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white font-lexend">Academia Pro</span>
          </div>

          <div className="flex flex-col gap-3 mb-12">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white font-lexend">
              Bienvenido de nuevo
            </h1>
            <p className="text-slate-500 dark:text-text-secondary">
              Ingresa tus credenciales para acceder a tus cursos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2" htmlFor="email">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[22px]">mail</span>
                </div>
                <input 
                  id="email" 
                  type="email" 
                  required 
                  className="block w-full rounded-xl border-0 py-4 pl-12 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-surface-dark dark:text-white dark:ring-border-dark dark:placeholder:text-slate-500 transition-all outline-none sm:text-sm"
                  placeholder="nombre@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200" htmlFor="password">
                  Contraseña
                </label>
                <a className="text-xs font-bold text-primary hover:text-primary-dark transition-colors" href="#">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[22px]">lock</span>
                </div>
                <input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  className="block w-full rounded-xl border-0 py-4 pl-12 pr-12 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-surface-dark dark:text-white dark:ring-border-dark dark:placeholder:text-slate-500 transition-all outline-none sm:text-sm"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input 
                id="remember-me" 
                type="checkbox" 
                className="h-5 w-5 rounded-md border-slate-300 text-primary focus:ring-primary dark:border-border-dark dark:bg-surface-dark cursor-pointer transition-all" 
              />
              <label className="ml-3 block text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer" htmlFor="remember-me">
                Mantener sesión iniciada
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="relative flex w-full justify-center rounded-xl bg-primary px-4 py-4 text-sm font-black text-white shadow-xl shadow-primary/20 hover:bg-primary-dark hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:translate-y-0"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                "Entrar a mi cuenta"
              )}
            </button>
          </form>

          <div className="relative mt-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-border-dark"></div>
            </div>
            <div className="relative flex justify-center text-sm font-bold">
              <span className="bg-white px-4 text-slate-500 dark:bg-background-dark dark:text-slate-400">O ingresa con</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-white dark:bg-surface-dark px-4 py-3 text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
               <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
               Google
            </button>
            <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-white dark:bg-surface-dark px-4 py-3 text-sm font-bold text-slate-700 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
               <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
               Facebook
            </button>
          </div>

          <p className="mt-12 text-center text-sm text-slate-500 dark:text-text-secondary font-medium">
            ¿Aún no tienes cuenta? <Link to="/register" className="font-black text-primary hover:text-primary-dark transition-colors">Crea una ahora</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
