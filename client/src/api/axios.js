import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gym-admin-full-control-system.onrender.com/api', 
});

// THE INTERCEPTOR: This automatically attaches your digital badge to every request
api.interceptors.request.use((config) => {
  // Try multiple storage keys for compatibility
  let token = null;

  try {
    const raw = localStorage.getItem('userInfo');
    if (raw) {
      const parsed = JSON.parse(raw);
      token = parsed.token || parsed?.data?.token || null;
    }
  } catch (e) {
    // ignore
  }

  // Fallback to legacy `user`/`token` keys
  if (!token) {
    const rawUser = localStorage.getItem('user');
    const rawToken = localStorage.getItem('token');
    if (rawToken) token = rawToken;
    else if (rawUser) {
      try { token = JSON.parse(rawUser).token || null; } catch (e) { /* ignore */ }
    }
  }

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;