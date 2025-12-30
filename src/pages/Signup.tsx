import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/signup', { email, password });
            alert('Cuenta creada con éxito. Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (err) {
            alert('Error al crear la cuenta. El email podría estar en uso.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-4 relative overflow-hidden">
            <div className="absolute top-0 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px]" />

            <div className="glass p-10 rounded-[2.5rem] w-full max-w-md space-y-8 relative z-10 border-white/5 shadow-2xl animate-fade-in">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 tracking-tighter">
                        ÚNETE A LA ÉLITE
                    </h1>
                    <p className="text-secondary-foreground/40 text-sm">Crea tu cuenta en PitayaCode | Academy</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-1">Email Corporativo</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all text-sm font-medium"
                                placeholder="tu@empresa.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-1">Contraseña Segura</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all text-sm font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl hover:bg-gray-200 transition-all active:scale-[0.98] flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>
                                CREAR CUENTA <ArrowRight className="ml-2 w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center pt-4 border-t border-white/5">
                    <p className="text-sm text-gray-500">
                        ¿Ya eres miembro?{' '}
                        <Link to="/login" className="text-primary hover:underline font-semibold">Inicia Sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
