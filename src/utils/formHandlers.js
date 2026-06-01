import { getStatusColor } from './formatters';

export const handleChange = (e, formData, setFormData) => {
  const { name, value } = e.target;
  setFormData({ 
    ...formData, 
    [name]: value 
  });
};

export const handleDayChange = (day, formData, setFormData) => {
  const updatedDays = formData.releaseDays.includes(day)
    ? formData.releaseDays.filter(d => d !== day)
    : [...formData.releaseDays, day];
  setFormData({ 
    ...formData, 
    releaseDays: updatedDays 
  });
};

export const handleStatusChange = (newStatus, formData, setFormData) => {
  const currentUpToDate = formData.isWatched !== undefined ? formData.isWatched : formData.isRead;
  const isUpToDate = (newStatus === 'Watching' || newStatus === 'Reading') ? currentUpToDate : false;
  const newColor = getStatusColor(newStatus, isUpToDate);
  setFormData({ 
    ...formData, 
    status: newStatus, 
    color: newColor,
    resumeDate: newStatus === 'Stalled' ? formData.resumeDate : '',
    ...(formData.isWatched !== undefined ? { isWatched: isUpToDate } : { isRead: isUpToDate })
  });
};