import api from './axios';

export const getAllPayments = async () => {
  const response = await api.get('/payments');
  return response.data;
};

export const recordPayment = async (paymentData) => {
  const response = await api.post('/payments', paymentData);
  return response.data;
};

// NEW: Ask backend to create a Razorpay order
export const createRazorpayOrder = async ({ amount, memberId }) => {
  const response = await api.post('/payments/checkout', { amount, memberId });
  return response.data;
};

export const verifyRazorpayPayment = async (payload) => {
  const response = await api.post('/payments/verify', payload);
  return response.data;
};

export const getPendingPayments = async () => {
  const response = await api.get('/payments/pending');
  return response.data;
};