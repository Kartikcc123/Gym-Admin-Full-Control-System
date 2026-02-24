import api from './axios'; // FIXED: Using our secure gateway!

export const getDashboardStats = async (months = 6) => {
  const response = await api.get(`/dashboard?months=${months}`);
  return response.data;
};