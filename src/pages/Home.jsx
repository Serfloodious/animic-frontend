import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold">Animic Landing Page</h1>
      <div className="space-x-4">
        <Link to="/auth/login" className="bg-blue-500 text-white px-4 py-2 rounded">เข้าสู่ระบบ</Link>
        <Link to="/auth/register" className="bg-green-500 text-white px-4 py-2 rounded">สมัครสมาชิก</Link>
      </div>
    </div>
  );
}