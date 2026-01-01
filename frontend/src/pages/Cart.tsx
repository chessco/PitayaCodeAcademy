import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Zap, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Cart: React.FC = () => {
    const { items, removeFromCart, total, count, clearCart } = useCart();
    const navigate = useNavigate();

    const originalPrice = total * 1.25; // Mocking a discount
    const discount = originalPrice - total;

    if (count === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
                    <ShoppingBag className="w-10 h-10 text-gray-600" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">Tu carrito está vacío</h2>
                <p className="text-gray-500 max-w-md mb-10 text-lg">
                    Parece que aún no has añadido ningún curso a tu carrito. Explora nuestro catálogo y empieza a aprender hoy mismo.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                >
                    Explorar Cursos
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto pb-20">
            <header className="mb-12">
                <h1 className="text-4xl font-black text-white mb-2">Carrito de Compras</h1>
                <p className="text-gray-500 font-medium">Tienes {count} curso{count > 1 ? 's' : ''} en tu carrito</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                {/* Product List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{count} Cursos en tu carrito</span>
                        <button
                            onClick={clearCart}
                            className="text-sm font-bold text-red-500/70 hover:text-red-500 transition-colors"
                        >
                            Vaciar carrito
                        </button>
                    </div>

                    <div className="space-y-4">
                        {items.map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                className="group relative flex flex-col sm:flex-row bg-[#0c0c0e]/50 border border-white/5 rounded-3xl p-5 hover:bg-white/[0.03] transition-all"
                            >
                                <div className="w-full sm:w-48 h-32 bg-white/5 rounded-2xl overflow-hidden mb-4 sm:mb-0 sm:mr-6 shrink-0">
                                    <img
                                        src={item.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2 pr-8 leading-tight">
                                                {item.title}
                                            </h3>
                                            <span className="text-lg font-black text-white whitespace-nowrap">
                                                {item.price.toFixed(2)} €
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-3">Por <span className="text-gray-300 font-bold">{item.instructor}</span></p>

                                        <div className="flex flex-wrap gap-2 items-center">
                                            <span className="px-2 py-0.5 bg-yellow-400/10 text-yellow-400 text-[10px] font-black uppercase rounded-md border border-yellow-400/20">Bestseller</span>
                                            <span className="text-[10px] font-bold text-gray-600">•</span>
                                            <span className="text-[10px] font-bold text-gray-500">24.5 horas total</span>
                                            <span className="text-[10px] font-bold text-gray-600">•</span>
                                            <span className="text-[10px] font-bold text-gray-500">125 clases</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="flex items-center space-x-2 text-[11px] font-bold text-gray-600 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Eliminar</span>
                                        </button>
                                        <button className="text-[11px] font-bold text-gray-600 hover:text-primary transition-colors">
                                            Mover a deseados
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Recommendations */}
                    <section className="mt-20 pt-16 border-t border-white/5">
                        <h2 className="text-2xl font-black text-white mb-8">También podría interesarte</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { title: 'Introducción a Python', instructor: 'Ana García', price: 19.99, icon: Zap },
                                { title: 'Teoría del Color Avanzada', instructor: 'Roberto M.', price: 24.99, icon: Star }
                            ].map((rec, idx) => (
                                <div key={idx} className="flex items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group">
                                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform">
                                        <rec.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white text-sm mb-0.5">{rec.title}</h4>
                                        <p className="text-[10px] text-gray-500">{rec.instructor}</p>
                                        <p className="font-black text-primary text-sm mt-1">{rec.price} €</p>
                                    </div>
                                    <button className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-primary hover:bg-white/10 transition-all">
                                        <ShoppingBag className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Summary */}
                <div className="lg:sticky lg:top-32 space-y-6">
                    <div className="bg-[#0c0c0e]/80 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl">
                        <h2 className="text-2xl font-black text-white mb-8">Resumen</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-bold">Precio original</span>
                                <span className="text-white font-black">{originalPrice.toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-bold">Descuentos</span>
                                <span className="text-green-500 font-black">-{discount.toFixed(2)} €</span>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-lg font-black text-white">Subtotal</span>
                                <span className="text-lg font-black text-white">{total.toFixed(2)} €</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Cupón de descuento</p>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Ingresa código"
                                    className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors text-white placeholder:text-gray-700"
                                />
                                <button className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                    Aplicar
                                </button>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex justify-between items-end mb-8">
                            <span className="text-2xl font-black text-white">Total</span>
                            <span className="text-4xl font-black text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                {total.toFixed(2)} €
                            </span>
                        </div>

                        <button className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 mb-4">
                            <ShieldCheck className="w-5 h-5" />
                            <span>Proceder al Pago</span>
                        </button>

                        <p className="text-[10px] text-gray-500 text-center font-bold mb-6 italic">Garantía de devolución de 30 días</p>

                        <div className="flex justify-center space-x-4 mb-4 grayscale opacity-40">
                            <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] font-black italic">VISA</div>
                            <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[10px] font-black italic">AMEX</div>
                            <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center italic text-[14px]">●●</div>
                        </div>

                        <div className="flex items-center justify-center space-x-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Pagos seguros vía Stripe</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/10 rounded-[32px] p-8">
                        <h4 className="text-sm font-black text-white mb-2 uppercase tracking-widest">Soporte Premium</h4>
                        <p className="text-xs text-gray-400 mb-4 font-medium leading-relaxed">
                            ¿Necesitas ayuda con tu pedido? Nuestro equipo está disponible las 24 horas para asistirte.
                        </p>
                        <button className="text-[11px] font-black text-primary uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center">
                            <span>Contactar Soporte</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
