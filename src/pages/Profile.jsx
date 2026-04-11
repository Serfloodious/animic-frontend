import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/axios';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const isConfirm = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี? ข้อมูลคอมมิกและอนิเมะทั้งหมดจะถูกลบและไม่สามารถกู้คืนได้');
    
    if (isConfirm) {
      try {
        await API.delete('/auth/deleteaccount');
        logout(); // เคลียร์ข้อมูลล็อกอิน
        navigate('/'); // กลับหน้าแรก
      } catch (error) {
        alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการลบบัญชี');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">โปรไฟล์ส่วนตัว</h2>
      
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-gray-500 text-sm font-semibold">ชื่อผู้ใช้ (Username)</label>
          <p className="text-lg text-gray-900">{user?.username}</p>
        </div>
        <div>
          <label className="block text-gray-500 text-sm font-semibold">อีเมล (Email)</label>
          <p className="text-lg text-gray-900">{user?.email}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 border-t pt-6">
        <Link 
          to="/profile/edit" 
          className="flex-1 text-center bg-gray-800 text-white font-semibold py-2 px-4 rounded hover:bg-gray-900 transition"
        >
          แก้ไขข้อมูลส่วนตัว
        </Link>
        <Link 
          to="/profile/password" 
          className="flex-1 text-center bg-gray-600 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition"
        >
          เปลี่ยนรหัสผ่าน
        </Link>
        <button 
          onClick={handleDeleteAccount}
          className="flex-1 bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition"
        >
          ลบบัญชี
        </button>
      </div>
    </div>
  );
}