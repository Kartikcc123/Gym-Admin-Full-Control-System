import api from './axios';

export const getAllTrainers = async () => {
  const response = await api.get('/trainers');
  return response.data;
};

export const addTrainer = async (trainerData) => {
  const response = await api.post('/trainers', trainerData);
  return response.data;
};

export const deleteTrainer = async (id) => {
  const response = await api.delete(`/trainers/${id}`);
  return response.data;
};