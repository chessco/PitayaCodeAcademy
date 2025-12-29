
import React from 'react';
import { Link } from 'react-router-dom';

const CouponManagementPage: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b dark:border-border-dark bg-[#111722] px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
              <span className="material-symbols-outlined">school</span>
            </div>
            <h2 className="text-white text-base font-bold">Gestionar Cupones</h2>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r dark:border-border-dark bg-[#111621] p-4 flex flex-col gap-6">
          <nav className="flex flex-col gap-1">
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-surface-dark"><span className="material-symbols-outlined">dashboard</span> Resumen</Link>
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-surface-dark"><span className="material-symbols-outlined">library_books</span> Cursos</Link>
            <Link to="/admin/coupons" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-bold"><span className="material-symbols-outlined">local_activity</span> Cupones</Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
             <div className="flex justify-between items-end">
                <div>
                   <h1 className="text-3xl font-black font-lexend tracking-tight">Cupones de Descuento</h1>
                   <p className="text-slate-500">Gestiona los códigos promocionales para marketing.</p>
                </div>
                <button className="h-10 px-6 rounded-lg bg-primary text-white font-bold shadow-lg">Crear Nuevo Cupón</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-surface-dark border dark:border-border-dark p-4 rounded-xl flex items-center gap-4">
                   <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg"><span className="material-symbols-outlined text-3xl">check_circle</span></div>
                   <div><p className="text-xs text-slate-500">Activos</p><p className="text-2xl font-bold">12</p></div>
                </div>
                <div className="bg-white dark:bg-surface-dark border dark:border-border-dark p-4 rounded-xl flex items-center gap-4">
                   <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg"><span className="material-symbols-outlined text-3xl">shopping_cart</span></div>
                   <div><p className="text-xs text-slate-500">Canjes</p><p className="text-2xl font-bold">1,438</p></div>
                </div>
                <div className="bg-white dark:bg-surface-dark border dark:border-border-dark p-4 rounded-xl flex items-center gap-4">
                   <div className="p-3 bg-primary/10 text-primary rounded-lg"><span className="material-symbols-outlined text-3xl">savings</span></div>
                   <div><p className="text-xs text-slate-500">Ahorro</p><p className="text-2xl font-bold">$8.5k</p></div>
                </div>
             </div>

             <div className="bg-white dark:bg-surface-dark border dark:border-border-dark rounded-xl overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-gray-50 dark:bg-[#151b26] border-b dark:border-border-dark text-[10px] uppercase font-bold text-slate-500">
                      <tr>
                        <th className="p-4">Código</th>
                        <th className="p-4">Valor</th>
                        <th className="p-4">Canjes</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y dark:divide-border-dark text-sm">
                      {[
                        { code: 'VERANO2024', val: '20%', canjes: '45/100', status: 'Activo' },
                        { code: 'REACT10', val: '$10.00', canjes: '12/50', status: 'Activo' },
                        { code: 'BECAUX', val: '100%', canjes: '5/5', status: 'Agotado' }
                      ].map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-[#151b26] transition-colors">
                           <td className="p-4"><span className="font-mono font-bold bg-slate-100 dark:bg-[#111621] px-2 py-1 rounded border dark:border-border-dark">{c.code}</span></td>
                           <td className="p-4 font-bold">{c.val}</td>
                           <td className="p-4 text-slate-500">{c.canjes}</td>
                           <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${c.status === 'Activo' ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'}`}>
                                {c.status}
                              </span>
                           </td>
                           <td className="p-4 text-right">
                              <button className="p-2 hover:text-primary"><span className="material-symbols-outlined">edit</span></button>
                              <button className="p-2 hover:text-red-500"><span className="material-symbols-outlined">delete</span></button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CouponManagementPage;
