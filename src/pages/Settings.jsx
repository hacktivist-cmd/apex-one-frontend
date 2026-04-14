import React, { useState } from 'react';
import { Lock, Save } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

export default function Settings() {
  const { user } = useAuthStore();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) return setError('Passwords do not match');
    try {
      await api.post('/user/change-password', { oldPassword, newPassword });
      setMessage('Password updated');
      setOldPassword(''); setNewPassword(''); setConfirm('');
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
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
    </div>
  );
}
