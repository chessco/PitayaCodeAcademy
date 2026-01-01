import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (!acceptTerms) {
            alert('Debes aceptar los Términos y Condiciones');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/signup', { name, email, password });
            alert('Cuenta creada con éxito. Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error al crear la cuenta. El email podría estar en uso.';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#09090b] text-white antialiased">
            <header className="flex items-center justify-between border-b border-white/5 px-6 py-4 lg:px-10">
                <Link to="/" className="flex items-center gap-3 text-white">
                    <div className="size-8 text-blue-500">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold">Academia Demo</h2>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline text-sm text-gray-500">¿Ya tienes una cuenta?</span>
                    <Link to="/login" className="flex items-center justify-center rounded-lg h-9 px-4 bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors border border-white/10">
                        Iniciar sesión
                    </Link>
                </div>
            </header>

            <main className="flex flex-1 flex-col items-center justify-center py-10 px-4 sm:px-6 relative z-10">
                <div className="absolute top-0 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px]" />

                <div className="w-full max-w-[520px] glass p-8 sm:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl animate-fade-in relative z-10">
                    <div className="flex flex-col gap-2 mb-8">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">Crear una cuenta</h1>
                        <p className="text-gray-500">Únete a tu academia y comienza a aprender hoy.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <label className="flex flex-col flex-1">
                            <p className="text-sm font-medium pb-2 text-gray-400">Nombre completo</p>
                            <input
                                className="rounded-xl border border-white/10 bg-white/5 h-12 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/10"
                                placeholder="Ej. Juan Pérez"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>
                        <label className="flex flex-col flex-1">
                            <p className="text-sm font-medium pb-2 text-gray-400">Correo electrónico</p>
                            <input
                                type="email"
                                className="rounded-xl border border-white/10 bg-white/5 h-12 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/10"
                                placeholder="nombre@empresa.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <label className="flex flex-col flex-1">
                                <p className="text-sm font-medium pb-2 text-gray-400">Contraseña</p>
                                <input
                                    type="password"
                                    className="rounded-xl border border-white/10 bg-white/5 h-12 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </label>
                            <label className="flex flex-col flex-1">
                                <p className="text-sm font-medium pb-2 text-gray-400">Confirmar contraseña</p>
                                <input
                                    type="password"
                                    className="rounded-xl border border-white/10 bg-white/5 h-12 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-white/10"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <div className="flex items-start gap-3 pt-2">
                            <input
                                type="checkbox"
                                className="w-5 h-5 border border-white/10 rounded bg-white/5 text-blue-600 focus:ring-blue-500/50 cursor-pointer mt-0.5"
                                id="terms"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                            />
                            <label className="text-sm text-gray-500 cursor-pointer" htmlFor="terms">
                                He leído y acepto los <a className="text-blue-500 hover:underline" href="#">Términos y Condiciones</a> y la <a className="text-blue-500 hover:underline" href="#">Política de Privacidad</a>.
                            </label>
                        </div>
                        <button
                            disabled={loading}
                            className="mt-4 flex w-full items-center justify-center rounded-xl h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Registrarse'}
                        </button>

                        <div className="relative py-2 text-center mt-2">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <span className="relative bg-[#0b0b0e] px-2 text-sm text-gray-600">o regístrate con</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" className="flex items-center justify-center gap-2 h-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                            <button type="button" className="flex items-center justify-center gap-2 h-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors">
                                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </form>
                </div>
                <div className="mt-8 text-center text-xs text-gray-600">
                    © 2024 Academia Demo. Todos los derechos reservados.
                </div>
            </main>
        </div>
    );
}
