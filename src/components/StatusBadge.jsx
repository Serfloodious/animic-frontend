import React from 'react';

// ฟังก์ชันสำหรับแสดงป้ายสถานะ (รองรับทั้ง Anime และ Comic)
const StatusBadge = (status, isUpToDate) => {
  switch (status) {
    case 'Watching':
    case 'Reading':
      return isUpToDate ? (
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold shrink-0">
          {status === 'Watching' ? 'ดูถึงตอนล่าสุดแล้ว' : 'อ่านถึงตอนล่าสุดแล้ว'}
        </span>
      ) : (
        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold shrink-0">
          {status === 'Watching' ? 'ยังดูไม่ถึงตอนล่าสุด' : 'ยังอ่านไม่ถึงตอนล่าสุด'}
        </span>
      );
    case 'Stalled':
      return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold shrink-0">ดองไว้</span>;
    case 'Want to Watch':
      return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold shrink-0">อยากดู</span>;
    case 'Want to Read':
      return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold shrink-0">อยากอ่าน</span>;
    case 'Dropped':
      return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-bold shrink-0">เทแล้ว</span>;
    case 'Completed':
      return <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold shrink-0">จบบริบูรณ์</span>;
    default:
      return null;
  }
};

export default StatusBadge;