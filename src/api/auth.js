import api from './axios';

export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/user/profile');
export const changePassword = (data) => api.post('/user/change-password', data);
