import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import {
    Play, CheckCircle, Shield, Clock, Users, Globe,
    ChevronRight, ShoppingCart, ArrowRight, Star,
    Share2, Heart, Award, Smartphone, Info,
    ChevronDown, ChevronUp, MessageSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [openSections, setOpenSections] = useState<string[]>(['sec1']);

    const { data: course, isLoading } = useQuery({
        queryKey: ['course', id],
        queryFn: async () => {
            const res = await api.get(`/courses/${id}`);
            return res.data;
        },
    });

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(s => s !== sectionId)
                : [...prev, sectionId]
        );
    };

    if (isLoading) return (
        <div className="min-h-screen bg-[#09090b] pt-12">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="space-y-8 animate-pulse">
                    <div className="h-4 w-48 bg-white/5 rounded-full" />
                    <div className="h-[400px] bg-white/5 rounded-[3rem]" />
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 h-[600px] bg-white/5 rounded-[2rem]" />
                        <div className="h-[400px] bg-white/5 rounded-[2rem]" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#09090b] text-white">
            {/* Dark Hero Section */}
            <div className="bg-[#111114] border-b border-white/5 pt-12 pb-24 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -mr-64 -mt-32" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full -ml-32 -mb-16" />

                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Breadcrumbs */}
                            <nav className="flex items-center space-x-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
                                <ChevronRight className="w-3 h-3" />
                                <Link to="/catalog" className="hover:text-primary transition-colors">Cursos</Link>
                                <ChevronRight className="w-3 h-3" />
                                <span className="hover:text-primary transition-colors cursor-pointer">Marketing</span>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-gray-400">Marketing Digital</span>
                            </nav>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <span className="bg-amber-400 text-black px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider">MÁS VENDIDO</span>
                                    <div className="flex items-center text-amber-400 space-x-1">
                                        <span className="text-sm font-black">4.8</span>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-bold text-primary underline underline-offset-4 cursor-pointer">(1,250 reseñas)</span>
                                    <span className="text-[11px] font-bold text-gray-500">15.800 estudiantes</span>
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">{course.title}</h1>
                                <p className="text-lg text-gray-400 font-medium max-w-3xl leading-relaxed">
                                    {course.description || 'Domina el SEO, SEM, Email Marketing y Redes Sociales con proyectos prácticos desde cero. Conviértete en un experto digital.'}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-8 items-center text-[11px] font-bold text-gray-500 uppercase tracking-widest pt-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-600">Creado por</span>
                                    <span className="text-primary hover:underline cursor-pointer">Juan Pérez</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-gray-600" />
                                    <span>Última actualización: Marzo 2024</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Globe className="w-4 h-4 text-gray-600" />
                                    <span>Español</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 -mt-16 relative z-20 pb-24">
                <div className="grid lg:grid-cols-3 gap-12 items-start">

                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Video Preview Mobile (Visible only on small screens) */}
                        <div className="lg:hidden rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8">
                            <div className="aspect-video bg-black relative group flex items-center justify-center">
                                <img src={course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1031&auto=format&fit=crop"} className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl scale-110">
                                        <Play className="w-6 h-6 fill-white text-white translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* What you'll learn */}
                        <section className="bg-white/[0.02] border border-white/5 p-8 lg:p-10 rounded-[2.5rem] shadow-xl">
                            <h3 className="text-2xl font-black tracking-tight mb-8">Lo que aprenderás</h3>
                            <div className="grid md:grid-cols-2 gap-y-5 gap-x-10">
                                {[
                                    'Estrategias avanzadas de SEO on-page y off-page.',
                                    'Creación y optimización de campañas en Google Ads.',
                                    'Gestión profesional de Facebook e Instagram Ads.',
                                    'Email Marketing y automatización con Mailchimp.',
                                    'Analítica web con Google Analytics 4.',
                                    'Copywriting persuasivo para ventas.'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start space-x-3 group">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                                        <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Curriculum Accordion */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black tracking-tight">Contenido del curso</h3>
                                <div className="flex items-center space-x-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                    <span>8 secciones</span>
                                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                    <span>42 clases</span>
                                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                    <span>13h 20m de duración total</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: 'sec1', title: 'Introducción al Marketing Digital', lessons: 5, time: '35min' },
                                    { id: 'sec2', title: 'Estrategia SEO (Search Engine Optimization)', lessons: 12, time: '4h 20min' },
                                    { id: 'sec3', title: 'Publicidad en Redes Sociales (Social Ads)', lessons: 8, time: '1h 45min' }
                                ].map((sec) => (
                                    <div key={sec.id} className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
                                        <button
                                            onClick={() => toggleSection(sec.id)}
                                            className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors"
                                        >
                                            <div className="flex items-center space-x-4">
                                                {openSections.includes(sec.id) ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                                                <span className="text-sm font-black text-white">{sec.title}</span>
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                                {sec.lessons} clases • {sec.time}
                                            </div>
                                        </button>
                                        <AnimatePresence>
                                            {openSections.includes(sec.id) && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-[#09090b]/40 border-t border-white/5"
                                                >
                                                    <div className="p-2">
                                                        {(course.lessons || []).slice(0, 3).map((lesson: any, i: number) => (
                                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                                                <div className="flex items-center space-x-4">
                                                                    <Play className="w-3.5 h-3.5 text-gray-700 group-hover:text-primary" />
                                                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{lesson.title}</span>
                                                                </div>
                                                                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">15:00</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                                <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
                                    Mostrar todas las secciones
                                </button>
                            </div>
                        </section>

                        {/* Requirements */}
                        <section className="space-y-6">
                            <h3 className="text-2xl font-black tracking-tight">Requisitos</h3>
                            <ul className="space-y-4">
                                {[
                                    'No se requieren experiencias previa en marketing.',
                                    'Acceso a una computadora con conexión a internet.',
                                    'Ganas de aprender y poner en práctica los conocimientos.',
                                    'Cuenta gratuita de Google (para Analytics y Ads).'
                                ].map((req, i) => (
                                    <li key={i} className="flex items-center space-x-4 text-sm font-medium text-gray-400">
                                        <span className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Long Description */}
                        <section className="space-y-6">
                            <h3 className="text-2xl font-black tracking-tight">Descripción</h3>
                            <div className="text-sm font-medium text-gray-400 leading-relaxed space-y-4">
                                <p>Este curso completo de Marketing Digital está diseñado para llevarte desde los fundamentos hasta un nivel profesional avanzado. Aprenderás a dominar las herramientas más importantes del mercado actual.</p>
                                <p>A través de ejemplos prácticos y proyectos reales, descubrirás cómo crear estrategias efectivas que generen resultados medibles. No importa si eres emprendedor, estudiante o profesional buscando actualizarse, este curso te dará las habilidades necesarias para triunfar en el entorno digital.</p>
                                <p>Al finalizar el curso, serás capaz de planificar, ejecutar y optimizar campañas completas en múltiples canales, entender el comportamiento del usuario y maximizar el retorno de inversión (ROI).</p>
                            </div>
                        </section>

                        {/* Instructor Detail */}
                        <section className="space-y-8">
                            <h3 className="text-2xl font-black tracking-tight">Instructor</h3>
                            <div className="bg-white/[0.02] border border-white/5 p-8 lg:p-10 rounded-[2.5rem] shadow-xl">
                                <div className="flex items-center space-x-6 mb-8">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/5">
                                        <img src="https://i.pravatar.cc/150?u=juan" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-white mb-1">Juan Pérez</h4>
                                        <p className="text-xs font-bold text-primary uppercase tracking-widest">Consultor de Marketing Digital & Growth Hacker</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6 mb-8 border-y border-white/5 py-6">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Calificación</p>
                                        <div className="flex items-center justify-center space-x-1 text-white font-black">
                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            <span>4.9</span>
                                        </div>
                                    </div>
                                    <div className="text-center border-x border-white/5">
                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Reseñas</p>
                                        <p className="text-white font-black">22,500</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Estudiantes</p>
                                        <p className="text-white font-black">98k</p>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-400 leading-relaxed">
                                    Juan es un experto en marketing digital con más de 10 años de experiencia trabajando con startups y empresas Fortune 500. Ha ayudado a escalar negocios de 0 a 7 cifras utilizando estrategias de SEO y publicidad pagada. Su pasión es enseñar de manera práctica y directa.
                                </p>
                            </div>
                        </section>

                        {/* Reviews Distribution */}
                        <section className="space-y-10">
                            <h3 className="text-2xl font-black tracking-tight">Valoraciones de estudiantes</h3>
                            <div className="grid md:grid-cols-3 gap-12 items-center">
                                <div className="text-center space-y-4">
                                    <p className="text-7xl font-black text-white">4.8</p>
                                    <div className="flex justify-center text-amber-400 space-x-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                                    </div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Calificación del curso</p>
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    {[75, 18, 5, 1, 1].map((perc, i) => (
                                        <div key={i} className="flex items-center space-x-4">
                                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000"
                                                    style={{ width: `${perc}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center space-x-2 text-[10px] font-black text-gray-600 w-12 shrink-0">
                                                <span>{5 - i}</span>
                                                <Star className="w-3 h-3 fill-current" />
                                                <span className="text-gray-400">{perc}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 pt-6">
                                {[
                                    { name: 'María Rodríguez', Initial: 'MR', rating: 5, date: 'hace 2 semanas', comment: 'Excelente curso, muy completo y fácil de seguir. Los ejemplos reales son de mucha utilidad. Los módulos de Facebook Ads me ayudaron a conseguir mi primer cliente la misma semana. ¡Totalmente recomendado!' },
                                    { name: 'Carlos López', Initial: 'CL', rating: 4, date: 'hace 1 mes', comment: 'Muy buen contenido sobre SEO. Me hubiera gustado un poco más de profundidad en Google Analytics 4, pero en general es una gran introducción al mundo digital.' }
                                ].map((rev, i) => (
                                    <div key={i} className="bg-white/[0.01] border-b border-white/5 pb-8 last:border-0">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-xs font-black text-primary">
                                                {rev.Initial}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white">{rev.name}</p>
                                                <div className="flex items-center space-x-3 text-[10px] font-bold">
                                                    <div className="flex text-amber-400">
                                                        {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                                                    </div>
                                                    <span className="text-gray-600 uppercase tracking-widest">{rev.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-400 leading-relaxed italic">"{rev.comment}"</p>
                                    </div>
                                ))}
                                <button className="w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                                    Ver más reseñas
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Sticky Sidebar */}
                    <aside className="lg:sticky lg:top-32 space-y-8">
                        {/* Pricing Card */}
                        <div className="bg-[#111114] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl">
                            {/* Preview Video Desktop */}
                            <div className="hidden lg:block aspect-video bg-black relative group flex items-center justify-center cursor-pointer">
                                <img src={course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1031&auto=format&fit=crop"} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-2xl">
                                        <Play className="w-6 h-6 fill-white translate-x-1" />
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Vista previa del curso</span>
                                </div>
                            </div>

                            <div className="p-10 space-y-8">
                                <div className="flex items-baseline space-x-3">
                                    <span className="text-5xl font-black text-white">${course.price}</span>
                                    <span className="text-lg text-gray-700 font-bold line-through">$199.99</span>
                                    <span className="text-sm font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">-80%</span>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Comprar ahora
                                    </button>
                                    <button
                                        onClick={() => {
                                            addToCart({
                                                id: course.id,
                                                title: course.title,
                                                price: Number(course.price),
                                                instructor: 'Juan Pérez'
                                            });
                                            navigate('/cart');
                                        }}
                                        className="w-full py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-lg hover:bg-white/10 transition-all"
                                    >
                                        Añadir al carrito
                                    </button>
                                    <p className="text-[10px] text-center font-bold text-gray-600 uppercase tracking-widest pt-2">Garantía de devolución de dinero de 30 días</p>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Este curso incluye:</p>
                                    <ul className="space-y-5">
                                        <SidebarBenefit icon={<Smartphone className="w-4 h-4" />} text="Acceo en dispositivos móviles" />
                                        <SidebarBenefit icon={<Clock className="w-4 h-4" />} text="35 horas de vídeo bajo demanda" />
                                        <SidebarBenefit icon={<Info className="w-4 h-4" />} text="15 recursos descargables" />
                                        <SidebarBenefit icon={<Award className="w-4 h-4" />} text="Certificado de finalización" />
                                        <SidebarBenefit icon={<CheckCircle className="w-4 h-4" />} text="Acceso de por vida" />
                                    </ul>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <button className="flex items-center space-x-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                                        <Share2 className="w-4 h-4" />
                                        <span>Compartir</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                                        <Heart className="w-4 h-4" />
                                        <span>Regalar curso</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Business Card */}
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                            <h4 className="text-lg font-black tracking-tight">Entrena a tu equipo</h4>
                            <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
                                Dale acceso a este curso y a más de 5,000 cursos principales para tu equipo con
                                <span className="text-primary font-bold"> LMS Business</span>.
                            </p>
                            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                                Prueba LMS Business
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Footer Mock */}
            <footer className="bg-[#0c0c0e] border-t border-white/5 py-12">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:row items-center justify-between gap-6">
                    <div className="flex items-center space-x-2 text-primary font-black">
                        <Award className="w-6 h-6" />
                        <span>PitayaCode | Academy</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">© 2024 PitayaCode | Academy, Inc.</p>
                </div>
            </footer>
        </div>
    );
}

const SidebarBenefit = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <li className="flex items-center space-x-4 group">
        <div className="text-gray-700 group-hover:text-primary transition-colors">
            {icon}
        </div>
        <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-tight">{text}</span>
    </li>
);
