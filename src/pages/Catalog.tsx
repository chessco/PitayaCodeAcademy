import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Book, User, ArrowRight, PlayCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Catalog() {
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
                <div key={i} className="glass h-[400px] rounded-3xl animate-pulse" />
            ))}
        </div>
    );

    return (
        <div className="space-y-10">
            <div className="relative overflow-hidden p-12 rounded-[3rem] bg-gradient-to-r from-blue-600 to-indigo-700 text-white mb-10 shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-5xl font-black tracking-tight mb-4">Expande tus límites con Expertos</h1>
                    <p className="text-blue-100/80 text-lg mb-8">Aprende tecnologías de vanguardia con proyectos del mundo real y mentoría personalizada.</p>
                    <div className="flex space-x-4">
                        <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">Ver Populares</button>
                        <button className="bg-blue-500/30 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-blue-500/40 transition-all">Suscripción Pro</button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/2" />
            </div>

            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center">
                    <span className="w-2 h-8 bg-primary rounded-full mr-4" />
                    Cursos Disponibles
                </h2>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button className="px-5 py-2 rounded-lg bg-primary text-white font-medium text-sm">Todos</button>
                    <button className="px-5 py-2 rounded-lg text-gray-400 font-medium text-sm hover:text-white transition-colors">Programación</button>
                    <button className="px-5 py-2 rounded-lg text-gray-400 font-medium text-sm hover:text-white transition-colors">Diseño</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {courses?.map((course: any) => (
                    <Link
                        key={course.id}
                        to={`/courses/${course.id}`}
                        className="group glass rounded-[2.5rem] overflow-hidden flex flex-col hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
                    >
                        <div className="aspect-video relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600" />
                            <img
                                src={`https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1031&auto=format&fit=crop`}
                                alt={course.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] uppercase font-black border border-white/20">
                                    PRO LEVEL
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                            <div className="absolute bottom-4 right-4 bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary flex items-center border border-primary/30">
                                <PlayCircle className="w-3 h-3 mr-1" />
                                12 Lecciones
                            </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                                <div className="flex items-center text-yellow-500">
                                    <Star className="w-3 h-3 fill-current mr-1" />
                                    <span className="font-bold">4.9</span>
                                </div>
                                <span>•</span>
                                <span>(120 Reseñas)</span>
                            </div>

                            <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">{course.title}</h3>

                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-gray-800 border border-white/10 overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
                                </div>
                                <span className="text-xs text-gray-400 font-medium">Por {course.instructor?.user?.email.split('@')[0] || 'Experto Pitaya'}</span>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <span className="text-gray-500 line-through text-[10px] font-bold mb-[-4px] block">$99.00</span>
                                    <span className="text-2xl font-black text-white">${course.price}</span>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg group-hover:shadow-primary/30">
                                    <ArrowRight className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {courses?.length === 0 && (
                    <div className="col-span-full py-20 text-center glass rounded-3xl">
                        <Book className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-500">No hay cursos disponibles aún</h3>
                        <p className="text-gray-600">Regresa pronto para ver nuevos contenidos.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
