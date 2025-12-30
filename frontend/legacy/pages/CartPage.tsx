
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem } from '../types';

const CART_ITEMS: CartItem[] = [
  { id: '1', title: 'Master en Diseño UX/UI Avanzado: De la Teoría a la Práctica', instructor: 'Ana García', price: 89.99, originalPrice: 129.99, image: 'https://picsum.photos/300/180?1' },
  { id: '2', title: 'Liderazgo Efectivo y Gestión de Equipos Remotos', instructor: 'Carlos Ruiz', price: 49.99, image: 'https://picsum.photos/300/180?2' },
];

interface CartPageProps {
  onLogout: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#0f1218] text-slate-900 dark:text-white flex flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b dark:border-border-dark bg-[#111722] px-6 z-20">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
              <span className="material-symbols-outlined">school</span>
            </div>
            <h2 className="text-white text-lg font-bold font-lexend">Academia Pro</h2>
          </Link>
          <div className="h-6 w-px bg-slate-700 hidden md:block"></div>
          <Link to="/" className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span> Seguir Explorando
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-l dark:border-border-dark pl-6">
             <div className="bg-cover rounded-full size-9 border-2 border-transparent" style={{ backgroundImage: "url('https://i.pravatar.cc/100?u=carlos')" }}></div>
             <span className="text-sm font-medium text-white hidden lg:block">Carlos R.</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-3xl font-bold mb-8 font-lexend">Carrito de Compras</h1>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white dark:bg-surface-dark border dark:border-border-dark rounded-xl overflow-hidden">
                <div className="p-6 border-b dark:border-border-dark flex justify-between items-center">
                  <h2 className="font-semibold">{CART_ITEMS.length} Cursos en tu carrito</h2>
                  <button className="text-sm text-red-500 font-medium hover:underline">Vaciar carrito</button>
                </div>
                {CART_ITEMS.map(item => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 border-b dark:border-border-dark last:border-0 hover:bg-slate-50 dark:hover:bg-[#252b3b] transition-colors">
                    <div className="shrink-0 w-full sm:w-40 aspect-video rounded-lg bg-cover bg-center border dark:border-border-dark" style={{ backgroundImage: `url(${item.image})` }} />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-lg font-bold hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                          <p className="text-slate-500 text-sm mt-1">Por {item.instructor}</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-xl font-bold">{item.price} €</span>
                          {item.originalPrice && <span className="block text-sm text-slate-400 line-through">{item.originalPrice} €</span>}
                        </div>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <button className="text-slate-500 hover:text-red-500 text-sm font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">delete</span> Eliminar
                        </button>
                        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">Mover a deseados</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white dark:bg-surface-dark border dark:border-border-dark rounded-xl p-6 sticky top-8 shadow-sm">
                <h2 className="text-lg font-bold mb-4 font-lexend">Resumen</h2>
                <div className="space-y-3 pb-6 border-b dark:border-border-dark">
                  <div className="flex justify-between text-slate-500 text-sm"><span>Precio original</span><span>179.98 €</span></div>
                  <div className="flex justify-between text-slate-500 text-sm"><span>Descuentos</span><span className="text-green-500">-40.00 €</span></div>
                  <div className="flex justify-between font-medium pt-2 text-lg"><span>Subtotal</span><span>139.98 €</span></div>
                </div>
                <div className="pt-6">
                  <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[20px]">lock</span> Proceder al Pago
                  </button>
                  <p className="text-center text-xs text-slate-500 mb-4 font-medium">Garantía de 30 días</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
