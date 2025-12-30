import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/MainLayout';
import './styles/globals.css';

// Real Pages
import Catalog from './pages/Catalog';
import CourseDetail from './pages/CourseDetail';
import CoursePlayer from './pages/CoursePlayer';
import Studio from './pages/Studio';
import Login from './pages/Login';

// Wrapper for protected pages
const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (!user) return <Navigate to="/login" />;
    return <MainLayout>{children}</MainLayout>;
};

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<MainLayout><Catalog /></MainLayout>} />
                        <Route path="/courses/:id" element={<MainLayout><CourseDetail /></MainLayout>} />

                        {/* Protected Routes */}
                        <Route path="/courses/:id/player" element={
                            <ProtectedPage>
                                <CoursePlayer />
                            </ProtectedPage>
                        } />
                        <Route path="/my-courses" element={
                            <ProtectedPage>
                                <div className="py-20 text-center glass rounded-3xl">
                                    <h2 className="text-3xl font-black mb-2">Mis Aprendizajes</h2>
                                    <p className="text-gray-500">Aquí verás los cursos en los que estás inscrito.</p>
                                </div>
                            </ProtectedPage>
                        } />
                        <Route path="/studio" element={
                            <ProtectedPage>
                                <Studio />
                            </ProtectedPage>
                        } />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </QueryClientProvider>
    );
};

export default App;
