import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, ShieldCheck, Bell, 
  Settings, LogOut, ChevronRight, Plus, ArrowRightLeft, Activity, Search, 
  LayoutDashboard, PieChart, Clock, ExternalLink, Menu, X, Landmark,
  AlertCircle, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useAuthStore from '../store/useAuthStore';
import { useSocket } from '../hooks/useSocket';
import { getProfile } from '../api/auth';
import api from '../api/axios';
import RealTimeChart from '../components/RealTimeChart';

// Performance chart data (will be replaced with real historical data later)
const PERFORMANCE_DATA = [
  { name: 'Mon', value: 42000 }, { name: 'Tue', value: 43500 }, { name: 'Wed', value: 42800 },
  { name: 'Thu', value: 45000 }, { name: 'Fri', value: 44200 }, { name: 'Sat', value: 46800 }, { name: 'Sun', value: 48500 },
];

// Investment assets (stocks, crypto, commodities)
const INVESTMENT_ASSETS = [
  { symbol: 'TSLA', name: 'Tesla Inc', price: 175.42, change: '+2.3%', up: true, type: 'Stock' },
  { symbol: 'USOIL', name: 'WTI Crude Oil', price: 78.50, change: '-1.2%', up: false, type: 'Commodity' },
  { symbol: 'AAPL', name: 'Apple Inc', price: 192.53, change: '+0.8%', up: true, type: 'Stock' },
  { symbol: 'NVDA', name: 'Nvidia Corp', price: 875.28, change: '+4.2%', up: true, type: 'Stock' },
  { symbol: 'GOOGL', name: 'Alphabet', price: 142.15, change: '+1.1%', up: true, type: 'Stock' },
  { symbol: 'AMZN', name: 'Amazon', price: 178.22, change: '-0.3%', up: false, type: 'Stock' },
  { symbol: 'META', name: 'Meta Platforms', price: 485.12, change: '+2.7%', up: true, type: 'Stock' },
  { symbol: 'BTC', name: 'Bitcoin', price: 64231.50, change: '+2.4%', up: true, type: 'Crypto' },
  { symbol: 'ETH', name: 'Ethereum', price: 3450.12, change: '+1.1%', up: true, type: 'Crypto' },
  { symbol: 'XAU', name: 'Gold', price: 2165.40, change: '+0.15%', up: true, type: 'Commodity' },
];

const DEFAULT_WATCHLIST = [
  { symbol: 'BTC/USD', price: 64231.50, change: '+2.4%', up: true },
  { symbol: 'ETH/USD', price: 3450.12, change: '+1.1%', up: true },
  { symbol: 'TSLA', price: 175.42, change: '+2.3%', up: true },
];

// ---------- Modals (Deposit, Withdraw, Trade, Discover) ----------
// (These are the same as before, but I'll include them for completeness)
const DepositModal = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [cryptoType, setCryptoType] = useState('BTC');
  const [cryptoTxId, setCryptoTxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      await api.post('/deposit/request', { amount: parseFloat(amount), cryptoType, cryptoTxId });
      setSuccess('Deposit request submitted. Admin will approve shortly.');
      setTimeout(() => { onSuccess(); onClose(); }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Deposit Funds</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-xs text-gray-500 uppercase tracking-wider">Amount (USD)</label><input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]" /></div>
          <div><label className="text-xs text-gray-500 uppercase tracking-wider">Crypto Type</label><select value={cryptoType} onChange={(e) => setCryptoType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"><option>BTC</option><option>ETH</option><option>USDT</option></select></div>
          <div><label className="text-xs text-gray-500 uppercase tracking-wider">Transaction ID (optional)</label><input type="text" value={cryptoTxId} onChange={(e) => setCryptoTxId(e.target.value)} placeholder="Tx hash" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
          {error && <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">{error}</div>}
          {success && <div className="p-2 bg-green-500/10 border border-green-500/20 rounded text-green-500 text-sm">{success}</div>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-yellow-500 transition disabled:opacity-50">{loading ? 'Submitting...' : 'Request Deposit'}</button>
        </form>
      </div>
    </div>
  );
};

const WithdrawalModal = ({ isOpen, onClose, onSuccess, balance }) => {
  const [amount, setAmount] = useState('');
  const [destinationAddr, setDestinationAddr] = useState('');
  const [cryptoType, setCryptoType] = useState('BTC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!amount || parseFloat(amount) <= 0) return setError('Invalid amount');
    if (parseFloat(amount) > balance) return setError('Insufficient balance');
    setLoading(true);
    try {
      await api.post('/withdrawals', { amount: parseFloat(amount), destinationAddr, cryptoType });
      setSuccess('Withdrawal request submitted. Admin will review.');
      setTimeout(() => { onSuccess(); onClose(); }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Withdraw Funds</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-xs text-gray-500 uppercase tracking-wider">Amount (USD)</label><input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
          <div><label className="text-xs text-gray-500 uppercase tracking-wider">Crypto Type</label><select value={cryptoType} onChange={(e) => setCryptoType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"><option>BTC</option><option>ETH</option><option>USDT</option></select></div>
          <div><label className="text-xs text-gray-500 uppercase tracking-wider">Destination Address</label><input type="text" value={destinationAddr} onChange={(e) => setDestinationAddr(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
          {error && <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">{error}</div>}
          {success && <div className="p-2 bg-green-500/10 border border-green-500/20 rounded text-green-500 text-sm">{success}</div>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-yellow-500 transition disabled:opacity-50">{loading ? 'Submitting...' : 'Request Withdrawal'}</button>
        </form>
      </div>
    </div>
  );
};

const TradeModal = ({ asset, onClose, onSuccess, userBalance }) => {
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateBalance } = useAuthStore();

  const totalCost = amount ? parseFloat(amount) * asset.price : 0;
  const handleTrade = async () => {
    if (!amount || parseFloat(amount) <= 0) return setError('Invalid amount');
    if (side === 'buy' && totalCost > userBalance) return setError('Insufficient balance');
    setLoading(true);
    try {
      await api.post('/trade', {
        symbol: asset.symbol,
        side,
        quantity: parseFloat(amount),
        stopLossPercent: stopLoss ? parseFloat(stopLoss) : null,
        takeProfitPercent: takeProfit ? parseFloat(takeProfit) : null,
      });
      const newBalance = side === 'buy' ? userBalance - totalCost : userBalance + totalCost;
      const userId = JSON.parse(localStorage.getItem('auth-storage'))?.state?.user?.id;
      await api.patch(`/admin/users/${userId}/balance`, { availableBalance: newBalance });
      updateBalance(newBalance);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Trade failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Trade {asset.symbol}</h2>
        <div className="flex gap-2 mb-6">
          <button onClick={() => setSide('buy')} className={`flex-1 py-2 rounded-xl font-bold transition ${side === 'buy' ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400'}`}>Buy</button>
          <button onClick={() => setSide('sell')} className={`flex-1 py-2 rounded-xl font-bold transition ${side === 'sell' ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400'}`}>Sell</button>
        </div>
        <div className="space-y-4">
          <div><label className="text-xs text-gray-500 uppercase tracking-wider">Shares / Amount</label><input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 uppercase tracking-wider">Stop Loss (%)</label><input type="number" step="0.1" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} placeholder="e.g., 5" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2" /></div>
            <div><label className="text-xs text-gray-500 uppercase tracking-wider">Take Profit (%)</label><input type="number" step="0.1" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} placeholder="e.g., 10" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2" /></div>
          </div>
          <div><label className="text-xs text-gray-500 uppercase tracking-wider">Total (USD)</label><div className="text-2xl font-bold text-white">${totalCost.toLocaleString()}</div></div>
          {error && <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">{error}</div>}
          <button onClick={handleTrade} disabled={loading} className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-yellow-500 transition disabled:opacity-50">{loading ? 'Processing...' : `Confirm ${side.toUpperCase()}`}</button>
        </div>
      </div>
    </div>
  );
};

const DiscoverAssetsModal = ({ isOpen, onClose, onAddToWatchlist }) => {
  const [search, setSearch] = useState('');
  const filteredAssets = INVESTMENT_ASSETS.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.symbol.toLowerCase().includes(search.toLowerCase()));
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-2xl w-full max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Discover More Assets</h2>
        <input type="text" placeholder="Search stocks, crypto, commodities..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredAssets.map(asset => (
            <div key={asset.symbol} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
              <div><p className="font-bold">{asset.name} ({asset.symbol})</p><p className="text-xs text-gray-500">${asset.price.toLocaleString()}</p></div>
              <button onClick={() => { onAddToWatchlist(asset); onClose(); }} className="px-3 py-1 bg-[#D4AF37] text-black rounded-lg text-xs font-bold">Add</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------- Main Dashboard Component ----------
export default function Dashboard() {
  const { user, updateBalance, logout } = useAuthStore();
  const navigate = useNavigate();
  useSocket();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [balance, setBalance] = useState(user?.availableBalance || 0);
  const [watchlist, setWatchlist] = useState(DEFAULT_WATCHLIST);
  const [searchTerm, setSearchTerm] = useState('');
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [discoverModal, setDiscoverModal] = useState(false);
  const [tradeAsset, setTradeAsset] = useState(null);
  const [investmentPlans] = useState(INVESTMENT_ASSETS.slice(0, 6));
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile and transactions
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const profileRes = await getProfile();
        setBalance(profileRes.data.availableBalance);
        updateBalance(profileRes.data.availableBalance);
        const txRes = await api.get('/withdrawals');
        setTransactions(txRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredWatchlist = watchlist.filter(item => 
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToWatchlist = (asset) => {
    const exists = watchlist.some(w => w.symbol === asset.symbol);
    if (!exists) {
      setWatchlist([...watchlist, { symbol: asset.symbol, price: asset.price, change: asset.change, up: asset.up }]);
    }
  };

  const handleTradeSuccess = () => {
    getProfile().then(res => setBalance(res.data.availableBalance));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarItem = ({ icon: Icon, label, to, active = false }) => (
    <Link to={to} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[#D4AF37] text-black font-bold shadow-[0_4px_20px_rgba(212,175,55,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
      <Icon className="w-5 h-5" /><span className="text-sm">{label}</span>
    </Link>
  );

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar - responsive */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-black border-r border-white/10 z-50 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static flex flex-col p-6 gap-8`}>
        <div className="flex items-center justify-between lg:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center"><TrendingUp className="text-black w-5 h-5" /></div>
            <span className="text-xl font-bold tracking-tighter text-white">APEX<span className="text-[#D4AF37]">ONE</span></span>
          </div>
          <button className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active />
          <SidebarItem icon={Globe} label="Markets" to="/markets" />
          <SidebarItem icon={PieChart} label="Portfolio" to="/portfolio" />
          <SidebarItem icon={Settings} label="Settings" to="/settings" />
        </nav>
        <div className="pt-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-sm w-full">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 lg:p-12">
        {/* Mobile header with hamburger */}
        <header className="flex items-center justify-between mb-6 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-white/5">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center"><TrendingUp className="text-black w-5 h-5" /></div>
            <span className="text-xl font-bold tracking-tighter">APEX<span className="text-[#D4AF37]">ONE</span></span>
          </div>
          <button className="p-2 bg-white/5 rounded-full"><Bell size={20} className="text-gray-400" /></button>
        </header>

        {/* Desktop header (unchanged) */}
        <div className="hidden lg:flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black mb-1">Welcome back, {user?.fullName || 'Investor'}</h1>
            <div className="flex items-center gap-4 text-xs text-gray-500 uppercase tracking-widest font-bold">
              <span className="flex items-center gap-1.5 text-green-500"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> System Status: Encrypted</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Identity Verified</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search watchlist..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#D4AF37] transition-all w-64" />
            </div>
            <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 relative"><Bell className="w-5 h-5 text-gray-400" /><div className="absolute top-2 right-2 w-2 h-2 bg-[#D4AF37] rounded-full" /></button>
          </div>
        </div>

        {/* Balance cards, chart, watchlist, investment plans (same as before but using real balance) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8"><div className="flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1 rounded-full"><div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" /><span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-tighter">Pulse Active</span></div></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-4">Total Net Equity</p>
            <div className="flex items-baseline gap-4 mb-8"><h2 className="text-5xl md:text-6xl font-black tracking-tight text-white">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2><div className="flex items-center text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-lg text-sm"><ArrowUpRight className="w-4 h-4" /> 14.2%</div></div>
            <div className="flex gap-4"><button onClick={() => setDepositModal(true)} className="flex-1 py-4 bg-[#D4AF37] text-black font-black rounded-2xl shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:scale-105 transition-transform flex items-center justify-center gap-2"><Plus className="w-5 h-5" /> Deposit</button><button onClick={() => setWithdrawModal(true)} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"><ArrowRightLeft className="w-5 h-5" /> Withdraw</button></div>
          </div>
          <div className="grid grid-cols-1 gap-4"><StatCard title="Total Profit" value="+$8,241.00" change="+21.4%" icon={TrendingUp} /><StatCard title="Locked Margin" value="$12,000.00" change="Standard" icon={Wallet} up={true} /></div>
        </section>

        <div className="glass-card p-6 mb-8"><h3 className="text-xl font-bold mb-4">Live Market Chart (BTC/USDT)</h3><RealTimeChart symbol="BTCUSDT" height={300} /></div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-6"><div className="flex items-center justify-between mb-8"><div><h4 className="font-bold text-lg">Performance Chart</h4><p className="text-xs text-gray-500">Live account equity history</p></div><div className="flex gap-2">{['1D', '1W', '1M', '1Y'].map(t => <button key={t} className={`px-3 py-1 rounded-lg text-[10px] font-bold ${t === '1W' ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}>{t}</button>)}</div></div><div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={PERFORMANCE_DATA}><defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/><stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} dy={10} /><YAxis hide /><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" animationDuration={2000} /></AreaChart></ResponsiveContainer></div></div>
          <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6"><div className="flex items-center justify-between mb-6"><h4 className="font-bold">Watchlist</h4><button onClick={() => setDiscoverModal(true)} className="text-xs text-[#D4AF37] font-bold flex items-center gap-1">Edit <ChevronRight className="w-3 h-3" /></button></div><div className="space-y-4">{filteredWatchlist.map((item, i) => (<div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all group"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{item.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}</div><div><p className="text-sm font-bold">{item.symbol}</p><p className="text-[10px] text-gray-500 uppercase tracking-tighter">Live Feed</p></div></div><div className="text-right"><p className="text-sm font-black text-white">${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}</p><p className={`text-[10px] font-bold ${item.up ? 'text-green-500' : 'text-red-500'}`}>{item.change}</p></div></div>))}</div><button onClick={() => setDiscoverModal(true)} className="w-full mt-6 py-3 border border-white/5 rounded-xl text-xs text-gray-500 font-bold hover:bg-white/5 transition-all">Discover More Assets</button></div>
        </section>

        <section className="mb-8"><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Landmark className="text-[#D4AF37]" size={20} /> Investment Plans</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{investmentPlans.map(asset => (<div key={asset.symbol} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 hover:border-[#D4AF37]/30 transition-all"><div className="flex justify-between items-start mb-2"><div><p className="font-bold">{asset.name}</p><p className="text-xs text-gray-500">{asset.symbol}</p></div><span className={`text-xs font-bold px-2 py-0.5 rounded ${asset.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{asset.change}</span></div><div className="flex justify-between items-end mt-4"><p className="text-xl font-bold text-white">${asset.price.toLocaleString()}</p><button onClick={() => setTradeAsset(asset)} className="px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black rounded-lg text-xs font-bold transition-all">Trade</button></div></div>))}</div></section>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4"><div className="flex items-center gap-6 text-[10px] text-gray-600 font-bold uppercase tracking-widest"><span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Last sync: just now</span><span className="flex items-center gap-1.5 text-[#D4AF37]"><ExternalLink className="w-3 h-3" /> View Blockchain Tx</span></div><p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Liquidity Provider: APEX Global LP</p></div>
      </main>

      <AnimatePresence>
        {depositModal && <DepositModal isOpen={depositModal} onClose={() => setDepositModal(false)} onSuccess={() => { getProfile().then(res => setBalance(res.data.availableBalance)); }} />}
        {withdrawModal && <WithdrawalModal isOpen={withdrawModal} onClose={() => setWithdrawModal(false)} onSuccess={() => { getProfile().then(res => setBalance(res.data.availableBalance)); }} balance={balance} />}
        {discoverModal && <DiscoverAssetsModal isOpen={discoverModal} onClose={() => setDiscoverModal(false)} onAddToWatchlist={handleAddToWatchlist} />}
        {tradeAsset && <TradeModal asset={tradeAsset} onClose={() => setTradeAsset(null)} onSuccess={handleTradeSuccess} userBalance={balance} />}
      </AnimatePresence>
    </div>
  );
}
