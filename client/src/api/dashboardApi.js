import api from './axios';

export const getDashboardStats = async (months = 6) => {
  const response = await api.get(`/dashboard?months=${months}`);
  return response.data;
};