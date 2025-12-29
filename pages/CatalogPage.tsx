
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CourseStatus, Course } from '../types';

const MOCK_COURSES: Course[] = [
  { id: '1', title: 'Master en React y Node.js', instructor: 'Miguel Torres', price: 19.99, students: 210, status: CourseStatus.PUBLISHED, category: 'Desarrollo Web', lessons: 42, image: 'https://picsum.photos/400/250?1', description: 'Aprende a construir aplicaciones completas.' },
  { id: '2', title: 'Estrategias de Marketing Digital', instructor: 'Ana García', price: 24.99, students: 1200, status: CourseStatus.PUBLISHED, category: 'Marketing Digital', lessons: 30, image: 'https://picsum.photos/400/250?2', description: 'Domina las redes sociales y el SEO.' },
  { id: '3', title: 'Fundamentos de Diseño UI/UX', instructor: 'Carlos Ruiz', price: 14.99, students: 85, status: CourseStatus.PUBLISHED, category: 'Diseño UX/UI', lessons: 25, image: 'https://picsum.photos/400/250?3', description: 'Diseña interfaces que enamoren.' },
  { id: '4', title: 'Gestión Ágil de Proyectos', instructor: 'Elena White', price: 'Gratis', students: 340, status: CourseStatus.PUBLISHED, category: 'Negocios', lessons: 15, image: 'https://picsum.photos/400/250?4', description: 'Metodologías ágiles para equipos.' },
  { id: '5', title: 'Finanzas Personales 101', instructor: 'Roberto Díaz', price: 12.99, students: 89, status: CourseStatus.PUBLISHED, category: 'Negocios', lessons: 20, image: 'https://picsum.photos/400/250?5', description: 'Toma el control de tu dinero.' },
  { id: '6', title: 'Python para Ciencia de Datos', instructor: 'Laura Méndez', price: 39.99, students: 150, status: CourseStatus.PUBLISHED, category: 'Desarrollo Web', lessons: 50, image: 'https://picsum.photos/400/250?6', description: 'Analiza datos complejos.' },
];

interface CatalogPageProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const CatalogPage: React.FC<CatalogPageProps> = ({ isAuthenticated, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const filteredCourses = MOCK_COURSES.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b dark:border-border-dark bg-white/80 dark:bg-[#111722]/90 backdrop-blur-md px-4 sm:px-10 py-3">
        <div className="flex items-center gap-4">
          <div className="size-8 text-primary">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 48 48"><path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"/></svg>
          </div>
          <h2 className="text-lg font-bold font-lexend">Academia Pro</h2>
        </div>

        <nav className="flex items-center gap-4 sm:gap-8 text-sm font-medium">
          <Link to="/" className="hidden sm:block hover:text-primary transition-colors">Inicio</Link>
          <Link to="/cart" className="relative group">
            <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
            <span className="absolute -top-1 -right-2 bg-primary text-[10px] text-white rounded-full size-4 flex items-center justify-center">2</span>
          </Link>

          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Entrar</Link>
              <Link to="/register" className="hidden sm:block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all">Registrarse</Link>
            </div>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="size-10 rounded-full border-2 border-primary/20 overflow-hidden hover:border-primary transition-all p-0.5"
              >
                <img src="https://i.pravatar.cc/100?u=4" alt="Avatar" className="rounded-full" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white dark:bg-surface-dark border dark:border-border-dark shadow-2xl p-2 z-50">
                  <div className="p-3 border-b dark:border-border-dark mb-1">
                    <p className="font-bold text-sm">Carlos R.</p>
                    <p className="text-xs text-slate-500">carlos@ejemplo.com</p>
                  </div>
                  <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-background-dark transition-colors">
                    <span className="material-symbols-outlined text-[20px]">dashboard</span> Panel de Control
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors mt-1"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

      <main className="max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black font-lexend tracking-tight">Explora nuestros cursos</h1>
          <p className="text-slate-500 dark:text-text-secondary">Encuentra el contenido perfecto para desarrollar tus habilidades.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              className="w-full h-12 rounded-lg pl-12 pr-4 bg-white dark:bg-surface-dark border dark:border-border-dark focus:ring-2 focus:ring-primary/50 outline-none"
              placeholder="Buscar por título, instructor o tema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="h-12 px-4 rounded-lg bg-white dark:bg-surface-dark border dark:border-border-dark outline-none cursor-pointer">
            <option>Más recientes</option>
            <option>Precio: Bajo a Alto</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Link to={`/course/${course.id}`} key={course.id} className="group flex flex-col rounded-xl border dark:border-border-dark bg-white dark:bg-surface-dark overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={course.image} alt={course.title} />
                <div className="absolute top-3 left-3 z-10 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Nuevo</div>
              </div>
              <div className="p-5 flex flex-col flex-1 gap-3">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="material-symbols-outlined text-yellow-500 text-[18px]">star</span>
                  <span>4.8</span>
                  <span className="text-slate-500 text-xs">(210)</span>
                </div>
                <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-slate-500 dark:text-text-secondary text-xs font-medium uppercase">{course.instructor}</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t dark:border-slate-800">
                  <span className="text-xl font-bold">{typeof course.price === 'number' ? `$${course.price}` : course.price}</span>
                  <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-sm font-bold rounded-lg hover:bg-primary hover:text-white transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      
      <footer className="mt-auto border-t dark:border-border-dark py-8 px-10 bg-white dark:bg-[#111722] text-center md:text-left">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© 2024 Academia Pro. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-primary transition-colors">Términos</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Ayuda</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CatalogPage;
