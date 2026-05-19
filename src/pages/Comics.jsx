import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import API from '../api/axios'; 

import { dayOptions } from '../utils/constants';
import { formatDate, getDayColor } from '../utils/formatters';
import { 
  handleAddSort, 
  handleUpdateSort, 
  handleRemoveSort, 
  handleFilterChange 
} from '../utils/sortHandlers';

const Comics = () => {
  const [comics, setComics] = useState([]);
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
    { value: 'dayOrder', label: 'วันที่ตอนใหม่มา (Release Days)' },
    { value: 'title', label: 'ชื่อเรื่อง (Title)' },
    { value: 'status', label: 'สถานะ (Status)' },
    { value: 'platform', label: 'แพลตฟอร์ม (Platform)' },
    { value: 'volume', label: 'เล่มที่/ซีซันที่ (Volume/Season)' },
    { value: 'chapter', label: 'ตอนที่ (Chapter)' },
    { value: 'rating', label: 'คะแนน (Rating)' },
    { value: 'resumeDate', label: 'วันที่คาดว่าจะกลับมาอ่าน (Resume Date)' },
    { value: 'createdAt', label: 'วันที่เพิ่ม (Created Date)' }
  ];

  // Fetch เมื่อ States เปลี่ยนแปลง
  useEffect(() => {
    fetchComics();
    // eslint-disable-next-line
  }, [filterStatus, filterDay, sortRules, page]);

  const fetchComics = async () => {
    try {
      setLoading(true);
      
      // แปลง Array sortRules ให้เป็น String เช่น "releaseDays,-rating"
      const sortString = sortRules
        .map(rule => (rule.direction === 'desc' ? `-${rule.field}` : rule.field))
        .join(',');

      const params = new URLSearchParams({
        page: page,
        limit: 12,
        sort: sortString
      });

      if (filterStatus) params.append('status', filterStatus);
      if (filterDay) params.append('releaseDays', filterDay); // Backend จะค้นหาคำตรงตัว

      const res = await API.get(`/comics?${params.toString()}`);
      
      setComics(res.data.data);
      setPagination(res.data.pagination || {});
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'ไม่สามารถดึงข้อมูลคอมมิกได้');
    } finally {
      setLoading(false);
    }
  };

  if (loading && comics.length === 0) return <Spinner/>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">คลังคอมมิก (Comics)</h1>
        <Link 
          to="/comics/add" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm shrink-0"
        >
          + เพิ่มคอมมิก
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
              onChange={(e) => handleFilterChange(e, 'status', setFilterStatus, setFilterDay, setPage)}
              className="border rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">ทั้งหมด (All)</option>
              <option value="Reading">กำลังอ่าน (Reading)</option>
              <option value="Completed">จบบริบูรณ์ (Completed)</option>
              <option value="Stalled">ดองไว้ (Stalled)</option>
              <option value="Want to Read">อยากอ่าน (Want to Read)</option>
              <option value="Dropped">เทแล้ว (Dropped)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mr-2">วันที่ตอนใหม่มา:</label>
            <select 
              value={filterDay} 
              onChange={(e) => handleFilterChange(e, 'day', setFilterStatus, setFilterDay, setPage)}
              className="border rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
          การจัดเรียง (Sorting) (เรียงลำดับความสำคัญจากบนลงล่าง)
        </h3>
        <div className="flex flex-col gap-3">
          {sortRules.map((rule, index) => (
            <div key={index} className="flex flex-wrap gap-2 items-center bg-gray-50 p-2 rounded border border-gray-200">
              <span className="text-xs font-bold text-gray-500 w-6 text-center">{index + 1}.</span>
              <select 
                value={rule.field}
                onChange={(e) => handleUpdateSort(index, 'field', e.target.value, sortRules, setSortRules, setPage)}
                className="border rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <select 
                value={rule.direction}
                onChange={(e) => handleUpdateSort(index, 'direction', e.target.value, sortRules, setSortRules, setPage)}
                className="border rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
              >
                <option value="asc">น้อยไปมาก / เก่าไปใหม่ / A-Z / จันทร์-อาทิตย์-อื่น ๆ</option>
                <option value="desc">มากไปน้อย / ใหม่ไปเก่า / Z-A / อื่น ๆ-อาทิตย์-จันทร์</option>
              </select>

              {sortRules.length > 1 && (
                <button 
                  onClick={() => handleRemoveSort(index, sortRules, setSortRules, setPage)}
                  className="text-red-500 hover:text-red-700 text-sm font-bold px-2"
                  title="ลบเงื่อนไขนี้"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          <button 
            onClick={() => handleAddSort(sortRules, setSortRules)}
            className="text-sm text-blue-600 font-medium hover:text-blue-800 self-start mt-1 flex items-center"
          >
            + เพิ่มเงื่อนไขการเรียง
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="text-center mb-6 text-red-500 bg-red-50 p-3 rounded">{error}</div>}

      {/* Grid สำหรับแสดงการ์ด (โครงสร้างเดิม) */}
      {comics.length === 0 && !loading ? (
        <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
          ไม่พบข้อมูลคอมมิกตามเงื่อนไขที่เลือก
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {comics.map((comic) => (
              <Link to={`/comics/${comic._id}`} key={comic._id} className="block group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden relative border border-gray-100 h-full flex flex-col">
                  <div className="h-2 w-full" style={{ backgroundColor: comic.color || '#ef4444' }}></div>
                  
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {comic.title}
                      </h3>
                      <StatusBadge status={comic.status} isUpToDate={comic.isRead} />
                    </div>
                    
                    <div className="text-xs text-gray-500 font-bold mb-4 flex-grow flex flex-wrap items-center gap-2">
                      <span>{comic.platform || 'ไม่ระบุแพลตฟอร์ม'}</span>
                      
                      {comic.releaseDays?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {comic.releaseDays.map((day, i) => (
                            <span 
                              key={i} 
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium shadow-sm ${getDayColor(day)}`}
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-end text-sm mt-auto">
                      <div className="flex flex-col gap-1">
                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">
                          Vol./SS {comic.volume} | Ch. {comic.chapter}
                        </span>
                        {comic.rating > 0 && (
                          <span className="text-amber-500 font-bold text-xs mt-1">
                            ⭐ {comic.rating} / 10
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        {comic.status === 'Stalled' && (
                          <span className="text-xs font-bold">{formatDate(comic.resumeDate)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {(pagination.next || pagination.prev) && (
            <div className="flex justify-center items-center mt-10 gap-4">
              <button 
                onClick={() => setPage(page - 1)}
                disabled={!pagination.prev}
                className={`px-4 py-2 rounded font-medium ${pagination.prev ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                &laquo; ก่อนหน้า
              </button>
              <span className="text-gray-600 font-medium">หน้าที่ {page}</span>
              <button 
                onClick={() => setPage(page + 1)}
                disabled={!pagination.next}
                className={`px-4 py-2 rounded font-medium ${pagination.next ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                ถัดไป &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comics;