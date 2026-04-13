import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const animeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setanime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchanime = async () => {
      try {
        const res = await API.get(`/animes/${id}`);
        setanime(res.data.data);
      } catch (err) {
        alert('ไม่พบข้อมูลอนิเมะเรื่องนี้');
        navigate('/animes');
      } finally {
        setLoading(false);
      }
    };
    fetchanime();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await API.delete(`/animes/${id}`);
      navigate('/animes');
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  if (loading) return <div className="text-center mt-20">กำลังโหลดข้อมูล...</div>;
  if (!anime) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* แถบสีแสดงสถานะ */}
        <div className="h-3 w-full" style={{ backgroundColor: anime.color || '#6366f1' }}></div>
        
        <div className="p-6 sm:p-8">
          {/* ส่วนหัว */}
          <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-100 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
              {anime.title}
            </h1>
            <button 
              onClick={() => navigate('/animes')} 
              className="shrink-0 px-4 py-2 bg-gray-50 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ฝั่งซ้าย: ข้อมูลหลัก */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">สถานะการดู</label>
                <div className="text-lg font-semibold" style={{ color: anime.color }}>
                  {anime.status} {anime.isWatched && ' (ดูทันตอนล่าสุดแล้ว)'}
                </div>
              </div>

              <div className="flex gap-10">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">ตอนที่</label>
                  <div className="text-xl font-medium">{anime.episode}</div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">แพลตฟอร์ม</label>
                <div className="text-gray-700">{anime.platform || '-'}</div>
              </div>
            </div>

            {/* ฝั่งขวา: วันที่และคะแนน */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">วันที่ฉาย</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {anime.releaseDays?.length > 0 ? (
                    anime.releaseDays.map((day, i) => (
                      <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600 font-medium">
                        {day}
                      </span>
                    ))
                  ) : '-'}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">คะแนนความชอบ</label>
                <div className="text-xl text-amber-500 font-bold">
                  {anime.rating > 0 ? `⭐ ${anime.rating} / 10` : 'ยังไม่มีคะแนน'}
                </div>
              </div>

              {anime.status === 'Stalled' && anime.resumeDate && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">วันที่ตั้งใจจะกลับมาดู</label>
                  <div className="text-blue-600 font-medium">
                    {new Date(anime.resumeDate).toLocaleDateString('th-TH')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* หมายเหตุ */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">บันทึกเพิ่มเติม</label>
            <div className="bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap min-h-[100px]">
              {anime.note || 'ไม่มีบันทึก'}
            </div>
          </div>

          {/* ปุ่มจัดการข้อมูล */}
          <div className="mt-10 flex flex-wrap gap-4 justify-end border-t pt-6">
            <Link 
              to={`/animes/edit/${anime._id}`}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
            >
              แก้ไขข้อมูล
            </Link>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition"
            >
              ลบ
            </button>
          </div>
        </div>
      </div>

      {/* --- Modal ยืนยันการลบ --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">ยืนยันการลบ?</h3>
            <p className="text-gray-500 mb-6">คุณแน่ใจหรือไม่ที่จะลบเรื่องนี <span className="font-bold text-gray-700">"{anime.title}"</span>? การกระทำนี้ไม่สามารถย้อนคืนได้</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg font-medium text-gray-600 hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default animeDetail;