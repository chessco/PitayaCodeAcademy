import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Book, User, ArrowRight, PlayCircle, Star, Sparkles, Filter, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function Catalog() {
    const { addToCart } = useCart();
    const { data: courses, isLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const res = await api.get('/courses');
            return res.data;
        },
    });

    if (isLoading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
                <div key={i} className="glass h-[450px] rounded-[2.5rem] animate-pulse" />
            ))}
        </div>
    );

    return (
        <div className="space-y-16">
            {/* Premium Hero Section */}
            <section className="relative group p-1 w-full rounded-[4rem] bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent">
                <div className="relative overflow-hidden p-16 md:p-20 rounded-[3.8rem] bg-[#0c0c0e] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="relative z-10 max-w-2xl text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Transformación Digital</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
                        >
                            Expande tus <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">límites hoy.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/50 text-xl mb-10 leading-relaxed font-medium"
                        >
                            Aprende de expertos industriales con proyectos del mundo real <br className="hidden md:block" />
                            y obtén las habilidades que el mercado demanda.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 justify-center md:justify-start"
                        >
                            <button className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-600/20">
                                Comenzar Ahora
                            </button>
                            <button className="w-full sm:w-auto bg-white/5 backdrop-blur-md border border-white/10 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-white/80 hover:bg-white/10 transition-all">
                                Explorar Path
                            </button>
                        </motion.div>
                    </div>

                    <div className="relative group hidden lg:block">
                        <div className="absolute -inset-4 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                        <div className="relative w-80 h-80 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700">
                            <img
                                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"
                                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-10">
                <div>
                    <h2 className="text-3xl font-black tracking-tight flex items-center space-x-4">
                        <span className="w-3 h-10 bg-blue-600 rounded-full" />
                        <span>Cursos Disponibles</span>
                    </h2>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] mt-2 ml-7">Explora nuestra selección premium</p>
                </div>
                <div className="flex bg-white/5 p-1.5 rounded-[1.2rem] border border-white/5 shadow-inner">
                    <button className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/20">Todos</button>
                    <button className="px-6 py-2.5 rounded-xl text-white/40 font-black text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center space-x-2">
                        <span>Programación</span>
                    </button>
                    <button className="px-6 py-2.5 rounded-xl text-white/40 font-black text-xs uppercase tracking-widest hover:text-white transition-colors">Diseño</button>
                    <div className="w-px h-5 bg-white/10 mx-2 self-center" />
                    <button className="p-2.5 rounded-xl text-white/40 hover:bg-white/5 transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Courses Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20"
            >
                {courses?.items?.map((course: any) => (
                    <motion.div key={course.id} variants={item}>
                        <div className="group flex flex-col h-full rounded-[2.8rem] bg-[#111113] border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
                            <Link
                                to={`/courses/${course.id}`}
                                className="flex-1"
                            >
                                <div className="aspect-[16/10] relative overflow-hidden m-2 rounded-[2.2rem]">
                                    <img
                                        src={`https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000&auto=format&fit=crop`}
                                        alt={course.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    <div className="absolute top-4 left-4 flex space-x-2">
                                        <span className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/40">
                                            Nivel Pro
                                        </span>
                                    </div>

                                    <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-gray-800 overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + course.id}`} alt="Av" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">+120 Alumnos</span>
                                    </div>
                                </div>

                                <div className="p-8 pb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-1.5 text-yellow-500">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            <span className="text-xs font-black">4.9</span>
                                        </div>
                                        <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">12 h Contenido</span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                                        {course.title}
                                    </h3>
                                </div>
                            </Link>

                            <div className="p-8 pt-0 mt-auto border-t border-white/5 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-1">Precio</span>
                                    <span className="text-2xl font-black text-white">${course.price}</span>
                                </div>
                                <button
                                    onClick={() => addToCart({
                                        id: course.id,
                                        title: course.title,
                                        price: Number(course.price),
                                        instructor: 'Instructor Academy'
                                    })}
                                    className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/50 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 shadow-xl hover:shadow-blue-600/30"
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {courses?.length === 0 && (
                    <div className="col-span-full py-32 text-center rounded-[3rem] border-2 border-dashed border-white/5 bg-white/[0.02]">
                        <Book className="w-20 h-20 text-white/10 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white/40 mb-2">No hay cursos disponibles aún</h3>
                        <p className="text-white/20 text-sm font-medium">Nuestros expertos están preparando nuevos contenidos para ti.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
