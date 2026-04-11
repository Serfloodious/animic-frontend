import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute() {
  const { user } = useAuth();

  // ถ้ายังไม่ล็อกอิน ให้เด้งกลับไปหน้า Login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // ถ้าล็อกอินแล้ว ให้แสดงเนื้อหาข้างใน (Outlet) ได้ตามปกติ
  return <Outlet />;
}