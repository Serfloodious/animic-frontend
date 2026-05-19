import { getStatusColor } from './formatters';
import { daysOfWeek } from './constants';

export const handleAddSubmit = async ({
  e,
  type, // 'animes' หรือ 'comics'
  formData,
  customDates,
  setLoading,
  setError,
  navigate,
  API
}) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    // 1. จัดการเรื่องวันที่ (Release Days)
    let finalReleaseDays = [...formData.releaseDays];
    if (customDates.trim() !== '') {
      const parsedDates = customDates.split(',').map(d => d.trim()).filter(d => d);
      finalReleaseDays = [...finalReleaseDays, ...parsedDates];
    }

    // 2. เช็คว่าเป็น Anime หรือ Comic เพื่อเลือกใช้ isWatched หรือ isRead
    const isUpToDate = type === 'animes' ? formData.isWatched : formData.isRead;

    // 3. เตรียมข้อมูลก่อนส่ง
    const dataToSend = { 
      ...formData, 
      releaseDays: finalReleaseDays,
      color: getStatusColor(formData.status, isUpToDate)
    };

    // 4. ส่งข้อมูลไปยัง Endpoint ตาม type ที่ระบุ
    await API.post(`/${type}`, dataToSend);
    
    // 5. เปลี่ยนหน้าไปยังรายการที่บันทึก
    navigate(`/${type}`);
  } catch (err) {
    const typeTH = type === 'animes' ? 'อนิเมะ' : 'คอมมิก';
    setError(err.response?.data?.message || `เกิดข้อผิดพลาดในการเพิ่ม${typeTH}`);
  } finally {
    setLoading(false);
  }
};

export const handleEditSubmit = async ({
  e,
  type, // 'animes' หรือ 'comics'
  id,
  formData,
  customDates,
  navigate,
  API,
  toast
}) => {
  e.preventDefault();
  try {
    let finalReleaseDays = formData.releaseDays.filter(d => daysOfWeek.includes(d));
    if (customDates.trim() !== '') {
      const parsedDates = customDates.split(',').map(d => d.trim()).filter(d => d);
      finalReleaseDays = [...finalReleaseDays, ...parsedDates];
    }

    await API.put(`/${type}/${id}`, { ...formData, releaseDays: finalReleaseDays });
    toast.success('บันทึกการแก้ไขสำเร็จ!');
    navigate(`/${type}/${id}`);
  } catch (err) {
    toast.error('แก้ไขข้อมูลไม่สำเร็จ กรุณาลองใหม่');
  }
};

export const handleDeleteData = async ({
  API, 
  type, // 'animes' หรือ 'comics'
  id, 
  toast, 
  navigate
}) => {
  try {
    await API.delete(`/${type}/${id}`);
    toast.success('ลบข้อมูลเรียบร้อยแล้ว');
    navigate(`/${type}`);
  } catch (err) {
    toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
  }
};