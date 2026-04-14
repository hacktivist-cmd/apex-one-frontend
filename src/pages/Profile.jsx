import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Upload, Save, Camera } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

export default function Profile() {
  const { user, updateBalance } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', phone: '' });
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
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
    } catch (err) { setError('Update failed'); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('profilePicture', file);
    setLoading(true);
    try {
      const res = await api.post('/user/upload-picture', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfilePicture(res.data.path);
      setMessage('Profile picture uploaded');
    } catch (err) { setError('Upload failed'); }
    finally { setLoading(false); }
  };

  const imageUrl = profilePicture ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${profilePicture}` : null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {imageUrl ? (
              <img src={imageUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-gold" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center text-3xl font-bold">{user?.fullName?.charAt(0)}</div>
            )}
            <label className="absolute bottom-0 right-0 cursor-pointer bg-gold text-black p-1 rounded-full">
              <Camera size={16} />
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>
          <p className="text-sm text-gray-400">Click the camera icon to change profile picture</p>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div><label className="block text-sm mb-1">Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" /></div>
          <div><label className="block text-sm mb-1">Phone</label><input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" /></div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {message && <div className="text-green-500 text-sm">{message}</div>}
          <button type="submit" disabled={loading} className="bg-gold text-black px-6 py-2 rounded-xl flex items-center gap-2"><Save size={16} /> Update Profile</button>
        </form>
      </div>
    </div>
  );
}
