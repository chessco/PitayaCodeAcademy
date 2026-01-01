import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    BookOpen, Monitor, LogOut, ChevronRight, LayoutDashboard, Settings,
    User as UserIcon, Users, BarChart3, CreditCard, Bell, HelpCircle,
    Eye, ChevronDown, Database, ShoppingCart, LayoutGrid, Tag, GraduationCap,
    Award, MessageSquare, Search, PlayCircle
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout, tenantId } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { count } = useCart();
    const [showNotifications, setShowNotifications] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isAdminRoute = location.pathname.startsWith('/studio');

    const mainNavItems = [
        { label: 'Resumen', icon: LayoutGrid, path: '/studio' },
        { label: 'Gestionar Cursos', icon: BookOpen, path: '/studio' },
        { label: 'Maestros', icon: Users, path: '/studio/users' },
        { label: 'Gestionar Cupones', icon: Tag, path: '/studio/coupons' },
        { label: 'Notificaciones', icon: Bell, path: '/notifications' },
    ];

    const instructorNavItems = [
        { label: 'Tablero', icon: LayoutGrid, path: '/studio' },
        { label: 'Mis Cursos', icon: BookOpen, path: '/studio' },
        { label: 'Estudiantes', icon: Users, path: '/studio/users' }, // Reusing Users page for now
        { label: 'Análisis', icon: BarChart3, path: '/studio/analytics' },
        { label: 'Mensajes', icon: MessageSquare, path: '/studio/messages' },
        { label: 'Notificaciones', icon: Bell, path: '/notifications' },
    ];

    const configNavItems = [
        { label: 'Config. del Inquilino', icon: Settings, path: '/studio/settings?tab=general' },
        { label: 'Facturación', icon: CreditCard, path: '/studio/settings?tab=billing' },
    ];

    const clientNavItems = [
        { label: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
        { label: 'Mi Perfil', icon: UserIcon, path: '/profile' },
        { label: 'Notificaciones', icon: Bell, path: '/notifications' },
        { label: 'Mis Cursos', icon: BookOpen, path: '/my-courses' },
        { label: 'Logros', icon: Award, path: '/cert-placeholder' },
        { label: 'Comunidad', icon: MessageSquare, path: '/community' },
        { label: 'Mensajes', icon: MessageSquare, path: '/studio/messages' }, // Student can message too
    ];

    // Determine current role based on active tenant
    const currentMembership = user?.memberships?.find(m => m.tenantId === tenantId) || user?.memberships?.[0];
    const currentRole = currentMembership?.role || 'STUDENT';
    const isInstructor = currentRole === 'INSTRUCTOR';
    const isAdmin = currentRole === 'ADMIN';
    const canAccessStudio = isAdmin || isInstructor;

    // Add Studio link to client menu if user is staff
    const effectiveClientNavItems = [...clientNavItems];
    if (canAccessStudio && !isAdminRoute) {
        effectiveClientNavItems.push({
            label: isInstructor ? 'Panel de Instructor' : 'Panel de Administración',
            icon: LayoutDashboard,
            path: '/studio'
        });
    }

    // Select nav items based on role
    let navItemsToRender = effectiveClientNavItems;
    if (isAdminRoute) {
        if (isInstructor) {
            navItemsToRender = instructorNavItems;
        } else {
            navItemsToRender = mainNavItems;
        }
    }

    return (
        <div className="flex min-h-screen bg-[#09090b] text-foreground font-sans overflow-hidden">
            {/* Optimized Sidebar */}
            <aside className="w-72 border-r border-white/5 flex flex-col p-6 bg-[#0c0c0e] sticky top-0 h-screen z-50">
                {!isAdminRoute ? (
                    <div className="mb-10 flex items-center space-x-4 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate('/profile')}>
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-primary/20 border border-white/10 p-0.5">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                                className="w-full h-full object-cover rounded-[14px]"
                                alt="Profile"
                            />
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-sm font-black text-white truncate">{user?.name || 'Juan Pérez'}</h2>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estudiante</p>
                        </div>
                    </div>
                ) : (
                    <div className="mb-10">
                        <div className="flex items-center space-x-3 mb-1">
                            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center">
                                    <div className="w-3 h-3 bg-primary rounded-sm" />
                                </div>
                            </div>
                            <div className="overflow-hidden font-sans">
                                <h1 className="text-lg font-black tracking-tight text-white leading-none">
                                    PitayaCode
                                </h1>
                                <p className="text-[10px] font-bold text-primary tracking-widest mt-0.5">ACADEMY</p>
                            </div>
                        </div>
                        {canAccessStudio && (
                            <p className="text-[10px] font-bold text-gray-500 pl-1 uppercase tracking-tight">
                                {isInstructor ? 'Panel de Instructor' : 'Panel de Administración'}
                            </p>
                        )}
                    </div>
                )}

                <nav className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
                    {isAdminRoute ? (
                        <>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-gray-600 mb-4 px-2">Principal</p>
                                <div className="space-y-1">
                                    {navItemsToRender.map((item) => (
                                        <NavItem key={item.path + item.label} item={item} isActive={location.pathname === item.path} />
                                    ))}
                                </div>
                            </div>

                            {isAdmin && (
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-600 mb-4 px-2">Configuración</p>
                                    <div className="space-y-1">
                                        {configNavItems.map((item) => (
                                            <NavItem key={item.path} item={item} isActive={location.pathname === item.path} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-gray-600 mb-4 px-2">Plataforma</p>
                            <div className="space-y-1">
                                {effectiveClientNavItems.map((item) => (
                                    <NavItem key={item.path + item.label} item={item} isActive={location.pathname === item.path} />
                                ))}
                            </div>
                        </div>
                    )}
                </nav>

                {/* Storage Widget - Only for Admin */}
                {isAdminRoute && isAdmin && (
                    <div className="mt-8 px-2 py-6 border-t border-white/5">
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-gray-400">Almacenamiento</span>
                                <span className="text-white">75%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="w-[75%] h-full bg-primary" />
                            </div>
                            <p className="text-[9px] text-gray-500 font-medium tracking-tight">15GB de 20GB utilizados</p>
                        </div>
                    </div>
                )}

                <div className="pt-6 border-t border-white/5 space-y-2">
                    {isAdminRoute && (
                        <NavItem
                            item={{ label: 'Ajustes', icon: Settings, path: '/studio/settings' }}
                            isActive={location.pathname === '/studio/settings'}
                        />
                    )}

                    {user ? (
                        <button
                            onClick={() => { logout(); navigate('/login'); }}
                            className="flex items-center space-x-3 w-full p-3 rounded-2xl hover:bg-white/5 text-gray-500 hover:text-red-400 transition-all group"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-bold text-xs uppercase tracking-widest">Cerrar Sesión</span>
                        </button>
                    ) : (
                        <Link to="/login" className="flex items-center justify-center space-x-3 p-4 w-full bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                            <span>Iniciar Sesión</span>
                        </Link>
                    )}
                </div>
            </aside>

            {/* Main Surface */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0c0c0e]">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#0c0c0e]/80 backdrop-blur-xl z-40">
                    <div className="flex items-center space-x-8">
                        {!isAdminRoute && (
                            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                                        <div className="w-2 h-2 bg-primary rounded-[1px]" />
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <h1 className="text-sm font-black tracking-tight text-white leading-none flex items-center">
                                        PitayaCode <span className="mx-2 text-gray-600 font-light">|</span> <span className="text-gray-400 font-medium">Academy</span>
                                    </h1>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center space-x-4">
                            {isAdminRoute ? (
                                <>
                                    <h2 className="text-xl font-black text-white">Gestionar Cursos</h2>
                                    <Link to="/" className="flex items-center text-[11px] font-bold text-gray-500 hover:text-white transition-colors ml-4">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Ver Academia
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                                    <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/dashboard')}>Inicio</span>
                                    <ChevronRight className="w-3 h-3 mx-3 opacity-50" />
                                    <span className="text-white italic">{location.pathname === '/dashboard' ? 'Tablero' : location.pathname.split('/').pop()?.replace('-', ' ') || 'Catálogo'}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 max-w-xl px-12 hidden lg:block">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar cursos, estudiantes o recursos..."
                                className="w-full h-11 bg-white/[0.03] border border-white/5 rounded-xl pl-12 pr-4 text-xs font-medium focus:outline-none focus:border-primary/30 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-4 pr-6 border-r border-white/5 relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-2.5 border rounded-xl transition-all relative group ${showNotifications
                                    ? 'bg-primary/20 border-primary/30 text-primary'
                                    : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'
                                    }`}
                            >
                                <Bell className={`w-5 h-5 transition-transform ${showNotifications ? 'scale-110' : 'group-hover:rotate-12'}`} />
                                <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#0c0c0e]" />
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <div className="absolute top-full right-0 mt-4 w-96 z-50">
                                        <NotificationDropdown onClose={() => setShowNotifications(false)} />
                                    </div>
                                )}
                            </AnimatePresence>

                            <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-gray-500 hover:text-white transition-all">
                                <HelpCircle className="w-5 h-5" />
                            </button>

                            {!isAdminRoute && (
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-gray-500 hover:text-white transition-all relative group"
                                >
                                    <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {count > 0 && (
                                        <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-black rounded-full border-2 border-[#0c0c0e] flex items-center justify-center animate-in zoom-in">
                                            {count}
                                        </div>
                                    )}
                                </button>
                            )}
                        </div>

                        <div className="flex items-center space-x-3 cursor-pointer group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-yellow-400 to-orange-500 overflow-hidden border border-white/10 group-hover:scale-105 transition-transform p-0.5">
                                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover rounded-[10px]" alt="user" />
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-xs font-black text-white leading-none mb-1 capitalize">
                                    {(user?.memberships?.[0]?.role || 'Usuario').toLowerCase()}
                                </p>
                                <p className="text-[10px] font-medium text-gray-500">{user?.email || 'admin@pitayacode.io'}</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="p-10 lg:px-12 max-w-[1600px] mx-auto min-h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

const NavItem: React.FC<{ item: any, isActive: boolean }> = ({ item, isActive }) => (
    <Link
        to={item.path}
        className={`group relative flex items-center space-x-3.5 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
            ? 'bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(59,130,246,0.02)] border border-primary/20'
            : 'hover:bg-white/[0.03] text-gray-500 hover:text-gray-300'
            }`}
    >
        <item.icon className={`w-[18px] h-[18px] transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span className="font-bold text-[13px] tracking-tight">{item.label}</span>
        {isActive && (
            <div className="absolute right-3 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        )}
    </Link>
);

const NotificationDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const navigate = useNavigate();
    // Reusing logic from Notifications page for demo/display purposes
    const notifications = [
        {
            id: '1',
            type: 'FORUM',
            title: 'Instructor Carlos respondió a tu pregunta',
            content: 'En el hilo: "Error al implementar Redux Toolkit en producción". Carlos dice: "Hola Alex, revisa la configuración de tu store..."',
            createdAt: new Date().toISOString(),
            isRead: false
        },
        {
            id: '2',
            type: 'COURSE',
            title: 'Contenido añadido a: React JS Avanzado',
            content: 'Se ha publicado una nueva lección en el Módulo 4: "Optimización de rendimiento con React.memo y useCallback".',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            isRead: false
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-[#111114] border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
        >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Notificaciones</h3>
                <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-black rounded-full uppercase tracking-widest">2 Nuevas</span>
            </div>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className="p-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                        onClick={() => { navigate('/notifications'); onClose(); }}
                    >
                        <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${n.type === 'FORUM' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                                }`}>
                                {n.type === 'FORUM' ? <MessageSquare className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                            </div>
                            <div className="space-y-1 overflow-hidden">
                                <p className="text-[13px] font-bold text-white leading-tight group-hover:text-primary transition-colors truncate">{n.title}</p>
                                <p className="text-[11px] text-gray-500 font-medium line-clamp-2 leading-relaxed">{n.content}</p>
                                <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest pt-1">Hace un momento</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => { navigate('/notifications'); onClose(); }}
                className="p-4 text-[11px] font-black text-primary uppercase tracking-[0.2em] hover:bg-primary/5 transition-all flex items-center justify-center space-x-2 border-t border-white/5"
            >
                <span>Ver todo el centro</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </motion.div>
    );
};
