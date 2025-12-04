import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Placeholder components for now
const Home = () => <div className="p-8"><h1>Welcome to Healthcare Voice Agent</h1><p className="mt-4">Please login to continue.</p></div>;
const Login = () => <div className="p-8"><h1>Login Page</h1></div>;
const NotFound = () => <div className="p-8"><h1>404 - Page Not Found</h1></div>;

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-neutral-light text-neutral-dark font-sans">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default App;
