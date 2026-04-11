import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword.length < 6) {
      return setError('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
    }

    setLoading(true);
    try {
      // ยิง API เปลี่ยนรหัสผ่าน
      await API.put('/auth/updatepassword', formData);
      
      alert('เปลี่ยนรหัสผ่านสำเร็จ!');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'รหัสผ่านปัจจุบันไม่ถูกต้อง หรือเกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">เปลี่ยนรหัสผ่าน</h2>
      
      {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">รหัสผ่านปัจจุบัน</label>
          <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} 
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500" required />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">รหัสผ่านใหม่</label>
          <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} 
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500" required 
            placeholder="อย่างน้อย 6 ตัวอักษร" />
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" disabled={loading}
            className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition disabled:opacity-50">
            {loading ? 'กำลังเปลี่ยน...' : 'ยืนยันรหัสผ่านใหม่'}
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