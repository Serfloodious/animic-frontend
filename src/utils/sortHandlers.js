export const handleAddSort = (sortRules, setSortRules) => {
  setSortRules([
    ...sortRules, 
    { field: 'createdAt', direction: 'desc' }
  ]);
};

export const handleUpdateSort = (index, key, value, sortRules, setSortRules, setPage) => {
  const newRules = [...sortRules];
  newRules[index][key] = value;
  setSortRules(newRules);
  setPage(1);
};

export const handleRemoveSort = (index, sortRules, setSortRules, setPage) => {
  const newRules = sortRules.filter((_, i) => i !== index);
  // บังคับให้ต้องมีอย่างน้อย 1 การจัดเรียง
  if (newRules.length === 0) {
      setSortRules([{ field: 'createdAt', direction: 'desc' }]);
  } else {
      setSortRules(newRules);
  }
  setPage(1);
};

export const handleFilterChange = (e, type, setFilterStatus, setFilterDay, setPage) => {
  if (type === 'status') setFilterStatus(e.target.value);
  if (type === 'day') setFilterDay(e.target.value);
  setPage(1); 
};

export const handleSearchChange = (key, value, setSearchFilters, setPage) => {
  setSearchFilters(prev => ({
    ...prev,
    [key]: value
  }));
  setPage(1);
};

export const handleStatusToggle = (statusName, setFilterStatus, setPage) => {
  setFilterStatus(prev => {
    if (prev.includes(statusName)) {
      // ถ้าเคยกดเลือกไว้แล้ว -> ให้เอาออก
      return prev.filter(s => s !== statusName);
    } else {
      // ถ้ายังไม่เคยเลือก -> ให้เพิ่มเข้าไปในกลุ่ม
      return [...prev, statusName];
    }
  });
  
  if (setPage) setPage(1); // บังคับกลับไปหน้า 1 เสมอเมื่อฟิลเตอร์เปลี่ยน
};