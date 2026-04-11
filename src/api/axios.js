import axios from 'axios';

const API = axios.create({
  // เปลี่ยนพอร์ตตามที่ Backend คุณรันอยู่
  baseURL: 'http://localhost:5000/api/v1', 
});

// Interceptor: ก่อนส่ง Request จะไปเช็กที่ LocalStorage ว่ามี Token ไหม
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;