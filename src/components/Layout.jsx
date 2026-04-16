import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login'); // ออกจากระบบแล้วให้ไปหน้า Login
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar (เมนูด้านซ้าย) */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700 text-center text-red-500">
          Animic
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-800 transition">Dashboard</Link>
          <Link to="/animes" className="block px-4 py-2 rounded hover:bg-gray-800 transition">Animes</Link>
          <Link to="/comics" className="block px-4 py-2 rounded hover:bg-gray-800 transition">Comics</Link>
          <Link to="/profile" className="block px-4 py-2 rounded hover:bg-gray-800 transition">Profile</Link>
        </nav>
      </aside>

      {/* Main Content (พื้นที่เนื้อหาด้านขวา) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar ด้านบน */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">ยินดีต้อนรับ, {user?.username || 'User'}</h2>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            ออกจากระบบ
          </button>
        </header>

        {/* พื้นที่แสดงผลเนื้อหาของแต่ละหน้า (เปลี่ยนไปตาม URL) */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}