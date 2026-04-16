import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

import { getStatusColor } from '../utils/helpers';

export default function AddComic() {
  const navigate = useNavigate();
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const [formData, setFormData] = useState({
    title: '',
    status: 'Reading',
    isRead: false,
    chapter: 0,
    volume: 0,
    platform: '',
    rating: 0,
    note: '',
    releaseDays: [], // Array สำหรับเก็บวันที่เลือก
    resumeDate: '',   // เก็บค่าวันที่ในรูปแบบ YYYY-MM-DD
    color: '#ef4444'
  });
  const [customDates, setCustomDates] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: value 
    });
  };

  // ฟังก์ชันจัดการการติ๊กเลือกวัน (releaseDays)
  const handleDayChange = (day) => {
    const updatedDays = formData.releaseDays.includes(day)
      ? formData.releaseDays.filter(d => d !== day)
      : [...formData.releaseDays, day];
    setFormData({ 
      ...formData, 
      releaseDays: updatedDays 
    });
  };

  const handleStatusChange = (newStatus) => {
    const newColor = getStatusColor(newStatus, formData.isRead);
    setFormData({ 
      ...formData, 
      status: newStatus, 
      color: newColor,
      resumeDate: newStatus === 'Stalled' ? formData.resumeDate : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalReleaseDays = [...formData.releaseDays];
      if (customDates.trim() !== '') {
        const parsedDates = customDates.split(',').map(d => d.trim()).filter(d => d);
        finalReleaseDays = [...finalReleaseDays, ...parsedDates];
      }

      // นำข้อมูลที่รวมแล้วไปแทนที่ก่อนส่ง API
      const dataToSend = { 
        ...formData, 
        releaseDays: finalReleaseDays,
        color: getStatusColor(formData.status, formData.isRead)
      };

      // ส่งข้อมูลไปเซฟ (Backend จะแปลง string วันที่เป็น Date object ให้อัตโนมัติ)
      await API.post('/comics', dataToSend);
      navigate('/comics');
    } catch (err) {
        setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเพิ่มคอมมิก');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6 border-t-4 border-blue-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: formData.color }}></span>
        เพิ่มคอมมิกเรื่องใหม่
      </h2>

      {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ฟิลด์พื้นฐาน */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">ชื่อเรื่อง (Title) *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">สถานะ (Status) *</label>
            <select name="status" value={formData.status} onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              style={{ borderLeft: `4px solid ${formData.color}` }}>
              <option value="Reading">กำลังอ่าน (Reading)</option>
              <option value="Completed">อ่านจบแล้ว (Completed)</option>
              <option value="Want to Read">อยากอ่าน (Want to Read)</option>
              <option value="Stalled">ดองไว้ (Stalled)</option>
              <option value="Dropped">เทแล้ว (Dropped)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">แพลตฟอร์ม (Platform)</label>
            <input type="text" name="platform" value={formData.platform} onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

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
            อ่านทันตอนล่าสุดแล้ว (Green Mode)
          </label>
        </div>

        {/* ส่วนใหม่: Release Days */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">วันที่ตอนใหม่มา (Release Days)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {daysOfWeek.map(day => (
              <button key={day} type="button" onClick={() => handleDayChange(day)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  formData.releaseDays.includes(day) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {day.substring(0, 3)}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-gray-600 text-xs font-semibold mb-1">หรือระบุเป็นวันที่ (คั่นด้วยลูกน้ำ)</label>
            <input 
              type="text" 
              value={customDates} 
              onChange={(e) => setCustomDates(e.target.value)} 
              placeholder="เช่น 1, 10, 20"
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>

        {formData.status === 'Stalled' && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              วันที่คาดว่าจะกลับมาอ่าน (Resume Date)
            </label>
            <input 
              type="date" 
              name="resumeDate" 
              value={formData.resumeDate} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded" 
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {/* เล่ม/ซีซัน (Vol./SS) */}
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">เล่ม/ซีซัน (Vol./SS)</label>
            <div className="flex items-stretch border rounded focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden bg-white">
              <input type="number" name="volume" value={formData.volume} onChange={handleChange} min="0" 
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

          {/* ตอน (Ch.) */}
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">ตอน (Ch.)</label>
            <div className="flex items-stretch border rounded focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden bg-white">
              <input type="number" name="chapter" value={formData.chapter} onChange={handleChange} min="0" 
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

          {/* คะแนน (Rating) (0-10) */}
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">คะแนน (Rating) (0-10)</label>
            <div className="flex items-stretch border rounded focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden bg-white">
              <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="0" max="10" 
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
          <textarea name="note" value={formData.note} onChange={handleChange} rows="2" className="w-full px-3 py-2 border rounded" />
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button type="submit" disabled={loading} className="flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">บันทึก</button>
          <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">ยกเลิก</button>
        </div>
      </form>
    </div>
  );
}