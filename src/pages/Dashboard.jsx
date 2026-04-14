import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, LayoutDashboard, Wallet, History, User, Settings, LogOut, 
  ShieldCheck, Bell, Search, ArrowUpRight, ArrowDownRight, ChevronRight,
  Clock, ExternalLink, Menu, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useAuthStore from '../store/useAuthStore';
import { useSocket } from '../hooks/useSocket';
import { getProfile } from '../api/auth';
import api from '../api/axios';
import RealTimeChart from '../components/RealTimeChart';

// Mock historical data – replace with real API call
const generateHistoricalData = (days) => {
  const data = [];
  const baseValue = 48500;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const value = baseValue + (Math.random() - 0.5) * 5000;
    data.push({ name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value });
  }
  return data;
};

const SidebarItem = ({ icon: Icon, label, to, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[#D4AF37] text-black font-bold shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    <Icon size={20} /><span className="text-sm">{label}</span>
  </Link>
);

export default function Dashboard() {
  const { user, updateBalance, logout } = useAuthStore();
  const location = useLocation();
  useSocket();
  const [balance, setBalance] = useState(user?.availableBalance || 0);
  const [chartData, setChartData] = useState(generateHistoricalData(7));
  const [timeRange, setTimeRange] = useState('1W');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    getProfile().then(res => {
      setBalance(res.data.availableBalance);
      updateBalance(res.data.availableBalance);
    });
    // Fetch historical balance from backend (implement later)
  }, []);

  useEffect(() => {
    let days = 7;
    if (timeRange === '1D') days = 1;
    else if (timeRange === '1W') days = 7;
    else if (timeRange === '1M') days = 30;
    else if (timeRange === '1Y') days = 365;
    setChartData(generateHistoricalData(days));
  }, [timeRange]);

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
      {/* Sidebar for desktop */}
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

      {/* Mobile menu toggle */}
      <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black/80 rounded-lg border border-white/10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile sidebar drawer */}
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

      {/* Main content area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.fullName || 'Investor'}</h1>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>System Status: Encrypted</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gold w-64" />
            </div>
            <button className="p-2 bg-white/5 rounded-full relative">
              <Bell size={20} className="text-gray-400" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-gold/10 to-transparent border border-white/10 rounded-2xl p-6 mb-8">
          <p className="text-gray-400 text-sm">Total Net Equity</p>
          <div className="flex items-baseline gap-4">
            <h2 className="text-4xl font-bold">${balance.toLocaleString()}</h2>
            <span className="text-green-500 text-sm flex items-center gap-1"><ArrowUpRight size={16} /> 14.2%</span>
          </div>
          <div className="flex gap-4 mt-6">
            <button className="bg-gold text-black px-6 py-2 rounded-lg font-semibold">Deposit</button>
            <button className="bg-white/5 border border-white/10 px-6 py-2 rounded-lg">Withdraw</button>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Performance Chart</h3>
            <div className="flex gap-2">
              {['1D', '1W', '1M', '1Y'].map(range => (
                <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1 rounded text-xs font-bold ${timeRange === range ? 'bg-gold text-black' : 'bg-white/5 text-gray-400'}`}>
                  {range}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/><stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="name" tick={{fill: '#888', fontSize: 10}} />
              <YAxis hide />
              <Tooltip contentStyle={{backgroundColor: '#111', border: 'none'}} />
              <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} fill="url(#chartGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Live Market Chart */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-4">Live Market Chart (BTC/USDT)</h3>
          <RealTimeChart symbol="BTCUSDT" height={300} />
        </div>
      </main>
    </div>
  );
}
