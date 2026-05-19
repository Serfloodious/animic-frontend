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

export const getStatusColor = (status, isUpToDate) => {
  // รองรับทั้ง Reading (Comic) และ Watching (Anime)
  if (status === 'Reading' || status === 'Watching') return isUpToDate ? '#22c55e' : '#ef4444'; 
  if (status === 'Stalled') return '#eab308'; 
  if (status === 'Want to Read' || status === 'Want to Watch') return '#3b82f6'; 
  if (status === 'Dropped') return '#6b7280'; 
  if (status === 'Completed') return '#a855f7'; 
  return '#ef4444';
};