import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: sessionStorage.getItem('token') || null,
  login: (token) => {
    sessionStorage.setItem('token', token);
    localStorage.removeItem('token'); // Clear any legacy persistent storage
    set({ token });
  },
  logout: () => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    set({ token: null });
  },
}));
