// src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        // No token? Send to login
        return <Navigate to="/login" />;
    }

    return children;
}