import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, LayoutDashboard, Globe, PieChart, ArrowRightLeft, Activity, Settings, LogOut, Wallet } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { getProfile } from '../api/auth';

const SidebarItem = ({ icon: Icon, label, to, active = false }) => (
  <Link to={to} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[#D4AF37] text-black font-bold shadow-[0_4px_20px_rgba(212,175,55,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    <Icon className="w-5 h-5" /><span className="text-sm">{label}</span>
  </Link>
);

export default function Portfolio() {
  const { user, logout } = useAuthStore();
  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState([
    { asset: 'Bitcoin (BTC)', amount: 0.25, value: 16057.88, change: '+5.2%' },
    { asset: 'Ethereum (ETH)', amount: 2.5, value: 8625.30, change: '+2.1%' },
    { asset: 'Tesla (TSLA)', amount: 15, value: 2631.30, change: '-1.2%' },
  ]);

  useEffect(() => {
    getProfile().then(res => setBalance(res.data.availableBalance));
  }, []);

  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <aside className="w-64 border-r border-white/5 p-6 hidden lg:flex flex-col gap-8 fixed inset-y-0">
        <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center"><TrendingUp className="text-black w-5 h-5" /></div><span className="text-xl font-bold tracking-tighter text-white">APEX<span className="text-[#D4AF37]">ONE</span></span></div>
        <nav className="flex-1 flex flex-col gap-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
          <SidebarItem icon={Globe} label="Markets" to="/markets" />
          <SidebarItem icon={PieChart} label="Portfolio" to="/portfolio" active />
          <SidebarItem icon={ArrowRightLeft} label="Transactions" to="/dashboard" />
          <SidebarItem icon={Settings} label="Settings" to="/settings" />
        </nav>
        <div className="pt-6 border-t border-white/5"><button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-sm w-full"><LogOut className="w-4 h-4" /> Sign Out</button></div>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12">
        <h1 className="text-3xl font-black mb-2">Portfolio Overview</h1>
        <p className="text-gray-500 mb-8">Track your holdings and performance.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">Holdings</h2>
            <div className="space-y-4">
              {holdings.map((h, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                  <div><p className="font-bold">{h.asset}</p><p className="text-xs text-gray-500">{h.amount} units</p></div>
                  <div className="text-right"><p className="font-bold">${h.value.toLocaleString()}</p><p className={`text-xs ${h.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{h.change}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            <div className="space-y-4">
              <div><p className="text-gray-500 text-sm">Total Portfolio Value</p><p className="text-2xl font-bold">${totalValue.toLocaleString()}</p></div>
              <div><p className="text-gray-500 text-sm">Available Cash</p><p className="text-2xl font-bold">${balance.toLocaleString()}</p></div>
              <div><p className="text-gray-500 text-sm">Total Equity</p><p className="text-2xl font-bold text-[#D4AF37]">${(totalValue + balance).toLocaleString()}</p></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
