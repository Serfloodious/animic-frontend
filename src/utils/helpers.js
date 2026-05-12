export const formatDate = (dateString) => {
  if (!dateString) return 'ไม่มีกำหนด';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const getDayColor = (day) => {
  const colors = {
    'Monday': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    'Tuesday': 'bg-pink-100 text-pink-700 border border-pink-200',
    'Wednesday': 'bg-green-100 text-green-700 border border-green-200',
    'Thursday': 'bg-orange-100 text-orange-700 border border-orange-200',
    'Friday': 'bg-blue-100 text-blue-700 border border-blue-200',
    'Saturday': 'bg-purple-100 text-purple-700 border border-purple-200',
    'Sunday': 'bg-red-100 text-red-700 border border-red-200'
  };
  return colors[day] || 'bg-gray-100 text-gray-600 border border-gray-200';
};

export const dayOptions = [
  { value: 'Monday', label: 'วันจันทร์ (Monday)' },
  { value: 'Tuesday', label: 'วันอังคาร (Tuesday)' },
  { value: 'Wednesday', label: 'วันพุธ (Wednesday)' },
  { value: 'Thursday', label: 'วันพฤหัสบดี (Thursday)' },
  { value: 'Friday', label: 'วันศุกร์ (Friday)' },
  { value: 'Saturday', label: 'วันเสาร์ (Saturday)' },
  { value: 'Sunday', label: 'วันอาทิตย์ (Sunday)' },
  { value: 'Others', label: 'อื่น ๆ (Others)' }
];

// ฟังก์ชันคำนวณสี
export const getStatusColor = (status, isUpToDate) => {
  // รองรับทั้ง Reading (Comic) และ Watching (Anime)
  if (status === 'Reading' || status === 'Watching') return isUpToDate ? '#22c55e' : '#ef4444'; 
  if (status === 'Stalled') return '#eab308'; 
  if (status === 'Want to Read' || status === 'Want to Watch') return '#3b82f6'; 
  if (status === 'Dropped') return '#6b7280'; 
  if (status === 'Completed') return '#a855f7'; 
  return '#ef4444';
};

export const handleAddSort = (sortRules, setSortRules) => {
  setSortRules([
    ...sortRules, 
    { field: 'createdAt', direction: 'desc' }
  ]);
};

export const handleUpdateSort = (index, key, value, sortRules, setSortRules, setPage) => {
  const newRules = [...sortRules];
  newRules[index][key] = value;
  setSortRules(newRules);
  setPage(1);
};

export const handleRemoveSort = (index, sortRules, setSortRules, setPage) => {
  const newRules = sortRules.filter((_, i) => i !== index);
  // บังคับให้ต้องมีอย่างน้อย 1 การจัดเรียง
  if (newRules.length === 0) {
      setSortRules([{ field: 'createdAt', direction: 'desc' }]);
  } else {
      setSortRules(newRules);
  }
  setPage(1);
};

export const handleFilterChange = (e, type, setFilterStatus, setFilterDay, setPage) => {
  if (type === 'status') setFilterStatus(e.target.value);
  if (type === 'day') setFilterDay(e.target.value);
  setPage(1); 
};

export const handleChange = (e, formData, setFormData) => {
  const { name, value } = e.target;
  setFormData({ 
    ...formData, 
    [name]: value 
  });
};

// ฟังก์ชันจัดการการติ๊กเลือกวัน (releaseDays)
export const handleDayChange = (day, formData, setFormData) => {
  const updatedDays = formData.releaseDays.includes(day)
    ? formData.releaseDays.filter(d => d !== day)
    : [...formData.releaseDays, day];
  setFormData({ 
    ...formData, 
    releaseDays: updatedDays 
  });
};

export const handleStatusChange = (newStatus, formData, setFormData) => {
  const isUpToDate = formData.isWatched !== undefined ? formData.isWatched : formData.isRead;
  const newColor = getStatusColor(newStatus, isUpToDate);
  setFormData({ 
    ...formData, 
    status: newStatus, 
    color: newColor,
    resumeDate: newStatus === 'Stalled' ? formData.resumeDate : ''
  });
};

export const handleAddSubmit = async ({
  e,
  type, // 'animes' หรือ 'comics'
  formData,
  customDates,
  setLoading,
  setError,
  navigate,
  API
}) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    // 1. จัดการเรื่องวันที่ (Release Days)
    let finalReleaseDays = [...formData.releaseDays];
    if (customDates.trim() !== '') {
      const parsedDates = customDates.split(',').map(d => d.trim()).filter(d => d);
      finalReleaseDays = [...finalReleaseDays, ...parsedDates];
    }

    // 2. เช็คว่าเป็น Anime หรือ Comic เพื่อเลือกใช้ isWatched หรือ isRead
    const isUpToDate = type === 'animes' ? formData.isWatched : formData.isRead;

    // 3. เตรียมข้อมูลก่อนส่ง
    const dataToSend = { 
      ...formData, 
      releaseDays: finalReleaseDays,
      color: getStatusColor(formData.status, isUpToDate)
    };

    // 4. ส่งข้อมูลไปยัง Endpoint ตาม type ที่ระบุ
    await API.post(`/${type}`, dataToSend);
    
    // 5. เปลี่ยนหน้าไปยังรายการที่บันทึก
    navigate(`/${type}`);
  } catch (err) {
    const typeTH = type === 'animes' ? 'อนิเมะ' : 'คอมมิก';
    setError(err.response?.data?.message || `เกิดข้อผิดพลาดในการเพิ่ม${typeTH}`);
  } finally {
    setLoading(false);
  }
};

export const daysOfWeek = [
  'Monday', 
  'Tuesday', 
  'Wednesday', 
  'Thursday', 
  'Friday', 
  'Saturday', 
  'Sunday'
];

export const handleEditSubmit = async ({
  e,
  type, // 'animes' หรือ 'comics'
  id,
  formData,
  customDates,
  navigate,
  API,
  toast
}) => {
  e.preventDefault();
  try {
    let finalReleaseDays = formData.releaseDays.filter(d => daysOfWeek.includes(d));
    if (customDates.trim() !== '') {
      const parsedDates = customDates.split(',').map(d => d.trim()).filter(d => d);
      finalReleaseDays = [...finalReleaseDays, ...parsedDates];
    }

    await API.put(`/${type}/${id}`, { ...formData, releaseDays: finalReleaseDays });
    toast.success('บันทึกการแก้ไขสำเร็จ!');
    navigate(`/${type}/${id}`);
  } catch (err) {
    toast.error('แก้ไขข้อมูลไม่สำเร็จ กรุณาลองใหม่');
  }
};

export const handleDeleteData = async ({
  API, 
  type, // 'animes' หรือ 'comics'
  id, 
  toast, 
  navigate
}) => {
  try {
    await API.delete(`/${type}/${id}`);
    toast.success('ลบข้อมูลเรียบร้อยแล้ว');
    navigate(`/${type}`);
  } catch (err) {
    toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
  }
};