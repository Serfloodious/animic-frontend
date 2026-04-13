import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

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
  const [customDay, setCustomDay] = useState('');

  const getColor = (status, isUpToDate) => {
    if (status === 'Reading' || status === 'Watching') return isUpToDate ? '#22c55e' : '#ef4444';
    if (status === 'Stalled') return '#eab308';
    if (status === 'Want to Read' || status === 'Want to Watch') return '#3b82f6';
    if (status === 'Dropped') return '#6b7280';
    if (status === 'Completed') return '#a855f7';
    return '#ef4444';
  };

  // 1. ดึงข้อมูลเดิมมาใส่ในฟอร์ม
  useEffect(() => {
    const fetchComic = async () => {
      try {
        const res = await API.get(`/comics/${id}`);
        const data = res.data.data;
        
        // จัดการเรื่องวันที่สำหรับ input type="date" (YYYY-MM-DD)
        const formattedDate = data.resumeDate ? data.resumeDate.split('T')[0] : '';
        
        setFormData({ ...data, resumeDate: formattedDate });

        // เช็คว่าใน releaseDays มีค่าที่ไม่ใช่วันในสัปดาห์ไหม เพื่อเอามาใส่ในช่อง customDay
        const standardDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const otherDay = data.releaseDays.find(d => !standardDays.includes(d));
        if (otherDay) setCustomDay(otherDay);
        
      } catch (err) {
        alert('ไม่สามารถดึงข้อมูลได้');
        navigate('/comics');
      }
    };
    fetchComic();
  }, [id, navigate]);

  // 2. ลอจิกเปลี่ยนสีอัตโนมัติตามสถานะ
  const handleStatusChange = (newStatus) => {
    const newColor = getColor(newStatus, formData.isRead);
    setFormData({ ...formData, status: newStatus, color: newColor });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // รวมวันจาก checkbox และช่องกรอกเอง
      const finalDays = [...formData.releaseDays.filter(d => ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].includes(d))];
      if (customDay) finalDays.push(customDay);

      await API.put(`/comics/${id}`, { ...formData, releaseDays: finalDays });
      navigate(`/comics/${id}`); // แก้ไขเสร็จกลับไปหน้า Detail
    } catch (err) {
      alert('แก้ไขข้อมูลไม่สำเร็จ');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border mt-10">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <span className="w-3 h-8 mr-3 rounded" style={{ backgroundColor: formData.color }}></span>
        แก้ไขการ์ตูน: {formData.title}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อเรื่อง</label>
          <input 
            type="text" required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">สถานะ (สีจะเปลี่ยนอัตโนมัติ)</label>
            <select 
              value={formData.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full p-2 border rounded-lg outline-none"
              style={{ borderLeft: `4px solid ${formData.color}` }}
            >
              <option value="Reading">กำลังอ่าน</option>
              <option value="Completed">จบบริบูรณ์</option>
              <option value="Stalled">ดอง</option>
              <option value="Want to Read">อยากอ่าน</option>
              <option value="Dropped">เท</option>
            </select>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.isRead}
                onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData({ 
                        ...formData, 
                        isRead: checked, 
                        color: getColor(formData.status, checked) // คำนวณสีใหม่ทันที
                    });
                }}
                className="w-5 h-5 mr-2 rounded"
              />
              <span className="text-sm font-medium text-gray-700">อ่านทันตอนล่าสุดแล้ว</span>
            </label>
          </div>
        </div>

        {/* ... ส่วนของ Volume, Chapter, Rating, Platform จะเหมือนหน้า Add ... */}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">วันที่ตอนใหม่มา</label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
              <label key={day} className="flex items-center text-xs bg-gray-50 p-2 rounded border cursor-pointer hover:bg-gray-100">
                <input 
                  type="checkbox"
                  checked={formData.releaseDays.includes(day)}
                  onChange={(e) => {
                    const newDays = e.target.checked 
                      ? [...formData.releaseDays, day]
                      : formData.releaseDays.filter(d => d !== day);
                    setFormData({...formData, releaseDays: newDays});
                  }}
                  className="mr-2"
                /> {day.slice(0,3)}
              </label>
            ))}
          </div>
          <input 
            type="text" 
            placeholder="อื่น ๆ เช่น ทุกวันที่ 1, 15"
            value={customDay}
            onChange={(e) => setCustomDay(e.target.value)}
            className="w-full p-2 border rounded-lg text-sm"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">บันทึกการแก้ไข</button>
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  );
};

export default EditComic;