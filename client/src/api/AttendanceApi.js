import api from './axios';

export const markAttendance = async (memberId) => {
  const response = await api.post('/attendance/mark', { memberId });
  return response.data;
};

export const getTodayAttendance = async () => {
  const response = await api.get('/attendance/today');
  return response.data;
};



// ... any other attendance functions using api.post, etc.