import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';

function App() {
    const isAuthenticated = () => {
        return !!localStorage.getItem('token');
    };

    const isAdmin = () => {
        return localStorage.getItem('isAdmin') === 'true';
    };

    const ProtectedRoute = ({ children }) => {
        if (!isAuthenticated()) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    const AdminRoute = ({ children }) => {
        if (!isAuthenticated()) {
            return <Navigate to="/login" replace />;
        }
        if (!isAdmin()) {
            return <Navigate to="/dashboard" replace />;
        }
        return children;
    };

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminPanel />
                    </AdminRoute>
                }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default App;
