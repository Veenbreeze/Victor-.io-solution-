import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ adminOnly = false, staffOnly = false, permission }) {
  const { isAuthenticated, isAdmin, isStaff, can } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (adminOnly && !isAdmin) return <Navigate to="/admin" replace />;
  if (staffOnly && !isStaff) return <Navigate to="/dashboard" replace />;
  if (permission && !can(permission)) return <Navigate to="/admin" replace />;

  return <Outlet />;
}
