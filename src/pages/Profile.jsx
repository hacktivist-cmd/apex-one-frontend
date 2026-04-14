import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Upload, Save } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

export default function Profile() {
  const { user, updateBalance } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', phone: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setFormData({ email: user.email, phone: user.phone || '' });
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/user/profile', formData);
      setMessage('Profile updated');
    } catch (err) { setMessage('Update failed'); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('profilePicture', file);
    setLoading(true);
    try {
      await api.post('/user/upload-picture', data);
      setMessage('Profile picture uploaded');
    } catch (err) { setMessage('Upload failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center text-3xl font-bold">{user?.fullName?.charAt(0)}</div>
          <label className="cursor-pointer bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10"><Upload size={16} className="inline mr-2" /> Upload Picture<input type="file" accept="image/*" onChange={handleUpload} className="hidden" /></label>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div><label className="block text-sm mb-1">Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" /></div>
          <div><label className="block text-sm mb-1">Phone</label><input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" /></div>
          <button type="submit" disabled={loading} className="bg-gold text-black px-6 py-2 rounded-xl flex items-center gap-2"><Save size={16} /> Update Profile</button>
        </form>
        {message && <div className="p-3 bg-gold/10 text-gold rounded">{message}</div>}
      </div>
    </div>
  );
}
