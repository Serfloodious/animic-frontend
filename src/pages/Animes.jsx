import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios'; 

const Animes = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- States สำหรับ Filters ---
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // --- States สำหรับ Multi-Sort ---
  // เริ่มต้นด้วย dayOrder (การเรียงวัน จันทร์-อาทิตย์-อื่น ๆ)
  const [sortRules, setSortRules] = useState([{ field: 'dayOrder', direction: 'asc' }]);

  const sortOptions = [
    { value: 'dayOrder', label: 'วันอัปเดต (จันทร์-อาทิตย์-อื่น ๆ)' },
    { value: 'title', label: 'ชื่อเรื่อง (Title)' },
    { value: 'status', label: 'สถานะ (Status)' },
    { value: 'platform', label: 'แพลตฟอร์ม (Platform)' },
    { value: 'episode', label: 'ตอนที่ (Episode)' },
    { value: 'rating', label: 'คะแนน (Rating)' },
    { value: 'resumeDate', label: 'วันที่กลับมาดู (Resume Date)' },
    { value: 'createdAt', label: 'วันที่เพิ่ม (Created Date)' }
  ];

  const dayOptions = [
    { value: 'Monday', label: 'วันจันทร์' },
    { value: 'Tuesday', label: 'วันอังคาร' },
    { value: 'Wednesday', label: 'วันพุธ' },
    { value: 'Thursday', label: 'วันพฤหัสบดี' },
    { value: 'Friday', label: 'วันศุกร์' },
    { value: 'Saturday', label: 'วันเสาร์' },
    { value: 'Sunday', label: 'วันอาทิตย์' },
    { value: 'Others', label: 'อื่น ๆ' }
  ];

  useEffect(() => {
    fetchAnimes();
    // eslint-disable-next-line
  }, [filterStatus, filterDay, sortRules, page]);

  const fetchAnimes = async () => {
    try {
      setLoading(true);
      const sortString = sortRules
        .map(rule => (rule.direction === 'desc' ? `-${rule.field}` : rule.field))
        .join(',');

      const params = new URLSearchParams({
        page: page,
        limit: 12,
        sort: sortString
      });

      if (filterStatus) params.append('status', filterStatus);
      if (filterDay) params.append('releaseDays', filterDay);

      const res = await API.get(`/animes?${params.toString()}`);
      
      setAnimes(res.data.data);
      setPagination(res.data.pagination || {});
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'ไม่สามารถดึงข้อมูลอนิเมะได้');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSort = () => {
    setSortRules([...sortRules, { field: 'createdAt', direction: 'desc' }]);
  };

  const handleUpdateSort = (index, key, value) => {
    const newRules = [...sortRules];
    newRules[index][key] = value;
    setSortRules(newRules);
    setPage(1);
  };

  const handleRemoveSort = (index) => {
    const newRules = sortRules.filter((_, i) => i !== index);
    if (newRules.length === 0) {
      setSortRules([{ field: 'dayOrder', direction: 'asc' }]);
    } else {
      setSortRules(newRules);
    }
    setPage(1);
  };

  if (loading && animes.length === 0) return <div className="text-center mt-10 text-gray-600">กำลังโหลดข้อมูลอนิเมะ...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">คลังอนิเมะ (Animes)</h1>
        <Link 
          to="/animes/add" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
        >
          + เพิ่มอนิเมะ
        </Link>
      </div>

      {/* --- ส่วนเครื่องมือกรอง (Filters) --- */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-6 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">ตัวกรอง (Filters)</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 mr-2">สถานะ:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              className="border rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">ทั้งหมด (All)</option>
              <option value="Watching">กำลังดู</option>
              <option value="Completed">ดูจบแล้ว</option>
              <option value="Stalled">ดอง</option>
              <option value="Want to Watch">อยากดู</option>
              <option value="Dropped">เท</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mr-2">วันอัปเดต:</label>
            <select 
              value={filterDay} 
              onChange={(e) => { setFilterDay(e.target.value); setPage(1); }}
              className="border rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">ทุกวัน (All)</option>
              {dayOptions.map(day => (
                <option key={day.value} value={day.value}>{day.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* --- ส่วนการจัดเรียงหลายชั้น (Multi-Sort) --- */}
        <h3 className="text-sm font-bold text-gray-700 mt-6 mb-3 border-b pb-2">
          การจัดเรียง (เรียงลำดับความสำคัญจากบนลงล่าง)
        </h3>
        <div className="flex flex-col gap-3">
          {sortRules.map((rule, index) => (
            <div key={index} className="flex flex-wrap gap-2 items-center bg-gray-50 p-2 rounded border border-gray-200">
              <span className="text-xs font-bold text-gray-500 w-6 text-center">{index + 1}.</span>
              <select 
                value={rule.field}
                onChange={(e) => handleUpdateSort(index, 'field', e.target.value)}
                className="border rounded px-2 py-1 text-sm outline-none focus:border-indigo-500"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <select 
                value={rule.direction}
                onChange={(e) => handleUpdateSort(index, 'direction', e.target.value)}
                className="border rounded px-2 py-1 text-sm outline-none focus:border-indigo-500"
              >
                <option value="asc">น้อยไปมาก / เก่าไปใหม่ / A-Z</option>
                <option value="desc">มากไปน้อย / ใหม่ไปเก่า / Z-A</option>
              </select>

              {sortRules.length > 1 && (
                <button 
                  onClick={() => handleRemoveSort(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-bold px-2"
                  title="ลบเงื่อนไขนี้"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          <button 
            onClick={handleAddSort}
            className="text-sm text-indigo-600 font-medium hover:text-indigo-800 self-start mt-1 flex items-center"
          >
            + เพิ่มเงื่อนไขการเรียง
          </button>
        </div>
      </div>

      {/* --- Anime Grid --- */}
      {animes.length === 0 && !loading ? (
        <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
          ไม่พบข้อมูลอนิเมะตามเงื่อนไขที่เลือก
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {animes.map((anime) => (
            <Link to={`/animes/${anime._id}`} key={anime._id} className="group transition-transform hover:-translate-y-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                <div className="h-2 w-full" style={{ backgroundColor: anime.color || '#6366f1' }}></div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-gray-800 mb-1 group-hover:text-indigo-600 line-clamp-2">{anime.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">{anime.platform || 'ไม่ระบุแหล่งที่ดู'}</p>
                  
                  <div className="mt-auto flex justify-between items-end">
                    <div>
                        <div className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded">EP: {anime.episode}</div>
                        {anime.rating > 0 && <div className="text-amber-500 text-xs font-bold mt-1">⭐ {anime.rating}</div>}
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">{anime.releaseDays?.join(', ')}</div>
                        <div className="text-xs font-bold" style={{ color: anime.color || '#6366f1' }}>
                            {anime.isWatched && anime.status === 'Watching' ? 'ดูถึงตอนล่าสุดแล้ว' : anime.status}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination (ใช้ logic เดียวกับ Comics) */}
    </div>
  );
};

export default Animes;