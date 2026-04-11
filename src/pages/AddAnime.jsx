import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function AddAnime() {
  const navigate = useNavigate();
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [formData, setFormData] = useState({
    title: '',
    status: 'Watching',
    episode: 0,
    platform: '',
    rating: 0,
    note: '',
    releaseDays: [],
    resumeDate: ''
  });
  const [customDates, setCustomDates] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDayChange = (day) => {
    const updatedDays = formData.releaseDays.includes(day)
      ? formData.releaseDays.filter(d => d !== day)
      : [...formData.releaseDays, day];
    setFormData({ ...formData, releaseDays: updatedDays });
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
      const dataToSend = { ...formData, releaseDays: finalReleaseDays };

      await API.post('/animes', formData);
      navigate('/animes');
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเพิ่มอนิเมะ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6 border-t-4 border-purple-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-4 h-4 rounded-full inline-block bg-purple-500"></span>
        เพิ่มอนิเมะเรื่องใหม่
      </h2>

      {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">ชื่อเรื่อง (Title) *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">สถานะ (Status) *</label>
            <select name="status" value={formData.status} onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
              <option value="Watching">กำลังดู (Watching)</option>
              <option value="Completed">ดูจบแล้ว (Completed)</option>
              <option value="Want to Watch">อยากดู (Want to Watch)</option>
              <option value="Stalled">ดองไว้ (Stalled)</option>
              <option value="Dropped">เทแล้ว (Dropped)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">แพลตฟอร์ม (Platform)</label>
            <input type="text" name="platform" value={formData.platform} onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>

        {/* Release Days */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">วันที่ฉาย (Release Days)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {daysOfWeek.map(day => (
              <button key={day} type="button" onClick={() => handleDayChange(day)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  formData.releaseDays.includes(day) ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>
        </div>

        {/* Resume Date */}
        <div>
          <label className={`block text-sm font-bold mb-2 ${formData.status === 'Stalled' ? 'text-red-500' : 'text-gray-700'}`}>
            วันที่คาดว่าจะกลับมาดู (Resume Date)
          </label>
          <input type="date" name="resumeDate" value={formData.resumeDate} onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* ตอนที่ (Ep.) */}
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">ตอนที่ (Ep.)</label>
            <div className="flex items-stretch border rounded focus-within:ring-2 focus-within:ring-purple-500 overflow-hidden bg-white">
              <input type="number" name="episode" value={formData.episode} onChange={handleChange} min="0" 
                className="w-full px-3 py-2 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <div className="flex border-l">
                <button type="button" onClick={() => setFormData({...formData, episode: Math.max(0, Number(formData.episode) - 1)})}
                  className="px-3 bg-gray-50 hover:bg-gray-200 border-r border-gray-200 text-gray-700 font-bold transition">-</button>
                <button type="button" onClick={() => setFormData({...formData, episode: Number(formData.episode) + 1})}
                  className="px-3 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold transition">+</button>
              </div>
            </div>
          </div>

          {/* คะแนน (0-10) */}
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">คะแนน (0-10)</label>
            <div className="flex items-stretch border rounded focus-within:ring-2 focus-within:ring-purple-500 overflow-hidden bg-white">
              <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="0" max="10" 
                className="w-full px-3 py-2 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <div className="flex border-l">
                <button type="button" onClick={() => setFormData({...formData, rating: Math.max(0, Number(formData.rating) - 1)})}
                  className="px-3 bg-gray-50 hover:bg-gray-200 border-r border-gray-200 text-gray-700 font-bold transition">-</button>
                <button type="button" onClick={() => setFormData({...formData, rating: Math.min(10, Number(formData.rating) + 1)})}
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
          <button type="submit" disabled={loading} className="flex-1 bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-600">บันทึก</button>
          <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">ยกเลิก</button>
        </div>
      </form>
    </div>
  );
}