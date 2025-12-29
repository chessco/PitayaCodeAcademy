
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import CourseEditorPage from './pages/CourseEditorPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CouponManagementPage from './pages/CouponManagementPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CoursePlayerPage from './pages/CoursePlayerPage';

const App: React.FC = () => {
  // Inicializar estado desde localStorage para persistencia básica
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuth') === 'true';
  });

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuth', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuth');
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={login} />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Course Catalog (Home) */}
        <Route path="/" element={<CatalogPage isAuthenticated={isAuthenticated} onLogout={logout} />} />
        
        {/* Details and Player */}
        <Route path="/course/:id" element={<CourseDetailPage isAuthenticated={isAuthenticated} />} />
        <Route path="/player/:id" element={<CoursePlayerPage onLogout={logout} />} />
        
        {/* Shopping Cart */}
        <Route path="/cart" element={<CartPage onLogout={logout} />} />
        
        {/* Instructor / Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboardPage onLogout={logout} />} />
        <Route path="/admin/courses" element={<AdminDashboardPage onLogout={logout} />} />
        <Route path="/admin/coupons" element={<CouponManagementPage onLogout={logout} />} />
        <Route path="/instructor/edit/:id" element={<CourseEditorPage onLogout={logout} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
