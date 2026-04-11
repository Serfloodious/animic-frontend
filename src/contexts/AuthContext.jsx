import { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันเช็กว่ามีคน Login ค้างไว้ไหม (รันทุกครั้งที่เปิดเว็บ)
  const checkUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // ยิงไปที่ Path /me ที่เคยออกแบบไว้ใน Backend
        const res = await API.get('/auth/me');
        setUser(res.data.data); // สมมติว่า Backend ส่ง data กลับมาในรูปแบบนี้
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  // ฟังก์ชันสำหรับ Login
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // ฟังก์ชันสำหรับ Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook สำหรับเอาไปเรียกใช้ในหน้าอื่น ๆ ได้ง่าย ๆ
export const useAuth = () => useContext(AuthContext);