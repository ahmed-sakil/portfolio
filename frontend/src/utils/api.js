import axios from 'axios';

/**
 * Centralized API client configured with environment variables.
 * In local dev: defaults to http://localhost:5000/api
 * In production (Vercel): uses VITE_API_BASE_URL (e.g. https://your-backend.onrender.com/api)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token from sessionStorage for protected admin endpoints
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

export default api;
