
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface AdminDashboardPageProps {
  onLogout: () => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b dark:border-border-dark bg-[#111722] px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div className="flex flex-col">
               <h2 className="text-white text-sm font-bold leading-none">Academia Pro</h2>
               <span className="text-xs text-slate-400 font-medium">Administración</span>
            </div>
          </Link>
          <Link to="/" className="text-slate-400 hover:text-white text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">visibility</span> Ver Academia
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r dark:border-border-dark bg-[#111621] p-4 flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <div className="px-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Principal</p>
              <nav className="flex flex-col gap-1">
                <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-surface-dark transition-colors">
                  <span className="material-symbols-outlined">dashboard</span> <span className="text-sm">Resumen</span>
                </Link>
                <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">library_books</span> <span className="text-sm font-bold">Gestionar Cursos</span>
                </Link>
                <Link to="/admin/coupons" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-surface-dark transition-colors">
                  <span className="material-symbols-outlined">local_offer</span> <span className="text-sm">Cupones</span>
                </Link>
              </nav>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-surface-dark rounded-xl border dark:border-border-dark">
               <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="text-slate-400">Almacenamiento</span>
                  <span className="font-bold">75%</span>
               </div>
               <div className="w-full bg-background-dark h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-3/4" />
               </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-medium"
            >
              <span className="material-symbols-outlined">logout</span> <span className="text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
             <div className="flex justify-between items-center">
                <div>
                   <h1 className="text-2xl font-bold font-lexend">Gestionar Cursos</h1>
                   <p className="text-slate-500 text-sm">Administra y organiza el contenido educativo.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold shadow-lg hover:bg-primary-dark transition-colors">
                   <span className="material-symbols-outlined text-[20px]">add</span> Nuevo Curso
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total de Cursos', val: '24', inc: '+2 este mes', icon: 'library_books', color: 'text-primary' },
                  { label: 'Estudiantes', val: '1,245', inc: '+12%', icon: 'group', color: 'text-purple-500' },
                  { label: 'Ingresos', val: '$45.2k', inc: 'Actualizado hoy', icon: 'payments', color: 'text-green-500' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-surface-dark p-5 rounded-xl border dark:border-border-dark shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1">
                    <div>
                      <p className="text-slate-500 text-xs font-bold uppercase">{stat.label}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.val}</h3>
                      <p className="text-green-500 text-[10px] mt-2 font-bold">{stat.inc}</p>
                    </div>
                    <div className={`size-10 rounded-lg bg-gray-100 dark:bg-background-dark flex items-center justify-center ${stat.color}`}>
                       <span className="material-symbols-outlined">{stat.icon}</span>
                    </div>
                  </div>
                ))}
             </div>

             <div className="bg-white dark:bg-surface-dark border dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-[#1e2433] border-b dark:border-border-dark">
                    <tr className="text-[10px] uppercase font-bold text-slate-500">
                       <th className="p-4">Curso</th>
                       <th className="p-4">Precio</th>
                       <th className="p-4">Estudiantes</th>
                       <th className="p-4">Estado</th>
                       <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-border-dark text-sm">
                    {[1, 2, 3].map(i => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors">
                        <td className="p-4">
                           <div className="flex items-center gap-3">
                              <div className="size-10 rounded bg-slate-200 overflow-hidden">
                                <img src={`https://picsum.photos/40?${i}`} alt="Mini" />
                              </div>
                              <div>
                                 <p className="font-bold">Curso de Prueba {i}</p>
                                 <p className="text-xs text-slate-500">Diseño • 12 Lecciones</p>
                              </div>
                           </div>
                        </td>
                        <td className="p-4 text-slate-400 font-medium">$49.99</td>
                        <td className="p-4">12{i}</td>
                        <td className="p-4">
                           <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-bold text-[10px]">Publicado</span>
                        </td>
                        <td className="p-4 text-right">
                           <Link to={`/instructor/edit/${i}`} className="p-2 hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></Link>
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

export default AdminDashboardPage;
