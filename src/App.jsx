import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Animic</h1>
      {user ? (
        <p className="text-green-500">ยินดีต้อนรับคุณ: {user.username}</p>
      ) : (
        <p className="text-gray-500">กรุณาเข้าสู่ระบบ</p>
      )}
    </div>
  );
}

export default App;