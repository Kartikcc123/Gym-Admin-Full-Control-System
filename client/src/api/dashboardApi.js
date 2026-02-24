import api from './axios';

export const getDashboardStats = async (months = 6) => {
  // 🔥 THE FIX: Added a timestamp (&t=...) to completely bypass the browser cache
  // Ab browser har baar server se fresh data hi layega!
  const response = await api.get(`/dashboard?months=${months}&t=${new Date().getTime()}`);
  return response.data;
};