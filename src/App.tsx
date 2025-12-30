import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/MainLayout';
import './styles/globals.css';

// Mock Pages for now
const Catalog = () => <div className="space-y-6">
    <h2 className="text-3xl font-bold">Explorar Catálogo</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
            <div key={i} className="glass p-6 rounded-2xl hover:border-primary/50 transition-all cursor-pointer group">
                <div className="w-full h-40 bg-white/5 rounded-xl mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dominando NestJS & Prisma {i}</h3>
                <p className="text-sm text-secondary-foreground/60 mb-4 line-clamp-2">Aprende a construir APIs empresariales escalables con NestJS de cero a experto.</p>
                <div className="flex items-center justify-between">
                    <span className="text-primary font-bold">$49.99</span>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/80 transition-colors">Ver Detalles</button>
                </div>
            </div>
        ))}
    </div>
</div>;

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = React.useState('admin@demo.com');
    const [pass, setPass] = React.useState('admin123');
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await login(email, pass);
            navigate('/');
        } catch (err) {
            alert('Error al iniciar sesión');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="glass p-8 rounded-3xl w-full max-w-md space-y-8 animate-slide-up">
                <div className="text-center">
                    <h1 className="text-4xl font-black gradient-text tracking-tighter mb-2">BIENVENIDO</h1>
                    <p className="text-secondary-foreground/40 text-sm">Ingresa a tu academia pro</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-widest text-secondary-foreground/60">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-primary/50"
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-widest text-secondary-foreground/60">Contraseña</label>
                        <input
                            type="password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-primary/50"
                            placeholder="••••••••"
                        />
                    </div>
                    <button className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                        ENTRAR
                    </button>
                </form>
            </div>
        </div>
    );
};

// Wrapper for layout
const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Cargando...</div>;
    if (!user) return <Navigate to="/login" />;
    return <MainLayout>{children}</MainLayout>;
};

const queryClient = new QueryClient();

import { useNavigate } from 'react-router-dom';

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<MainLayout><Catalog /></MainLayout>} />
                        <Route path="/my-courses" element={<ProtectedPage><div>Mis Cursos</div></ProtectedPage>} />
                        <Route path="/studio" element={<ProtectedPage><div>Studio (Instructor Dashboard)</div></ProtectedPage>} />
                    </Routes>
                </AuthProvider>
            </Router>
        </QueryClientProvider>
    );
};

export default App;
