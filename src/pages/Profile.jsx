import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, User, Mail, Phone, Upload, Shield, CheckCircle, AlertCircle, Save } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

export default function Profile() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', phone: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ email: user.email, phone: user.phone || '' });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/user/profile', formData);
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('profilePicture', file);
    setLoading(true);
    try {
      await api.post('/user/upload-picture', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Profile picture uploaded');
    } catch (err) {
      setMessage('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKycUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('kycDocument', file);
    setLoading(true);
    try {
      await api.post('/user/kyc', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('KYC document submitted for review');
    } catch (err) {
      setMessage('KYC submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black mb-6">Profile & KYC</h1>
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-[#0A0A0A] p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><User size={20} /> Profile Picture</h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center text-3xl font-bold">{user?.fullName?.charAt(0)}</div>
              <label className="cursor-pointer bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10"><Upload size={16} className="inline mr-2" /> Upload<input type="file" accept="image/*" onChange={handleUploadPicture} className="hidden" /></label>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-[#0A0A0A] p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Mail size={20} /> Contact Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-1">Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" /></div>
              <div><label className="block text-sm text-gray-400 mb-1">Phone Number</label><input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" /></div>
              <button type="submit" disabled={loading} className="bg-gold text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2"><Save size={16} /> Update Profile</button>
            </form>
          </div>

          {/* KYC Verification */}
          <div className="bg-[#0A0A0A] p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Shield size={20} /> KYC Verification</h2>
            <p className="text-gray-400 mb-4">Upload a government-issued ID or passport for verification.</p>
            <label className="cursor-pointer bg-white/5 px-4 py-2 rounded-lg inline-block hover:bg-white/10"><Upload size={16} className="inline mr-2" /> Upload Document<input type="file" accept="image/*,application/pdf" onChange={handleKycUpload} className="hidden" /></label>
            {user?.kycStatus === 'VERIFIED' && <div className="mt-4 text-green-500 flex items-center gap-2"><CheckCircle size={16} /> Verified</div>}
            {user?.kycStatus === 'PENDING' && <div className="mt-4 text-yellow-500 flex items-center gap-2"><AlertCircle size={16} /> Pending review</div>}
          </div>

          {message && <div className="p-3 bg-gold/10 border border-gold/20 rounded text-gold">{message}</div>}
        </div>
      </div>
    </div>
  );
}
