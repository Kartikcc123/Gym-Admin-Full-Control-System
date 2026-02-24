import api from './axios';

export const getAllPlans = async () => {
  const response = await api.get('/membership-plans');
  return response.data;
};

export const createPlan = async (planData) => {
  const response = await api.post('/membership-plans', planData);
  return response.data;
};