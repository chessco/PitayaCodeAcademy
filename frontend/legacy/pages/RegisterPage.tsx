
import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased">
      <header className="flex items-center justify-between border-b border-gray-200 dark:border-border-dark px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-3 text-slate-900 dark:text-white">
          <div className="size-8 text-primary">
            <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold">Academia Demo</h2>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm text-gray-500 dark:text-text-secondary">¿Ya tienes una cuenta?</span>
          <Link to="/login" className="flex items-center justify-center rounded-lg h-9 px-4 bg-gray-200 dark:bg-surface-dark hover:bg-gray-300 dark:hover:bg-border-dark text-slate-900 dark:text-white text-sm font-bold transition-colors">
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-[520px]">
          <div className="flex flex-col gap-2 p-4">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter font-lexend">Crear una cuenta</h1>
            <p className="text-gray-500 dark:text-text-secondary">Únete a tu academia y comienza a aprender hoy.</p>
          </div>
          <div className="mt-4 flex flex-col gap-5 px-4">
            <label className="flex flex-col flex-1">
              <p className="text-sm font-medium pb-2">Nombre completo</p>
              <input className="rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark h-12 px-4 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Ej. Juan Pérez" />
            </label>
            <label className="flex flex-col flex-1">
              <p className="text-sm font-medium pb-2">Correo electrónico</p>
              <input type="email" className="rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark h-12 px-4 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="nombre@empresa.com" />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="flex flex-col flex-1">
                <p className="text-sm font-medium pb-2">Contraseña</p>
                <input type="password" className="rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark h-12 px-4 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="••••••••" />
              </label>
              <label className="flex flex-col flex-1">
                <p className="text-sm font-medium pb-2">Confirmar contraseña</p>
                <input type="password" className="rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark h-12 px-4 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="••••••••" />
              </label>
            </div>
            <div className="flex items-start gap-3 pt-2">
              <input type="checkbox" className="w-5 h-5 border border-gray-300 dark:border-border-dark rounded bg-white dark:bg-surface-dark text-primary focus:ring-primary cursor-pointer" id="terms" />
              <label className="text-sm text-gray-500 dark:text-text-secondary cursor-pointer" htmlFor="terms">
                He leído y acepto los <a className="text-primary hover:underline" href="#">Términos y Condiciones</a> y la <a className="text-primary hover:underline" href="#">Política de Privacidad</a>.
              </label>
            </div>
            <button className="mt-4 flex w-full items-center justify-center rounded-lg h-12 bg-primary hover:bg-blue-600 text-white font-bold shadow-lg transition-colors">
              Registrarse
            </button>
            <div className="relative py-2 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-border-dark"></div></div>
              <span className="relative bg-background-light dark:bg-background-dark px-2 text-sm text-gray-500">o regístrate con</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 h-10 rounded-lg border dark:border-border-dark bg-white dark:bg-surface-dark hover:bg-gray-50 text-sm font-medium">G Google</button>
              <button className="flex items-center justify-center gap-2 h-10 rounded-lg border dark:border-border-dark bg-white dark:bg-surface-dark hover:bg-gray-50 text-sm font-medium">F Facebook</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
