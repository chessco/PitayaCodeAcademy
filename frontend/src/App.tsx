import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { MainLayout } from './components/MainLayout';
import './styles/globals.css';

// Real Pages
import Catalog from './pages/Catalog';
import CourseDetail from './pages/CourseDetail';
import CoursePlayer from './pages/CoursePlayer';
import Studio from './pages/Studio';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseStudents from './pages/CourseStudents';
import StudioForums from './pages/StudioForums';
import CourseResources from './pages/CourseResources';
import InstructorFinances from './pages/InstructorFinances';
import InstructorReports from './pages/InstructorReports';
import Login from './pages/Login';
import MyCourses from './pages/MyCourses';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import CourseEditor from './pages/CourseEditor';
import Coupons from './pages/Coupons';
import Settings from './pages/Settings';
import Users from './pages/Users';
import InstructorAnalytics from './pages/InstructorAnalytics';
import Messages from './pages/Messages';
import StudentDashboard from './pages/StudentDashboard';
import CourseReview from './pages/CourseReview';
import CourseForum from './pages/CourseForum';
import TopicDetail from './pages/TopicDetail';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Community from './pages/Community';

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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchOnReconnect: true,
            staleTime: 0,
        },
    },
});

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AuthProvider>
                    <CartProvider>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/" element={<MainLayout><Catalog /></MainLayout>} />
                            <Route path="/courses/:id" element={<MainLayout><CourseDetail /></MainLayout>} />

                            {/* Protected Routes */}
                            <Route path="/courses/:id/player" element={
                                <ProtectedPage>
                                    <CoursePlayer />
                                </ProtectedPage>
                            } />
                            <Route path="/dashboard" element={
                                <ProtectedPage>
                                    <StudentDashboard />
                                </ProtectedPage>
                            } />
                            <Route path="/my-courses/:courseId/review" element={
                                <ProtectedPage>
                                    <CourseReview />
                                </ProtectedPage>
                            } />
                            <Route path="/community" element={
                                <ProtectedPage>
                                    <Community />
                                </ProtectedPage>
                            } />
                            <Route path="/courses/:id/forum" element={
                                <ProtectedPage>
                                    <CourseForum />
                                </ProtectedPage>
                            } />
                            <Route path="/courses/forum" element={<Navigate to="/community" replace />} />
                            <Route path="/courses/:id/forum/:topicId" element={
                                <ProtectedPage>
                                    <TopicDetail />
                                </ProtectedPage>
                            } />
                            <Route path="/my-courses" element={
                                <ProtectedPage>
                                    <MyCourses />
                                </ProtectedPage>
                            } />
                            <Route path="/studio" element={
                                <ProtectedPage>
                                    <InstructorDashboard />
                                </ProtectedPage>
                            } />
                            <Route path="/studio/courses" element={
                                <ProtectedPage>
                                    <Studio />
                                </ProtectedPage>
                            } />
                            <Route path="/studio/courses/:id/students" element={
                                <ProtectedPage>
                                    <CourseStudents />
                                </ProtectedPage>
                            } />
                            <Route path="/studio/courses/:id/resources" element={
                                <ProtectedPage>
                                    <CourseResources />
                                </ProtectedPage>
                            } />
                            <Route path="/studio/courses/:id" element={
                                <ProtectedPage>
                                    <CourseEditor />
                                </ProtectedPage>
                            } />
                            <Route path="/studio/coupons" element={
                                <ProtectedPage>
                                    <Coupons />
                                </ProtectedPage>
                            } />
                            <Route path="/studio/settings" element={
                                <ProtectedPage>
                                    <Settings />
                                </ProtectedPage>
                            } />
                            <Route path="/studio/forums" element={
                                <ProtectedPage>
                                    <StudioForums />
                                </ProtectedPage>
                            } />
                            <Route path="/studio/users" element={
                                <ProtectedPage>
                                    <Users />
                                </ProtectedPage>
                            } />
                            <Route path="/studio/analytics" element={
                                <ProtectedPage>
                                    <InstructorAnalytics />
                                </ProtectedPage>
                            } />
                            <Route path="/studio/finances" element={
                                <ProtectedPage>
                                    <InstructorFinances />
                                </ProtectedPage>
                            } />
                            <Route path="/studio/reports" element={
                                <ProtectedPage>
                                    <InstructorReports />
                                </ProtectedPage>
                            } />
                            <Route path="/studio/messages" element={
                                <ProtectedPage>
                                    <Messages />
                                </ProtectedPage>
                            } />
                            <Route path="/notifications" element={
                                <ProtectedPage>
                                    <Notifications />
                                </ProtectedPage>
                            } />
                            <Route path="/profile" element={
                                <ProtectedPage>
                                    <Profile />
                                </ProtectedPage>
                            } />

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </CartProvider>
                </AuthProvider>
            </Router>
        </QueryClientProvider>
    );
};

export default App;
