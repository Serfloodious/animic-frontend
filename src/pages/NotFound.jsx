import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-extrabold text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">ไม่พบหน้าที่คุณกำลังมองหา</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        หน้าเว็บที่คุณต้องการเข้าถึงอาจถูกลบไปแล้ว, เปลี่ยนชื่อ, หรือไม่มีอยู่จริงตั้งแต่ต้น
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-sm"
      >
        กลับสู่หน้าหลัก
      </Link>
    </div>
  );
};

export default NotFound;