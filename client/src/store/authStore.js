import { create } from 'zustand';

// Unified auth store: prefers `userInfo` (used by Login.jsx + axios),
// but falls back to older `user`/`token` keys for compatibility.
const storedUserInfo = (() => {
  try {
    const raw = localStorage.getItem('userInfo');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore parse errors
  }
  return null;
})();

const fallbackUser = JSON.parse(localStorage.getItem('user') || 'null');
const fallbackToken = localStorage.getItem('token') || null;

const useAuthStore = create((set) => ({
  user: (storedUserInfo && storedUserInfo._id) ? {
    _id: storedUserInfo._id,
    name: storedUserInfo.name,
    email: storedUserInfo.email,
    role: storedUserInfo.role
  } : fallbackUser,
  token: (storedUserInfo && storedUserInfo.token) ? storedUserInfo.token : fallbackToken,

  // Action to log in: store under `userInfo` for app-wide consistency
  login: (userData, token) => {
    const payload = { ...userData, token };
    localStorage.setItem('userInfo', JSON.stringify(payload));
    // also keep legacy keys for other parts of the app
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    set({ user: userData, token });
  },

  // Action to log out
  logout: () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;