import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, ShieldCheck, Bell, 
  Plus, ArrowRightLeft, Activity, Search, Landmark, Clock, ExternalLink,
  X, ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useAuthStore from '../store/useAuthStore';
import { useSocket } from '../hooks/useSocket';
import { getProfile } from '../api/auth';
import api from '../api/axios';
import RealTimeChart from '../components/RealTimeChart';

const PERFORMANCE_DATA = [
  { name: 'Mon', value: 42000 }, { name: 'Tue', value: 43500 }, { name: 'Wed', value: 42800 },
  { name: 'Thu', value: 45000 }, { name: 'Fri', value: 44200 }, { name: 'Sat', value: 46800 }, { name: 'Sun', value: 48500 },
];

const INVESTMENT_ASSETS = [
  { symbol: 'TSLA', name: 'Tesla Inc', price: 175.42, change: '+2.3%', up: true },
  { symbol: 'USOIL', name: 'WTI Crude Oil', price: 78.50, change: '-1.2%', up: false },
  { symbol: 'AAPL', name: 'Apple Inc', price: 192.53, change: '+0.8%', up: true },
  { symbol: 'NVDA', name: 'Nvidia Corp', price: 875.28, change: '+4.2%', up: true },
  { symbol: 'GOOGL', name: 'Alphabet', price: 142.15, change: '+1.1%', up: true },
  { symbol: 'AMZN', name: 'Amazon', price: 178.22, change: '-0.3%', up: false },
];

const DEFAULT_WATCHLIST = [
  { symbol: 'BTC/USD', price: 64231.50, change: '+2.4%', up: true },
  { symbol: 'ETH/USD', price: 3450.12, change: '+1.1%', up: true },
  { symbol: 'TSLA', price: 175.42, change: '+2.3%', up: true },
];

// ---------- MODALS ----------
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

// ---------- MAIN DASHBOARD ----------
export default function Dashboard() {
  const { user, updateBalance, logout } = useAuthStore();
  useSocket();
  const [balance, setBalance] = useState(user?.availableBalance || 0);
  const [watchlist, setWatchlist] = useState(DEFAULT_WATCHLIST);
  const [searchTerm, setSearchTerm] = useState('');
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [discoverModal, setDiscoverModal] = useState(false);
  const [tradeAsset, setTradeAsset] = useState(null);
  const [timeRange, setTimeRange] = useState('1W');

  useEffect(() => {
    getProfile().then(res => {
      setBalance(res.data.availableBalance);
      updateBalance(res.data.availableBalance);
    });
  }, []);

  const filteredWatchlist = watchlist.filter(item => item.symbol.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddToWatchlist = (asset) => {
    if (!watchlist.some(w => w.symbol === asset.symbol)) {
      setWatchlist([...watchlist, { symbol: asset.symbol, price: asset.price, change: asset.change, up: asset.up }]);
    }
  };

  const handleTradeSuccess = () => getProfile().then(res => setBalance(res.data.availableBalance));

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user?.fullName}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search watchlist..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gold w-64" />
          </div>
          <button className="p-2 bg-white/5 rounded-full relative"><Bell size={20} className="text-gray-400" /></button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gold/10 to-transparent border border-white/10 rounded-2xl p-6 mb-8">
        <p className="text-gray-400 text-sm">Total Net Equity</p>
        <div className="flex items-baseline gap-4">
          <h2 className="text-4xl font-bold">${balance.toLocaleString()}</h2>
          <span className="text-green-500 text-sm flex items-center gap-1"><ArrowUpRight size={16} /> 14.2%</span>
        </div>
        <div className="flex gap-4 mt-6">
          <button onClick={() => setDepositModal(true)} className="bg-gold text-black px-6 py-2 rounded-lg font-semibold">Deposit</button>
          <button onClick={() => setWithdrawModal(true)} className="bg-white/5 border border-white/10 px-6 py-2 rounded-lg">Withdraw</button>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Performance Chart</h3>
          <div className="flex gap-2">
            {['1D', '1W', '1M', '1Y'].map(range => (
              <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1 rounded text-xs font-bold ${timeRange === range ? 'bg-gold text-black' : 'bg-white/5 text-gray-400'}`}>{range}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={PERFORMANCE_DATA}>
            <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/><stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis dataKey="name" tick={{fill: '#888', fontSize: 10}} />
            <YAxis hide />
            <Tooltip contentStyle={{backgroundColor: '#111', border: 'none'}} />
            <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} fill="url(#chartGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 mb-8">
        <h3 className="font-bold mb-4">Live Market Chart (BTC/USDT)</h3>
        <RealTimeChart symbol="BTCUSDT" height={300} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4"><h3 className="font-bold">Watchlist</h3><button onClick={() => setDiscoverModal(true)} className="text-gold text-xs">Edit</button></div>
          <div className="space-y-3">
            {filteredWatchlist.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{item.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}</div><div><p className="font-bold text-sm">{item.symbol}</p><p className="text-[10px] text-gray-500">Live</p></div></div>
                <div className="text-right"><p className="font-bold">${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}</p><p className={`text-xs ${item.up ? 'text-green-500' : 'text-red-500'}`}>{item.change}</p></div>
              </div>
            ))}
          </div>
          <button onClick={() => setDiscoverModal(true)} className="w-full mt-4 py-2 border border-white/5 rounded-lg text-xs text-gray-500 hover:bg-white/5">Discover More Assets</button>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Landmark size={16} className="text-gold" /> Investment Plans</h3>
          <div className="grid grid-cols-1 gap-3">
            {INVESTMENT_ASSETS.slice(0, 4).map(asset => (
              <div key={asset.symbol} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <div><p className="font-bold text-sm">{asset.name}</p><p className="text-xs text-gray-500">{asset.symbol}</p></div>
                <div className="text-right"><p className="font-bold">${asset.price.toLocaleString()}</p><p className={`text-xs ${asset.up ? 'text-green-500' : 'text-red-500'}`}>{asset.change}</p></div>
                <button onClick={() => setTradeAsset(asset)} className="bg-gold/20 text-gold px-3 py-1 rounded text-xs">Trade</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-gray-600 border-t border-white/5 pt-4 mt-4">
        <span>Last sync: just now</span><span>Liquidity Provider: APEX Global LP</span>
      </div>

      <AnimatePresence>
        {depositModal && <DepositModal isOpen={depositModal} onClose={() => setDepositModal(false)} onSuccess={() => getProfile().then(res => setBalance(res.data.availableBalance))} />}
        {withdrawModal && <WithdrawalModal isOpen={withdrawModal} onClose={() => setWithdrawModal(false)} onSuccess={() => getProfile().then(res => setBalance(res.data.availableBalance))} balance={balance} />}
        {discoverModal && <DiscoverAssetsModal isOpen={discoverModal} onClose={() => setDiscoverModal(false)} onAddToWatchlist={handleAddToWatchlist} />}
        {tradeAsset && <TradeModal asset={tradeAsset} onClose={() => setTradeAsset(null)} onSuccess={handleTradeSuccess} userBalance={balance} />}
      </AnimatePresence>
    </>
  );
}
