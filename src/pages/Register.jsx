import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

import { handleChange } from '../utils/formHandlers';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันกดยืนยันฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation เบื้องต้น
    if (!formData.username || !formData.email || !formData.password) {
      return setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
    }
    if (formData.password.length < 6) {
      return setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
    }

    setLoading(true);
    try {
      // ส่งข้อมูลไปที่ Backend
      await API.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      // สมัครเสร็จให้พาไปหน้า Login ทันที
      navigate('/auth/login');
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">สมัครสมาชิก Animic</h2>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">ชื่อผู้ใช้ (Username)</label>
            <input type="text" name="username" value={formData.username} onChange={(e) => handleChange(e, formData, setFormData)} 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500" 
              placeholder="ตั้งชื่อผู้ใช้งาน" />
          </div>
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
              placeholder="อย่างน้อย 6 ตัวอักษร" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">ยืนยันรหัสผ่าน</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={(e) => handleChange(e, formData, setFormData)} 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500" 
              placeholder="กรอกรหัสผ่านอีกครั้ง" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition disabled:opacity-50">
            {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          มีบัญชีอยู่แล้ว? <Link to="/auth/login" className="text-red-500 hover:underline">เข้าสู่ระบบที่นี่</Link>
        </p>
      </div>
    </div>
  );
}