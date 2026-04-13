import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Search, ArrowUpRight, ArrowDownRight, Filter, BarChart2, 
  Globe, Layers, LayoutDashboard, PieChart, ArrowRightLeft, Activity, 
  Settings, LogOut, ChevronRight, X, Plus, Minus 
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';
import api from '../api/axios';

const SidebarItem = ({ icon: Icon, label, to, active = false }) => (
  <Link to={to} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[#D4AF37] text-black font-bold shadow-[0_4px_20px_rgba(212,175,55,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    <Icon className="w-5 h-5" /><span className="text-sm">{label}</span>
  </Link>
);

const MarketTable = ({ assets, onTrade }) => (
  <div className="w-full overflow-hidden rounded-3xl border border-white/5 bg-[#0A0A0A]">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead><tr className="border-b border-white/5 bg-white/[0.02]">
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Asset</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">24h Change</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Market Cap</th>
          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
        </tr></thead>
        <tbody className="divide-y divide-white/5">
          {assets.map((asset) => (
            <tr key={asset.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
              <td className="px-6 py-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-[#D4AF37] border border-white/10">{asset.symbol[0]}</div><div><p className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">{asset.name}</p><p className="text-xs text-gray-500 uppercase font-medium">{asset.symbol}</p></div></div></td>
              <td className="px-6 py-5 font-bold text-white tabular-nums">${asset.price.toLocaleString()}</td>
              <td className="px-6 py-5"><span className={`flex items-center gap-1 font-bold text-sm ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>{asset.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}{Math.abs(asset.change).toFixed(2)}%</span></td>
              <td className="px-6 py-5 text-gray-400 text-sm">${(asset.market_cap / 1e9).toFixed(1)}B</td>
              <td className="px-6 py-5 text-right"><button onClick={() => onTrade(asset)} className="px-4 py-2 bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all rounded-lg text-xs font-bold uppercase tracking-widest">Trade</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TradeModal = ({ asset, onClose, onSuccess }) => {
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, updateBalance } = useAuthStore();

  const totalCost = amount ? parseFloat(amount) * asset.price : 0;

  const handleTrade = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (side === 'buy' && totalCost > (user?.availableBalance || 0)) {
      setError('Insufficient balance');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Simulate trade: update balance (deduct for buy, add for sell)
      const balanceChange = side === 'buy' ? -totalCost : totalCost;
      const newBalance = (user?.availableBalance || 0) + balanceChange;
      // Call backend to update balance (admin-like but for demo we call the user balance update)
      await api.patch(`/admin/users/${user?.id}/balance`, { availableBalance: newBalance });
      updateBalance(newBalance);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Trade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Trade {asset.name}</h2>
        <div className="flex gap-2 mb-6">
          <button onClick={() => setSide('buy')} className={`flex-1 py-2 rounded-xl font-bold transition ${side === 'buy' ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400'}`}>Buy</button>
          <button onClick={() => setSide('sell')} className={`flex-1 py-2 rounded-xl font-bold transition ${side === 'sell' ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400'}`}>Sell</button>
        </div>
        <div className="space-y-4">
          <div><label className="text-xs text-gray-500 uppercase tracking-wider">Amount ({asset.symbol})</label><input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" /></div>
          <div><label className="text-xs text-gray-500 uppercase tracking-wider">Total (USD)</label><div className="text-2xl font-bold text-white">${totalCost.toLocaleString()}</div></div>
          {error && <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">{error}</div>}
          <button onClick={handleTrade} disabled={loading} className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-yellow-500 transition disabled:opacity-50">{loading ? 'Processing...' : `Confirm ${side.toUpperCase()}`}</button>
        </div>
      </div>
    </div>
  );
};

export default function Markets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const logout = useAuthStore((state) => state.logout);

  const fetchMarketData = async () => {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false');
      const data = await res.json();
      const formatted = data.map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change: coin.price_change_percentage_24h,
        market_cap: coin.market_cap,
      }));
      setAssets(formatted);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 10000); // update every 10 sec
    return () => clearInterval(interval);
  }, []);

  const handleTrade = (asset) => setSelectedAsset(asset);
  const handleTradeSuccess = () => {
    // Refresh user balance after trade
    window.location.reload(); // simple refresh to update balance in UI
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <aside className="w-64 border-r border-white/5 p-6 hidden lg:flex flex-col gap-8 fixed inset-y-0">
        <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center"><TrendingUp className="text-black w-5 h-5" /></div><span className="text-xl font-bold tracking-tighter text-white">APEX<span className="text-[#D4AF37]">ONE</span></span></div>
        <nav className="flex-1 flex flex-col gap-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
          <SidebarItem icon={Globe} label="Markets" to="/markets" active />
          <SidebarItem icon={PieChart} label="Portfolio" to="/portfolio" />
          <SidebarItem icon={ArrowRightLeft} label="Transactions" to="/dashboard" />
          <SidebarItem icon={Settings} label="Settings" to="/settings" />
        </nav>
        <div className="pt-6 border-t border-white/5"><button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-sm w-full"><LogOut className="w-4 h-4" /> Sign Out</button></div>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div><h1 className="text-3xl font-black mb-1">Market Terminal</h1><p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Live Crypto Prices (auto‑refresh every 10s)</p></div>
          <div className="flex items-center gap-3"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /><input type="text" placeholder="Search assets..." className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#D4AF37] transition-all w-64" /></div><button className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all"><Filter className="w-5 h-5" /></button></div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div></div>
        ) : (
          <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <div className="flex gap-4 border-b border-white/5 w-full lg:w-auto">
                {['Crypto', 'Indices', 'Forex', 'Commodities'].map(tab => <button key={tab} className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${tab === 'Crypto' ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-white'}`}>{tab}</button>)}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-widest"><span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Live Data</span><span className="flex items-center gap-1.5 text-green-500"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Streaming</span></div>
            </div>
            <MarketTable assets={assets} onTrade={handleTrade} />
          </div>
        )}
      </main>

      <AnimatePresence>{selectedAsset && <TradeModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} onSuccess={handleTradeSuccess} />}</AnimatePresence>
    </div>
  );
}
