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