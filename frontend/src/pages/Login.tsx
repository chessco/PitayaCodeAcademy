import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Loader2, Sparkles, GraduationCap, ArrowRight, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('admin@pitayacode.io');
    const [password, setPassword] = useState('pitaya123');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            alert('Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#09090b] text-foreground font-sans overflow-hidden">
            {/* Left Pane - Visual Branding */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#0c0c0e] border-r border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_60%)]" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale transition-transform duration-[20000ms] scale-125 animate-[pulse_10s_infinite_alternate]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-transparent" />

                <div className="relative z-10 w-full flex flex-col justify-end p-20 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30 mb-4"
                    >
                        <GraduationCap className="text-white w-10 h-10" />
                    </motion.div>

                    <div className="space-y-4">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl font-black tracking-tight leading-tight"
                        >
                            Empodera tu <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">futuro educativo.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/40 text-lg max-w-sm font-medium leading-relaxed"
                        >
                            Accede a miles de cursos, conecta con instructores expertos y lleva tu carrera al siguiente nivel.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center space-x-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] w-fit"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <img
                                    key={i}
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 130}`}
                                    className="w-10 h-10 rounded-full border-2 border-black bg-gray-900"
                                    alt="User"
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                            Más de 10k estudiantes activos
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* Right Pane - Login Form */}
            <main className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 relative">
                {/* Mobile Background Orbs */}
                <div className="lg:hidden absolute top-0 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="lg:hidden absolute bottom-0 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px]" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[440px] space-y-12"
                >
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tight">Iniciar Sesión</h1>
                        <p className="text-white/40 font-medium">Accede a tu portal de aprendizaje personalizado.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 ml-1">Correo electrónico</label>
                                <div className="group relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 p-5 pl-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all font-semibold placeholder:text-white/10"
                                        placeholder="ejemplo@correo.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30">Contraseña</label>
                                    <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">¿Olvidaste tu contraseña?</Link>
                                </div>
                                <div className="group relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 p-5 pl-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all font-semibold placeholder:text-white/10"
                                        placeholder="Ingresa tu contraseña"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 px-1">
                            <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-blue-600 focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer" />
                            <label htmlFor="remember" className="text-xs font-bold text-white/40 cursor-pointer hover:text-white transition-colors">Recordarme</label>
                        </div>

                        <button
                            disabled={loading}
                            className="group w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.8rem] shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center relative overflow-hidden"
                        >
                            <span className="relative z-10 uppercase tracking-[0.2em] text-xs">
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Entrar'}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                    </form>

                    <div className="space-y-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                                <span className="bg-[#09090b] px-4 text-white/10">O continúa con</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center space-x-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all font-bold text-xs">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span>Google</span>
                            </button>
                            <button className="flex items-center justify-center space-x-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all font-bold text-xs">
                                <Facebook className="w-5 h-5 text-[#1877F2] fill-[#1877F2]" />
                                <span>Facebook</span>
                            </button>
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <p className="text-xs font-bold text-white/20 uppercase tracking-widest">
                            ¿No tienes una cuenta?{' '}
                            <Link to="/signup" className="text-blue-500 hover:text-blue-400">Regístrate</Link>
                        </p>
                        <div className="pt-4 opacity-20 text-[8px] font-mono tracking-tighter uppercase">
                            Build: 2026.01.27.FINAL.V1
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
