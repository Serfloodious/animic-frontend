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