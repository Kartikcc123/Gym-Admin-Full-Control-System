import api from './axios'; // Using our secure gateway!

export const getAllRoutines = async () => {
  const response = await api.get('/routines');
  return response.data;
};

export const createRoutine = async (routineData) => {
  const response = await api.post('/routines', routineData);
  return response.data;
};