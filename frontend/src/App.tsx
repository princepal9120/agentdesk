import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './components/layout/AuthLayout/AuthLayout';
import { MainLayout } from './components/layout/MainLayout/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import BookAppointment from './pages/BookAppointment';

// Placeholder components
const Home = () => <Navigate to="/login" replace />;
const Dashboard = () => <div className="container mx-auto p-8"><h1>Dashboard</h1><p>Welcome to your patient dashboard.</p></div>;
const NotFound = () => <div className="p-8"><h1>404 - Page Not Found</h1></div>;

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Routes>
                <Route path="/" element={<Home />} />

                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/appointments/book" element={<BookAppointment />} />
                    {/* Add more protected routes here */}
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default App;
