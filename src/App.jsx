import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้าเว็บสาธารณะ (คนล็อกอินแล้วไม่ควรเห็นหน้านี้) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Route>

        {/* หน้าเว็บส่วนตัว (ต้องล็อกอินก่อนถึงจะเข้าได้) */}
        <Route element={<ProtectedRoute />}>
          {/* เอา Layout มาครอบเฉพาะหน้าหลังบ้าน */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/password" element={<ChangePassword />} />
          </Route>
        </Route>

        {/* กรณีพิมพ์ URL มั่ว (404 Not Found) */}
        <Route path="*" element={<h1 className="p-10 text-2xl text-red-500 text-center">404 - ไม่พบหน้านี้</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;