import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/axios';

export default function EditProfile() {
  const { user, checkUser } = useAuth(); // ใช้ checkUser เพื่อดึงข้อมูลใหม่หลังอัปเดตเสร็จ
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ดึงข้อมูลเดิมมาใส่ในฟอร์มตอนเปิดหน้าเว็บ
  useEffect(() => {
    if (user) {
      setFormData({ username: user.username, email: user.email });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ยิง API อัปเดตข้อมูล
      await API.put('/auth/updatedetails', formData);
      
      // อัปเดต Context ใหม่ให้หน้าเว็บจำข้อมูลล่าสุด
      await checkUser(); 
      
      alert('อัปเดตข้อมูลสำเร็จ!');
      navigate('/profile'); // กลับหน้า Profile
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">แก้ไขข้อมูลส่วนตัว</h2>
      
      {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">ชื่อผู้ใช้ (Username)</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} 
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-800" required />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">อีเมล (Email)</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} 
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-800" required />
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" disabled={loading}
            className="flex-1 bg-gray-800 text-white font-bold py-2 px-4 rounded hover:bg-gray-900 transition disabled:opacity-50">
            {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </button>
          <button type="button" onClick={() => navigate('/profile')}
            className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 transition">
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}