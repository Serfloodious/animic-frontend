import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';

import { daysOfWeek } from '../utils/constants';
import { getStatusColor } from '../utils/formatters';
import { handleChange, handleDayChange, handleStatusChange } from '../utils/formHandlers';
import { handleEditSubmit } from '../utils/apiHandlers';

const EditComic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    status: 'Reading',
    volume: 0,
    chapter: 0,
    isRead: false,
    rating: 0,
    platform: '',
    releaseDays: [],
    note: '',
    resumeDate: '',
    color: '#ef4444'
  });
  const [customDates, setCustomDates] = useState('');

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const res = await API.get(`/comics/${id}`);
        const data = res.data.data;
        const formattedDate = data.resumeDate ? data.resumeDate.split('T')[0] : '';
        const safeReleaseDays = data.releaseDays || [];
        
        setFormData({ 
          ...data, 
          resumeDate: formattedDate, 
          releaseDays: safeReleaseDays 
        });

        const otherDays = safeReleaseDays.filter(d => !daysOfWeek.includes(d));
        if (otherDays.length > 0) setCustomDates(otherDays.join(', '));
        
      } catch (err) {
        toast.error('ไม่สามารถดึงข้อมูลได้');
        navigate('/comics');
      }
    };
    fetchComic();
    // eslint-disable-next-line
  }, [id, navigate]);

  const onSubmit = (e) => {
      handleEditSubmit({
        e,
        type: 'comics',
        id,
        formData,
        customDates,
        navigate,
        API,
        toast
      });
    };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-md border-t-4 border-blue-500 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: formData.color }}></span>
        แก้ไขคอมมิก: {formData.title}
      </h2>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">ชื่อเรื่อง *</label>
          <input type="text" name="title" required value={formData.title} onChange={(e) => handleChange(e, formData, setFormData)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">สถานะ *</label>
            <select name="status" value={formData.status} onChange={(e) => handleStatusChange(e.target.value, formData, setFormData)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              style={{ borderLeft: `4px solid ${formData.color}` }}>
              <option value="Reading">กำลังอ่าน (Reading)</option>
              <option value="Completed">จบบริบูรณ์ (Completed)</option>
              <option value="Want to Read">อยากอ่าน (Want to Read)</option>
              <option value="Stalled">ดองไว้ (Stalled)</option>
              <option value="Dropped">เทแล้ว (Dropped)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">แพลตฟอร์ม</label>
            <input type="text" name="platform" value={formData.platform} onChange={(e) => handleChange(e, formData, setFormData)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {formData.status === 'Reading' && (
          <div className="flex items-center mt-2">
            <input type="checkbox" id="isRead" checked={formData.isRead} onChange={(e) => {
                const checked = e.target.checked;
                setFormData({ 
                  ...formData, 
                  isRead: checked, 
                  color: getStatusColor(formData.status, checked) 
                });
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
            <label htmlFor="isRead" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
              อ่านถึงตอนล่าสุดแล้ว (Green Mode)
            </label>
          </div>
        )}

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">วันที่ตอนใหม่มา</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {daysOfWeek.map(day => (
              <button key={day} type="button" onClick={() => handleDayChange(day, formData, setFormData)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  formData.releaseDays.includes(day) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-gray-600 text-xs font-semibold mb-1">หรือระบุเป็นวันที่ (คั่นด้วยลูกน้ำ)</label>
            <input type="text" value={customDates} onChange={(e) => setCustomDates(e.target.value)} placeholder="เช่น 1, 10, 20"
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {formData.status === 'Stalled' && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              วันที่คาดว่าจะกลับมาอ่าน
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

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">เล่ม/ซีซัน (Vol./SS)</label>
            <div className="flex items-stretch border rounded focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden bg-white">
              <input type="number" name="volume" value={formData.volume} onChange={(e) => handleChange(e, formData, setFormData)} min="0" 
                className="w-full px-3 py-2 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <div className="flex border-l">
                <button type="button" onClick={() => setFormData({
                  ...formData, 
                  volume: Math.max(0, Number(formData.volume) - 1)
                })}
                  className="px-3 bg-gray-50 hover:bg-gray-200 border-r border-gray-200 text-gray-700 font-bold transition">-</button>
                <button type="button" onClick={() => setFormData({
                  ...formData, 
                  volume: Number(formData.volume) + 1
                })}
                  className="px-3 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold transition">+</button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">ตอน (Ch.)</label>
            <div className="flex items-stretch border rounded focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden bg-white">
              <input type="number" name="chapter" value={formData.chapter} onChange={(e) => handleChange(e, formData, setFormData)} min="0" 
                className="w-full px-3 py-2 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <div className="flex border-l">
                <button type="button" onClick={() => setFormData({
                  ...formData, 
                  chapter: Math.max(0, Number(formData.chapter) - 1)
                })}
                  className="px-3 bg-gray-50 hover:bg-gray-200 border-r border-gray-200 text-gray-700 font-bold transition">-</button>
                <button type="button" onClick={() => setFormData({
                  ...formData, 
                  chapter: Number(formData.chapter) + 1
                })}
                  className="px-3 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold transition">+</button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">คะแนน (0-10)</label>
            <div className="flex items-stretch border rounded focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden bg-white">
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
          <label className="block text-gray-700 text-sm font-bold mb-2">บันทึกเพิ่มเติม</label>
          <textarea name="note" value={formData.note} onChange={(e) => handleChange(e, formData, setFormData)} rows="2" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button type="submit" className="flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">บันทึก</button>
          <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400">ยกเลิก</button>
        </div>
      </form>
    </div>
  );
};

export default EditComic;