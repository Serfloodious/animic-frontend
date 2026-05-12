import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

import { handleChange } from '../utils/helpers';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ดึงฟังก์ชัน login มาจาก Context
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      return setError('กรุณากรอกอีเมลและรหัสผ่าน');
    }

    setLoading(true);
    try {
      // ส่งข้อมูลไปที่ Backend
      const res = await API.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // กรณี Backend ตอบกลับมาในรูปแบบ { token: '...', user: {...} } 
      const token = res.data.token;
      const userData = res.data.user

      // เรียกใช้ฟังก์ชัน login ใน Context เพื่อเก็บ Token และ User
      login(userData, token);

      // ล็อกอินสำเร็จให้พาไปหน้า Dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">เข้าสู่ระบบ Animic</h2>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">อีเมล (Email)</label>
            <input type="email" name="email" value={formData.email} onChange={(e) => handleChange(e, formData, setFormData)} 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500" 
              placeholder="example@mail.com" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">รหัสผ่าน</label>
            <input type="password" name="password" value={formData.password} onChange={(e) => handleChange(e, formData, setFormData)} 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500" 
              placeholder="กรอกรหัสผ่านของคุณ" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gray-800 text-white font-bold py-2 px-4 rounded hover:bg-gray-900 transition disabled:opacity-50">
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          ยังไม่มีบัญชี? <Link to="/auth/register" className="text-red-500 hover:underline">สมัครสมาชิกที่นี่</Link>
        </p>
      </div>
    </div>
  );
}