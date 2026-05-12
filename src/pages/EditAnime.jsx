import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';

import { 
  getStatusColor,
  daysOfWeek,
  handleChange,
  handleDayChange,
  handleStatusChange,
  handleEditSubmit
} from '../utils/helpers';

const EditAnime = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    status: 'Watching',
    episode: 0,
    isWatched: false,
    rating: 0,
    platform: '',
    releaseDays: [],
    note: '',
    resumeDate: '',
    color: '#ef4444'
  });
  const [customDates, setCustomDates] = useState('');

  // ดึงข้อมูลเดิมมาใส่ในฟอร์ม
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await API.get(`/animes/${id}`);
        const data = res.data.data;
        const formattedDate = data.resumeDate ? data.resumeDate.split('T')[0] : '';
        const safeReleaseDays = data.releaseDays || [];
        
        setFormData({ 
          ...data, 
          resumeDate: formattedDate, 
          releaseDays: safeReleaseDays 
        });

        // แยกระหว่างวันมาตรฐาน กับวันที่ระบุเอง
        const otherDays = safeReleaseDays.filter(d => !daysOfWeek.includes(d));
        if (otherDays.length > 0) setCustomDates(otherDays.join(', '));
        
      } catch (err) {
        toast.error('ไม่สามารถดึงข้อมูลได้');
        navigate('/animes');
      }
    };
    fetchAnime();
    // eslint-disable-next-line
  }, [id, navigate]);

  const onSubmit = (e) => {
    handleEditSubmit({
      e,
      type: 'animes',
      id,
      formData,
      customDates,
      navigate,
      API,
      toast
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-md border-t-4 border-purple-500 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: formData.color }}></span>
        แก้ไขอนิเมะ: {formData.title}
      </h2>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">ชื่อเรื่อง (Title) *</label>
          <input type="text" name="title" required value={formData.title} onChange={(e) => handleChange(e, formData, setFormData)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">สถานะ (Status) *</label>
            <select name="status" value={formData.status} onChange={(e) => handleStatusChange(e.target.value, formData, setFormData)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              style={{ borderLeft: `4px solid ${formData.color}` }}>
              <option value="Watching">กำลังดู (Watching)</option>
              <option value="Completed">จบบริบูรณ์ (Completed)</option>
              <option value="Want to Watch">อยากดู (Want to Watch)</option>
              <option value="Stalled">ดองไว้ (Stalled)</option>
              <option value="Dropped">เทแล้ว (Dropped)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">แพลตฟอร์ม (Platform)</label>
            <input type="text" name="platform" value={formData.platform} onChange={(e) => handleChange(e, formData, setFormData)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>

        <div className="flex items-center mt-2">
          <input type="checkbox" id="isWatched" checked={formData.isWatched} onChange={(e) => {
              const checked = e.target.checked;
              setFormData({ 
                ...formData, 
                isWatched: checked, 
                color: getStatusColor(formData.status, checked) 
              });
            }}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer" />
          <label htmlFor="isWatched" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
            ดูทันตอนล่าสุดแล้ว (Green Mode)
          </label>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">วันที่ตอนใหม่มา (Release Days)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {daysOfWeek.map(day => (
              <button key={day} type="button" onClick={() => handleDayChange(day, formData, setFormData)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  formData.releaseDays.includes(day) ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-gray-600 text-xs font-semibold mb-1">หรือระบุเป็นวันที่ (คั่นด้วยลูกน้ำ)</label>
            <input type="text" value={customDates} onChange={(e) => setCustomDates(e.target.value)} placeholder="เช่น 1, 10, 20"
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>

        {formData.status === 'Stalled' && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              วันที่คาดว่าจะกลับมาดู (Resume Date)
            </label>
            <input 
              type="date" 
              name="resumeDate" 
              value={formData.resumeDate} 
              onChange={(e) => handleChange(e, formData, setFormData)} 
              className="w-full px-3 py-2 border rounded" 
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">ตอนที่ (Ep.)</label>
            <div className="flex items-stretch border rounded focus-within:ring-2 focus-within:ring-purple-500 overflow-hidden bg-white">
              <input type="number" name="episode" value={formData.episode} onChange={(e) => handleChange(e, formData, setFormData)} min="0" 
                className="w-full px-3 py-2 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <div className="flex border-l">
                <button type="button" onClick={() => setFormData({
                  ...formData, 
                  episode: Math.max(0, Number(formData.episode) - 1)
                })}
                  className="px-3 bg-gray-50 hover:bg-gray-200 border-r border-gray-200 text-gray-700 font-bold transition">-</button>
                <button type="button" onClick={() => setFormData({
                  ...formData, 
                  episode: Number(formData.episode) + 1
                })}
                  className="px-3 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold transition">+</button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">คะแนน (Rating) (0-10)</label>
            <div className="flex items-stretch border rounded focus-within:ring-2 focus-within:ring-purple-500 overflow-hidden bg-white">
              <input type="number" name="rating" value={formData.rating} onChange={(e) => handleChange(e, formData, setFormData)} min="0" max="10" 
                className="w-full px-3 py-2 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <div className="flex border-l">
                <button type="button" onClick={() => setFormData({
                  ...formData, 
                  rating: Math.max(0, Number(formData.rating) - 1)
                })}
                  className="px-3 bg-gray-50 hover:bg-gray-200 border-r border-gray-200 text-gray-700 font-bold transition">-</button>
                <button type="button" onClick={() => setFormData({
                  ...formData, 
                  rating: Math.min(10, Number(formData.rating) + 1)
                })}
                  className="px-3 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold transition">+</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">บันทึกเพิ่มเติม (Note)</label>
          <textarea name="note" value={formData.note} onChange={(e) => handleChange(e, formData, setFormData)} rows="2" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button type="submit" className="flex-1 bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-600">บันทึกการแก้ไข</button>
          <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400">ยกเลิก</button>
        </div>
      </form>
    </div>
  );
};

export default EditAnime;