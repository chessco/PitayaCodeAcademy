import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Monitor, LogOut, ChevronRight, LayoutDashboard, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout, tenantId } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: 'Catálogo', icon: BookOpen, path: '/' },
        { label: 'Mis Cursos', icon: Monitor, path: '/my-courses' },
    ];

    const isAdmin = user?.memberships?.some(m => m.role === 'ADMIN' || m.role === 'INSTRUCTOR');

    if (isAdmin) {
        navItems.push({ label: 'Studio', icon: LayoutDashboard, path: '/studio' });
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 flex flex-col p-4 bg-card/50 backdrop-blur-xl sticky top-0 h-screen">
                <div className="mb-8 p-4">
                    <h1 className="text-xl font-bold gradient-text uppercase tracking-widest text-nowrap">PitayaCode | Academy</h1>
                    <p className="text-xs text-secondary-foreground/50 opacity-50">Enterprise LMS</p>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${location.pathname === item.path
                                ? 'bg-primary/20 text-primary border-l-2 border-primary'
                                : 'hover:bg-white/5 text-secondary-foreground/60'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="pt-4 border-t border-white/10 space-y-2">
                    {user ? (
                        <button
                            onClick={() => { logout(); navigate('/login'); }}
                            className="flex items-center space-x-3 p-3 w-full text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Cerrar Sesión</span>
                        </button>
                    ) : (
                        <Link to="/login" className="flex items-center space-x-3 p-3 w-full hover:bg-white/5 rounded-lg transition-colors">
                            <span className="font-medium">Iniciar Sesión</span>
                        </Link>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-blue-900/10">
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-card/30 backdrop-blur-md">
                    <div className="flex items-center text-sm text-secondary-foreground/60 uppercase tracking-tighter">
                        <span>Dashboard</span>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-foreground">{location.pathname.replace('/', '') || 'Catálogo'}</span>
                    </div>
                    {user && (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium">{user.email}</span>
                            <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center border border-primary/50">
                                {user.email[0].toUpperCase()}
                            </div>
                        </div>
                    )}
                </header>
                <div className="p-8 animate-fade-in lg:px-12 xl:px-20">
                    {children}
                </div>
            </main>
        </div>
    );
};
