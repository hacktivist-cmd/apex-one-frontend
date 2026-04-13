import api from './axios';

export const getUsers = () => api.get('/admin/users');
export const updateUserBalance = (userId, availableBalance) => api.patch(`/admin/users/${userId}/balance`, { availableBalance });
export const getWithdrawals = () => api.get('/admin/withdrawals');
export const updateWithdrawal = (id, status, adminNotes) => api.patch(`/admin/withdrawals/${id}`, { status, adminNotes });
export const createDeposit = (data) => api.post('/admin/deposits', data);
export const getAuditLogs = () => api.get('/admin/audit-logs');
export const getContactMessages = () => api.get('/admin/contact-messages');
export const markMessageRead = (id) => api.patch(`/admin/contact-messages/${id}/read`);
export const getWallets = () => api.get('/admin/settings/wallets');
export const updateWallet = (symbol, data) => api.patch(`/admin/settings/wallets/${symbol}`, data);
