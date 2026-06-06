import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true
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