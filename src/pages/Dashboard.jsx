import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/Spinner';
import API from '../api/axios';

// คอมโพเนนต์ย่อยสำหรับการ์ดสถานะ (เพื่อความสะอาดของโค้ด)
const StatusCard = ({ label, count, colorClass, icon, unit = "เรื่อง" }) => (
  <div className={`bg-white border-l-4 ${colorClass} rounded-xl p-4 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow`}>
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1">
        {count} <span className="text-sm font-normal text-gray-400">{unit}</span>
      </h3>
    </div>
    <div className={`p-3 rounded-full bg-gray-50 text-xl`}>
      {icon}
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    comics: 0,
    animes: 0,
    comicStats: {},
    animeStats: {}
  });
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

        // ฟังก์ชันช่วยนับจำนวนตามสถานะ
        const countStatus = (items) => {
          return items.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          }, {});
        };

        // นำข้อมูลจำนวนที่ได้มาอัปเดตใส่ State
        setStats({
          comics: comicRes.data.count || 0,
          animes: animeRes.data.count || 0,
          comicStats: countStatus(comicRes.data.data || []),
          animeStats: countStatus(animeRes.data.data || [])
        });
      } catch (error) {
        console.error('ไม่สามารถดึงข้อมูลสถิติได้:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* ส่วนหัวต้อนรับ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">สวัสดี, {user?.username}!</h1>
          <p className="text-gray-500 mt-1">นี่คือสรุปรายการอนิเมะและคอมมิกของคุณทั้งหมด</p>
        </div>
      </div>

      {/* แถวบน: การ์ดรวมทั้งหมด */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/animes" className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-indigo-100 text-sm font-semibold uppercase tracking-wider">อนิเมะทั้งหมด</p>
              <h2 className="text-5xl font-bold mt-2">{stats.animes}</h2>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl text-4xl">📺</div>
          </div>
        </Link>

        <Link to="/comics" className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">คอมมิกทั้งหมด</p>
              <h2 className="text-5xl font-bold mt-2">{stats.comics}</h2>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl text-4xl">📖</div>
          </div>
        </Link>
      </div>

      {/* แถวล่าง: แบ่งซ้าย (Anime) ขวา (Comic) แยกตามสถานะ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* ฝั่งซ้าย: Anime Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2 border-b pb-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
            สถานะการดูอนิเมะ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatusCard label="กำลังดู" count={stats.animeStats['Watching'] || 0} colorClass="border-green-500" icon="📺" />
            <StatusCard label="ดองไว้" count={stats.animeStats['Stalled'] || 0} colorClass="border-yellow-500" icon="⏳" />
            <StatusCard label="อยากดู" count={stats.animeStats['Want to Watch'] || 0} colorClass="border-blue-500" icon="💖" />
            <StatusCard label="จบบริบูรณ์" count={stats.animeStats['Completed'] || 0} colorClass="border-purple-500" icon="✅" />
            <StatusCard label="เทแล้ว" count={stats.animeStats['Dropped'] || 0} colorClass="border-gray-400" icon="🗑️" />
          </div>
        </div>

        {/* ฝั่งขวา: Comic Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2 border-b pb-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            สถานะการอ่านคอมมิก
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatusCard label="กำลังอ่าน" count={stats.comicStats['Reading'] || 0} colorClass="border-green-500" icon="📖" />
            <StatusCard label="ดองไว้" count={stats.comicStats['Stalled'] || 0} colorClass="border-yellow-500" icon="⏳" />
            <StatusCard label="อยากอ่าน" count={stats.comicStats['Want to Read'] || 0} colorClass="border-blue-500" icon="💖" />
            <StatusCard label="จบบริบูรณ์" count={stats.comicStats['Completed'] || 0} colorClass="border-purple-500" icon="✅" />
            <StatusCard label="เทแล้ว" count={stats.comicStats['Dropped'] || 0} colorClass="border-gray-400" icon="🗑️" />
          </div>
        </div>

      </div>
    </div>
  );
}