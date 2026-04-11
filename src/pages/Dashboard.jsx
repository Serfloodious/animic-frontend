import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ comics: 0, animes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลสถิติ
    const fetchStats = async () => {
      try {
        // ใช้ Promise.all เพื่อยิง API 2 เส้นพร้อมกัน (ทำให้โหลดเร็วขึ้น)
        const [comicRes, animeRes] = await Promise.all([
          API.get('/comics'),
          API.get('/animes')
        ]);

        // นำข้อมูลจำนวนที่ได้มาอัปเดตใส่ State
        setStats({
          comics: comicRes.data.count || 0,
          animes: animeRes.data.count || 0
        });
      } catch (error) {
        console.error('ไม่สามารถดึงข้อมูลสถิติได้:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ส่วนหัวต้อนรับ */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            ภาพรวมลิสต์อนิเมะและคอมมิกของคุณ
          </h1>
        </div>
      </div>

      {/* ส่วนแสดงการ์ดสถิติ */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 animate-pulse">กำลังโหลดข้อมูลสถิติ...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* การ์ด Animes */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-md flex justify-between items-center">
            <div>
              <p className="text-purple-100 text-sm font-semibold uppercase tracking-wider">อนิเมะในลิสต์</p>
              <h2 className="text-4xl font-bold mt-2">{stats.animes} <span className="text-lg font-normal">เรื่อง</span></h2>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* การ์ด Comics */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-md flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">คอมมิกในลิสต์</p>
              <h2 className="text-4xl font-bold mt-2">{stats.comics} <span className="text-lg font-normal">เรื่อง</span></h2>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ปุ่มทางลัด */}
      <div className="flex gap-4 mt-8">
        <Link to="/animes" className="px-6 py-3 bg-white text-purple-600 font-semibold rounded shadow-sm border border-purple-200 hover:bg-purple-50 transition">
          จัดการอนิเมะ
        </Link>
        <Link to="/comics" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded shadow-sm border border-blue-200 hover:bg-blue-50 transition">
          จัดการคอมมิก
        </Link>
      </div>
    </div>
  );
}