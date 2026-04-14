import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const storage = localStorage.getItem('auth-storage');
  if (storage) {
    try {
      const { state } = JSON.parse(storage);
      if (state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    } catch (e) {
      console.error('Failed to parse auth storage', e);
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default api;
