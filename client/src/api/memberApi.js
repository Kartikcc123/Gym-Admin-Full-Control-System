import api from './axios';

// Fetch all members
export const getAllMembers = async () => {
  const response = await api.get('/members');
  // Server may wrap results inside { success, count, data }
  return response.data && response.data.data ? response.data.data : response.data;
};

// Add a new member
export const createMember = async (memberData) => {
  const response = await api.post('/members', memberData);
  return response.data;
};

// Fetch a single member by id
export const getMemberById = async (id) => {
  const response = await api.get(`/members/${id}`);
  return response.data;
};


export const assignPlanToMember = async (memberId, planId) => {
  const response = await api.put(`/members/${memberId}/assign-plan`, { planId });
  return response.data;
};

export const assignTrainerToMember = async (memberId, trainerId) => {
  const response = await api.put(`/members/${memberId}/assign-trainer`, { trainerId });
  return response.data;
};

export const deleteMember = async (id) => {
  const response = await api.delete(`/members/${id}`);
  return response.data;
};
