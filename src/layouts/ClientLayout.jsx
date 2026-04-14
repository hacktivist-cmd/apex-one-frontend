import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, User, ShieldCheck, Settings, LogOut, Menu, X, UserCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[#D4AF37] text-black font-bold shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    <Icon size={20} /><span className="text-sm">{label}</span>
  </Link>
);

export default function ClientLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        setProfilePicture(res.data.profilePicture);
      } catch (err) {}
    };
    fetchProfile();
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Wallet, label: 'Transactions', path: '/transactions' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: ShieldCheck, label: 'KYC', path: '/kyc' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-black/90 border-r border-white/10 p-6 z-30">
        <Link to="/dashboard" className="flex items-center gap-2 mb-8">
          <img src="/logo.png" alt="APEX ONE" className="h-8 w-auto" />
        </Link>
        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <SidebarItem key={item.path} icon={item.icon} label={item.label} to={item.path} active={isActive(item.path)} />
          ))}
        </nav>
        <div className="pt-6 border-t border-white/10">
          <button onClick={logout} className="flex items-center gap-3 text-red-500 hover:bg-red-500/10 p-3 rounded-xl w-full transition">
            <LogOut size={20} /><span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black/80 rounded-lg border border-white/10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/80 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 bg-black h-full p-6 border-r border-white/10" onClick={e => e.stopPropagation()}>
            <Link to="/dashboard" className="flex items-center gap-2 mb-8" onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/logo.png" alt="APEX ONE" className="h-8 w-auto" />
            </Link>
            <nav className="space-y-2">
              {navItems.map(item => (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isActive(item.path) ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
                  <item.icon size={20} /><span className="text-sm">{item.label}</span>
                </Link>
              ))}
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 text-red-500 hover:bg-red-500/10 p-3 rounded-xl w-full mt-4">
                <LogOut size={20} /><span className="text-sm">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {/* Top bar with profile picture */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-3">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gold" />
            ) : (
              <UserCircle size={40} className="text-gray-500" />
            )}
            <span className="text-sm font-medium">{user?.fullName}</span>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
