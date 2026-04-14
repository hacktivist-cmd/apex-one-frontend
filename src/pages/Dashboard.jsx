import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, ShieldCheck, Bell, 
  Plus, ArrowRightLeft, Activity, Search, Landmark, Clock, ExternalLink,
  X, ChevronRight, CreditCard, Bitcoin, Send, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useAuthStore from '../store/useAuthStore';
import { useSocket } from '../hooks/useSocket';
import { getProfile } from '../api/auth';
import api from '../api/axios';
import RealTimeChart from '../components/RealTimeChart';

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

// ---------- DEPOSIT MODAL ----------
const DepositModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState('method');
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const paymentMethods = [
    { id: 'btc', name: 'Bitcoin', icon: Bitcoin, details: 'BTC Address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
    { id: 'cashapp', name: 'Cash App', icon: CreditCard, details: 'Cash App Tag: $APEXONE' },
    { id: 'bank', name: 'Bank Transfer', icon: Send, details: 'Bank: Chase, Account: 123456789, Routing: 021000021' },
    { id: 'support', name: 'Contact Support', icon: AlertCircle, details: 'Please contact support@apexone.com to arrange large deposits.' },
  ];

  const selectedMethod = paymentMethods.find(m => m.id === method);
  const handleMethodSelect = (m) => { setMethod(m); setStep('details'); };
  const handleProceed = () => setStep('confirm');
  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) { setError('Enter amount'); return; }
    setLoading(true);
    try {
      await api.post('/deposit/request', { amount: parseFloat(amount), cryptoType: method.toUpperCase(), cryptoTxId: 'manual' });
      setSuccess('Deposit request submitted. Admin will review.');
      setTimeout(() => { onSuccess(); onClose(); setStep('method'); setAmount(''); setMethod(''); }, 2000);
    } catch (err) { setError(err.response?.data?.message || 'Request failed'); }
    finally { setLoading(false); }
  };
  const reset = () => { setStep('method'); setMethod(''); setAmount(''); setError(''); setSuccess(''); };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={() => { reset(); onClose(); }} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Deposit Funds</h2>
        {step === 'method' && (
          <div className="space-y-3">
            {paymentMethods.map(m => (
              <button key={m.id} onClick={() => handleMethodSelect(m.id)} className="w-full flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition">
                <m.icon size={24} className="text-gold" /><span className="font-medium">{m.name}</span><ChevronRight size={18} className="ml-auto text-gray-500" />
              </button>
            ))}
          </div>
        )}
        {step === 'details' && selectedMethod && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl"><p className="text-sm text-gray-400 mb-2">Send funds to:</p><p className="font-mono text-sm break-all">{selectedMethod.details}</p></div>
            <button onClick={handleProceed} className="w-full bg-gold text-black py-3 rounded-xl font-bold">I have sent the payment</button>
            <button onClick={() => setStep('method')} className="w-full bg-white/5 py-2 rounded-xl text-sm">Back</button>
          </div>
        )}
        {step === 'confirm' && (
          <div className="space-y-4">
            <input type="number" placeholder="Amount (USD)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">{success}</div>}
            <button onClick={handleConfirm} disabled={loading} className="w-full bg-gold text-black py-3 rounded-xl font-bold">{loading ? 'Submitting...' : 'Confirm Deposit'}</button>
            <button onClick={() => setStep('details')} className="w-full bg-white/5 py-2 rounded-xl text-sm">Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- WITHDRAWAL MODAL ----------
const WithdrawalModal = ({ isOpen, onClose, onSuccess, balance }) => {
  const [amount, setAmount] = useState('');
  const [destinationAddr, setDestinationAddr] = useState('');
  const [cryptoType, setCryptoType] = useState('BTC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return setError('Invalid amount');
    if (parseFloat(amount) > balance) return setError('Insufficient balance');
    setLoading(true);
    try {
      await api.post('/withdrawals', { amount: parseFloat(amount), destinationAddr, cryptoType });
      setSuccess('Withdrawal request submitted.');
      setTimeout(() => { onSuccess(); onClose(); }, 2000);
    } catch (err) { setError(err.response?.data?.message || 'Request failed'); }
    finally { setLoading(false); }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Withdraw Funds</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" required />
          <select value={cryptoType} onChange={e => setCryptoType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3"><option>BTC</option><option>ETH</option><option>USDT</option></select>
          <input type="text" placeholder="Destination Address" value={destinationAddr} onChange={e => setDestinationAddr(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" required />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <button type="submit" disabled={loading} className="w-full bg-gold text-black py-3 rounded-xl font-bold">{loading ? 'Submitting...' : 'Request Withdrawal'}</button>
        </form>
      </div>
    </div>
  );
};

// ---------- DISCOVER ASSETS MODAL ----------
const DiscoverAssetsModal = ({ isOpen, onClose, onAddToWatchlist }) => {
  const [search, setSearch] = useState('');
  const filteredAssets = INVESTMENT_ASSETS.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.symbol.toLowerCase().includes(search.toLowerCase()));
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-2xl w-full max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Discover More Assets</h2>
        <input type="text" placeholder="Search stocks..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredAssets.map(asset => (
            <div key={asset.symbol} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
              <div><p className="font-bold">{asset.name} ({asset.symbol})</p><p className="text-xs text-gray-500">${asset.price.toLocaleString()}</p></div>
              <button onClick={() => { onAddToWatchlist(asset); onClose(); }} className="px-3 py-1 bg-gold text-black rounded-lg text-xs font-bold">Add</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------- INVEST MODAL (replaces Trade) ----------
const InvestModal = ({ asset, onClose, onSuccess, userBalance }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateBalance } = useAuthStore();
  const totalCost = amount ? parseFloat(amount) * asset.price : 0;
  const handleInvest = async () => {
    if (!amount || parseFloat(amount) <= 0) return setError('Invalid amount');
    if (totalCost > userBalance) return setError('Insufficient balance');
    setLoading(true);
    try {
      const newBalance = userBalance - totalCost;
      const userId = JSON.parse(localStorage.getItem('auth-storage'))?.state?.user?.id;
      await api.patch(`/admin/users/${userId}/balance`, { availableBalance: newBalance });
      updateBalance(newBalance);
      onSuccess();
      onClose();
    } catch (err) { setError('Investment failed. Try again.'); }
    finally { setLoading(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Invest in {asset.name}</h2>
        <div className="space-y-4">
          <input type="number" placeholder="Amount (USD)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3" />
          <div><label className="text-xs text-gray-500">Total Cost</label><div className="text-2xl font-bold">${totalCost.toLocaleString()}</div></div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button onClick={handleInvest} disabled={loading} className="w-full bg-gold text-black py-3 rounded-xl font-bold">{loading ? 'Processing...' : 'Confirm Investment'}</button>
        </div>
      </div>
    </div>
  );
};

// ---------- MAIN DASHBOARD ----------
export default function Dashboard() {
  const { user, updateBalance, logout } = useAuthStore();
  const navigate = useNavigate();
  useSocket();
  const [balance, setBalance] = useState(user?.availableBalance || 0);
  const [watchlist, setWatchlist] = useState(DEFAULT_WATCHLIST);
  const [searchTerm, setSearchTerm] = useState('');
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [discoverModal, setDiscoverModal] = useState(false);
  const [investAsset, setInvestAsset] = useState(null);
  const [timeRange, setTimeRange] = useState('1W');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [kycStatus, setKycStatus] = useState(user?.kycStatus || 'PENDING');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getProfile().then(res => {
      setBalance(res.data.availableBalance);
      updateBalance(res.data.availableBalance);
      setKycStatus(res.data.kycStatus);
      if (res.data.kycStatus !== 'VERIFIED') navigate('/kyc');
    });
    // Fetch balance history for chart
    api.get('/user/balance-history').then(res => setChartData(res.data)).catch(console.error);
    // Fetch notifications
    api.get('/user/notifications').then(res => setNotifications(res.data)).catch(console.error);
    const socket = globalThis.socket;
    if (socket) socket.on('notification', (notif) => setNotifications(prev => [notif, ...prev]));
  }, []);

  const filteredWatchlist = watchlist.filter(item => item.symbol.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleAddToWatchlist = (asset) => {
    if (!watchlist.some(w => w.symbol === asset.symbol)) {
      setWatchlist([...watchlist, { symbol: asset.symbol, price: asset.price, change: asset.change, up: asset.up }]);
    }
  };
  const handleInvestSuccess = () => getProfile().then(res => setBalance(res.data.availableBalance));
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-gray-500 text-sm">Welcome back, {user?.fullName}</p></div>
        <div className="flex items-center gap-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /><input type="text" placeholder="Search watchlist..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gold w-64" /></div>
          <div className="relative"><button onClick={() => setShowNotifications(!showNotifications)} className="p-2 bg-white/5 rounded-full relative"><Bell size={20} className="text-gray-400" />{unreadCount > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">{unreadCount}</div>}</button>
            {showNotifications && (<div className="absolute right-0 mt-2 w-80 bg-black border border-white/10 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"><div className="p-3 border-b border-white/10 font-bold">Notifications</div>{notifications.length === 0 ? <div className="p-4 text-center text-gray-500">No notifications</div> : notifications.map(n => (<div key={n._id} className={`p-3 border-b border-white/5 ${!n.isRead ? 'bg-gold/10' : ''}`}><p className="font-semibold text-sm">{n.title}</p><p className="text-xs text-gray-400">{n.message}</p><p className="text-[10px] text-gray-600 mt-1">{new Date(n.createdAt).toLocaleString()}</p></div>))}</div>)}
          </div>
        </div>
      </div>

      {kycStatus !== 'VERIFIED' && (<div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 flex items-center justify-between"><div><AlertCircle className="text-yellow-500 inline mr-2" size={18} /> Your KYC is {kycStatus}. Please complete verification.</div><Link to="/kyc" className="bg-gold text-black px-4 py-2 rounded-lg text-sm">Go to KYC</Link></div>)}

      <div className="bg-gradient-to-br from-gold/10 to-transparent border border-white/10 rounded-2xl p-6 mb-8">
        <p className="text-gray-400 text-sm">Total Net Equity</p>
        <div className="flex items-baseline gap-4"><h2 className="text-4xl font-bold">${balance.toLocaleString()}</h2><span className="text-green-500 text-sm flex items-center gap-1"><ArrowUpRight size={16} /> 14.2%</span></div>
        <div className="flex gap-4 mt-6"><button onClick={() => setDepositModal(true)} className="bg-gold text-black px-6 py-2 rounded-lg font-semibold">Deposit</button><button onClick={() => setWithdrawModal(true)} className="bg-white/5 border border-white/10 px-6 py-2 rounded-lg">Withdraw</button></div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4"><h3 className="font-bold">Performance Chart</h3><div className="flex gap-2">{['1D', '1W', '1M', '1Y'].map(range => (<button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1 rounded text-xs font-bold ${timeRange === range ? 'bg-gold text-black' : 'bg-white/5 text-gray-400'}`}>{range}</button>))}</div></div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/><stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
            <XAxis dataKey="date" tick={{fill: '#888', fontSize: 10}} />
            <YAxis hide />
            <Tooltip contentStyle={{backgroundColor: '#111', border: 'none'}} />
            <Area type="monotone" dataKey="balance" stroke="#D4AF37" strokeWidth={2} fill="url(#chartGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 mb-8"><h3 className="font-bold mb-4">Live Market Chart (BTC/USDT)</h3><RealTimeChart symbol="BTCUSDT" height={300} /></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6"><div className="flex justify-between items-center mb-4"><h3 className="font-bold">Watchlist</h3><button onClick={() => setDiscoverModal(true)} className="text-gold text-xs">Edit</button></div><div className="space-y-3">{filteredWatchlist.map((item, i) => (<div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{item.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}</div><div><p className="font-bold text-sm">{item.symbol}</p><p className="text-[10px] text-gray-500">Live</p></div></div><div className="text-right"><p className="font-bold">${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}</p><p className={`text-xs ${item.up ? 'text-green-500' : 'text-red-500'}`}>{item.change}</p></div><button onClick={() => setInvestAsset({ symbol: item.symbol, name: item.symbol, price: item.price })} className="bg-gold/20 text-gold px-3 py-1 rounded text-xs ml-2">Invest</button></div>))}</div><button onClick={() => setDiscoverModal(true)} className="w-full mt-4 py-2 border border-white/5 rounded-lg text-xs text-gray-500 hover:bg-white/5">Discover More Assets</button></div>
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6"><h3 className="font-bold mb-4 flex items-center gap-2"><Landmark size={16} className="text-gold" /> Investment Plans</h3><div className="grid grid-cols-1 gap-3">{INVESTMENT_ASSETS.map(asset => (<div key={asset.symbol} className="flex justify-between items-center p-3 bg-white/5 rounded-xl"><div><p className="font-bold text-sm">{asset.name}</p><p className="text-xs text-gray-500">{asset.symbol}</p></div><div className="text-right"><p className="font-bold">${asset.price.toLocaleString()}</p><p className={`text-xs ${asset.up ? 'text-green-500' : 'text-red-500'}`}>{asset.change}</p></div><button onClick={() => setInvestAsset(asset)} className="bg-gold/20 text-gold px-3 py-1 rounded text-xs">Invest</button></div>))}</div></div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-gray-600 border-t border-white/5 pt-4 mt-4"><span>Last sync: just now</span><span>Liquidity Provider: APEX Global LP</span></div>

      <AnimatePresence>
        {depositModal && <DepositModal isOpen={depositModal} onClose={() => setDepositModal(false)} onSuccess={() => getProfile().then(res => setBalance(res.data.availableBalance))} />}
        {withdrawModal && <WithdrawalModal isOpen={withdrawModal} onClose={() => setWithdrawModal(false)} onSuccess={() => getProfile().then(res => setBalance(res.data.availableBalance))} balance={balance} />}
        {discoverModal && <DiscoverAssetsModal isOpen={discoverModal} onClose={() => setDiscoverModal(false)} onAddToWatchlist={handleAddToWatchlist} />}
        {investAsset && <InvestModal asset={investAsset} onClose={() => setInvestAsset(null)} onSuccess={handleInvestSuccess} userBalance={balance} />}
      </AnimatePresence>
    </>
  );
}
