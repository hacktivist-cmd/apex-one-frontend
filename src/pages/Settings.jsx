import React, { useState } from 'react';
import { Lock, Save, AlertTriangle, Trash2 } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) return setError('Passwords do not match');
    try {
      await api.post('/user/change-password', { oldPassword, newPassword });
      setMessage('Password updated');
      setOldPassword(''); setNewPassword(''); setConfirm('');
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setError('Type "DELETE" to confirm');
      return;
    }
    setDeleteLoading(true);
    try {
      await api.delete('/user/account');
      logout();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Lock size={18} /> Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <input type="password" placeholder="Current Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" required />
          <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" required />
          <input type="password" placeholder="Confirm New Password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" required />
          {error && <div className="p-2 bg-red-500/10 text-red-500 rounded">{error}</div>}
          {message && <div className="p-2 bg-green-500/10 text-green-500 rounded">{message}</div>}
          <button type="submit" className="bg-gold text-black px-6 py-2 rounded-xl flex items-center gap-2"><Save size={16} /> Update Password</button>
        </form>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-500"><Trash2 size={18} /> Delete Account</h2>
        <p className="text-gray-400 text-sm mb-4">This action is permanent. All your data, transactions, and investments will be deleted.</p>
        <input type="text" placeholder='Type "DELETE" to confirm' value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} className="w-full bg-white/5 border border-red-500/30 rounded-xl p-3 mb-4" />
        <button onClick={handleDeleteAccount} disabled={deleteLoading} className="bg-red-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50"><Trash2 size={16} /> {deleteLoading ? 'Deleting...' : 'Permanently Delete Account'}</button>
      </div>
    </div>
  );
}
