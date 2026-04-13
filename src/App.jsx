import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';

import AddComic from './pages/AddComic';
import AddAnime from './pages/AddAnime';

import Comics from './pages/Comics';
import Animes from './pages/Animes';

import ComicDetail from './pages/ComicDetail';
import AnimeDetail from './pages/AnimeDetail';

import EditComic from './pages/EditComic';
import EditAnime from './pages/EditAnime';

import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
      />

      <Routes>
        {/* หน้าเว็บสาธารณะ (คนล็อกอินแล้วไม่ควรเห็นหน้านี้) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Route>

        {/* หน้าเว็บส่วนตัว (ต้องล็อกอินก่อนถึงจะเข้าได้) */}
        <Route element={<ProtectedRoute />}>
          {/* เอา Layout มาครอบเฉพาะหน้าหลังบ้าน */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/password" element={<ChangePassword />} />
            <Route path="/comics/add" element={<AddComic />} />
            <Route path="/animes/add" element={<AddAnime />} />
            <Route path="/comics" element={<Comics />} />
            <Route path="/animes" element={<Animes />} />
            <Route path="/comics/:id" element={<ComicDetail />} />
            <Route path="/animes/:id" element={<AnimeDetail />} />
            <Route path="/comics/:id/edit" element={<EditComic />} />
            <Route path="/animes/:id/edit" element={<EditAnime />} />
          </Route>
        </Route>

        {/* กรณีพิมพ์ URL มั่ว (404 Not Found) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;