import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, User, Lock, Mail, Shield, LayoutDashboard, Globe, PieChart, ArrowRightLeft, Activity, Settings as SettingsIcon, LogOut, ChevronRight, CheckCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';
import api from '../api/axios';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${
    active ? 'bg-[#D4AF37] text-black font-bold shadow-[0_4px_20px_rgba(212,175,55,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'
  }`}>
    <Icon className="w-5 h-5" />
    <span className="text-sm">{label}</span>
  </div>
);

export default function Settings() {
  const { user, logout, updateBalance } = useAuthStore();
  const setView = useUIStore((state) => state.setView);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/user/change-password', { oldPassword, newPassword });
      setMessage('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); setView('LANDING'); };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <aside className="w-64 border-r border-white/5 p-6 hidden lg:flex flex-col gap-8 fixed inset-y-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center"><TrendingUp className="text-black w-5 h-5" /></div>
          <span className="text-xl font-bold tracking-tighter text-white">APEX<span className="text-[#D4AF37]">ONE</span></span>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" onClick={() => setView('DASHBOARD')} />
          <SidebarItem icon={Globe} label="Markets" onClick={() => setView('MARKETS')} />
          <SidebarItem icon={PieChart} label="Portfolio" onClick={() => setView('DASHBOARD')} />
          <SidebarItem icon={ArrowRightLeft} label="Transactions" onClick={() => setView('DASHBOARD')} />
          <SidebarItem icon={Activity} label="About" onClick={() => setView('ABOUT')} />
          <SidebarItem icon={SettingsIcon} label="Settings" active onClick={() => {}} />
        </nav>
        <div className="pt-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-sm w-full">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-black mb-2">Account Settings</h1>
          <p className="text-gray-500 mb-8">Manage your profile, security, and preferences.</p>

          <div className="space-y-8">
            {/* Profile Section */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="text-[#D4AF37]" size={24} />
                <h2 className="text-xl font-bold">Profile Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Full Name</label>
                  <p className="text-white text-lg font-medium">{user?.fullName || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Email Address</label>
                  <p className="text-white text-lg font-medium">{user?.email || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Account Type</label>
                  <p className="text-white text-lg font-medium">{user?.role || 'USER'}</p>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="text-[#D4AF37]" size={24} />
                <h2 className="text-xl font-bold">Security</h2>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Current Password</label>
                  <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" />
                </div>
                {message && <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 flex items-center gap-2"><CheckCircle size={16} /> {message}</div>}
                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">{error}</div>}
                <button type="submit" disabled={loading} className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-yellow-500 transition disabled:opacity-50">
                  {loading ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
