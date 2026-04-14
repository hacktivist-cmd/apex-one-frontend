import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, User, ShieldCheck, Settings, LogOut, Menu, X } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { getProfile } from '../api/auth';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[#D4AF37] text-black font-bold shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    <Icon size={20} /><span className="text-sm">{label}</span>
  </Link>
);

export default function ClientLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState('');

  useEffect(() => {
    getProfile().then(res => setProfilePic(res.data.profilePicture || '')).catch(console.error);
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
        <div className="flex items-center gap-3 mb-6 p-2 bg-white/5 rounded-xl">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">{user?.fullName?.charAt(0)}</div>
          )}
          <div className="flex-1"><p className="text-sm font-semibold">{user?.fullName}</p><p className="text-[10px] text-gray-500">{user?.email}</p></div>
        </div>
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
            <div className="flex items-center gap-3 mb-6 p-2 bg-white/5 rounded-xl">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">{user?.fullName?.charAt(0)}</div>
              )}
              <div className="flex-1"><p className="text-sm font-semibold">{user?.fullName}</p><p className="text-[10px] text-gray-500">{user?.email}</p></div>
            </div>
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
        <Outlet />
      </main>
    </div>
  );
}
