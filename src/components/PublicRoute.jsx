import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PublicRoute() {
  const { user } = useAuth();

  // ถ้าล็อกอินอยู่แล้ว แต่พยายามเข้าหน้า Login ให้เด้งไป Dashboard แทน
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}