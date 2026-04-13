import axios from 'axios';

const api = axios.create({
  baseURL: 'https://apex-one-backend.onrender.com/api',
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
    } catch (e) {}
  }
  return config;
});

export default api;
