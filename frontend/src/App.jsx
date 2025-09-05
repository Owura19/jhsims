// src/App.jsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import DashboardLayout from './components/DashboardLayout';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Check auth on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Invalid user data in localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/login"
        element={<Login setUser={setUser} />}
      />

      {/* Protected Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <DashboardLayout user={user}>
              <Dashboard />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />

      {/* Protected Students Route */}
      <Route
        path="/students"
        element={
          user ? (
            <DashboardLayout user={user}>
              <StudentList />
            </DashboardLayout>
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />

      {/* Catch-all: Redirect to login */}
      <Route
        path="*"
        element={
          <Navigate to="/login" state={{ from: location }} replace />
        }
      />
    </Routes>
  );
}

export default App;