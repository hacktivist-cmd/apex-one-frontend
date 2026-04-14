import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Search, ArrowUpRight, ArrowDownRight, Filter, BarChart2, 
  Globe, Layers, ChevronRight, Activity
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';

const INVESTMENT_ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', price: 64231.50, change: '+2.4%', up: true },
  { symbol: 'ETH', name: 'Ethereum', price: 3450.12, change: '+1.1%', up: true },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 175.42, change: '+2.3%', up: true },
  { symbol: 'AAPL', name: 'Apple Inc', price: 192.53, change: '+0.8%', up: true },
  { symbol: 'NVDA', name: 'Nvidia Corp', price: 875.28, change: '+4.2%', up: true },
  { symbol: 'USOIL', name: 'WTI Crude Oil', price: 78.50, change: '-1.2%', up: false },
  { symbol: 'GOOGL', name: 'Alphabet', price: 142.15, change: '+1.1%', up: true },
  { symbol: 'AMZN', name: 'Amazon', price: 178.22, change: '-0.3%', up: false },
  { symbol: 'META', name: 'Meta', price: 485.12, change: '+2.7%', up: true },
  { symbol: 'XAU', name: 'Gold', price: 2165.40, change: '+0.15%', up: true },
];

const MarketTable = ({ assets, onInvest }) => (
  <div className="w-full overflow-hidden rounded-3xl border border-white/5 bg-[#0A0A0A]">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead><tr className="border-b border-white/5 bg-white/[0.02]">
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Asset</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">24h Change</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
        </tr></thead>
        <tbody className="divide-y divide-white/5">
          {assets.map((asset) => (
            <tr key={asset.symbol} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
              <td className="px-6 py-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-[#D4AF37] border border-white/10">{asset.symbol[0]}</div><div><p className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">{asset.name}</p><p className="text-xs text-gray-500 uppercase font-medium">{asset.symbol}</p></div></div></td>
              <td className="px-6 py-5 font-bold text-white tabular-nums">${asset.price.toLocaleString()}</td>
              <td className="px-6 py-5"><span className={`flex items-center gap-1 font-bold text-sm ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>{asset.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}{asset.change}</span></td>
              <td className="px-6 py-5 text-right"><button onClick={() => onInvest(asset)} className="px-4 py-2 bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black transition-all rounded-lg text-xs font-bold uppercase tracking-widest">Invest</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function Markets() {
  const [assets, setAssets] = useState(INVESTMENT_ASSETS);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const setAuthModalOpen = useUIStore(state => state.setAuthModalOpen);

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvest = (asset) => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      // Redirect to dashboard with investment modal or directly invest
      navigate('/dashboard', { state: { investAsset: asset } });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <main className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black mb-1">Market Terminal</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Live Market Data</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search assets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#D4AF37] transition-all w-64" />
            </div>
            <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all"><Filter className="w-5 h-5" /></button>
          </div>
        </header>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex gap-4 border-b border-white/5 w-full lg:w-auto">
              {['Crypto', 'Stocks', 'Commodities', 'Forex'].map(tab => (
                <button key={tab} className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${tab === 'Crypto' ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-white'}`}>{tab}</button>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Live Data</span>
              <span className="flex items-center gap-1.5 text-green-500"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Streaming</span>
            </div>
          </div>
          <MarketTable assets={filteredAssets} onInvest={handleInvest} />
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left"><h3 className="text-2xl font-bold mb-2">Start Your Investment Journey</h3><p className="text-gray-400 max-w-md">Join thousands of investors who are growing their wealth with APEX ONE.</p></div>
            <button onClick={() => setAuthModalOpen(true)} className="px-8 py-4 bg-[#D4AF37] text-black font-black rounded-2xl shadow-[0_10px_30px_rgba(212,175,55,0.2)] flex items-center gap-2 hover:scale-105 transition-transform">Create Free Account <ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </main>
    </div>
  );
}
