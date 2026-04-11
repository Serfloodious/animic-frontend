import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold text-red-500 mb-6">
          Animic
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10">
          แพลตฟอร์มส่วนตัวสำหรับจัดการลิสต์คอมมิกหรืออนิเมะที่คุณสนใจ
          ติดตามความคืบหน้าและไม่พลาดทุกเรื่องโปรดของคุณ
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/auth/register" 
            className="px-8 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition shadow-lg"
          >
            ลงทะเบียน
          </Link>
          <Link 
            to="/auth/login" 
            className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition border border-gray-700"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}