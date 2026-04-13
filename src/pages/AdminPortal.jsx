import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Wallet, History, MessageSquare, 
  Play, Pause, RefreshCw, ChevronRight, BarChart3,
  DollarSign, AlertCircle, CheckCircle, XCircle, Edit2
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';
import { updateUserBalance, getUsers, getWithdrawals, updateWithdrawal, getAuditLogs, getContactMessages, createDeposit } from '../api/admin';
import { useSocket } from '../hooks/useSocket';

const StatCard = ({ title, value, icon: Icon, change, positive }) => (
  <div className="glass-card p-6">
    <div className="flex justify-between items-start">
      <div><p className="text-gray-400 text-sm uppercase tracking-wider">{title}</p><p className="text-2xl font-bold mt-1">{value}</p></div>
      <div className="p-3 bg-white/5 rounded-full"><Icon size={20} className="text-gold" /></div>
    </div>
    {change && <div className={`mt-2 text-xs ${positive ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>{positive ? <TrendingUp size={12} /> : <TrendingUp className="rotate-180" size={12} />}{change}</div>}
  </div>
);

export default function AdminPortal() {
  const { user, updateBalance } = useAuthStore();
  const setView = useUIStore(state => state.setView);
  useSocket();

  const [simActive, setSimActive] = useState(false);
  const [growthRate, setGrowthRate] = useState(0.05);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingBalance, setEditingBalance] = useState(null);

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
    if (res.data.length && !selectedUserId) setSelectedUserId(res.data[0]._id);
  };
  const fetchWithdrawals = async () => { const res = await getWithdrawals(); setWithdrawals(res.data); };
  const fetchAuditLogs = async () => { const res = await getAuditLogs(); setAuditLogs(res.data); };
  const fetchMessages = async () => { const res = await getContactMessages(); setMessages(res.data); };

  useEffect(() => {
    fetchUsers(); fetchWithdrawals(); fetchAuditLogs(); fetchMessages();
  }, []);

  // Simulation effect
  useEffect(() => {
    let interval;
    if (simActive && selectedUserId) {
      interval = setInterval(async () => {
        const targetUser = users.find(u => u._id === selectedUserId);
        if (targetUser) {
          const increment = targetUser.availableBalance * (growthRate / 100);
          const newBalance = targetUser.availableBalance + increment;
          await updateUserBalance(selectedUserId, { availableBalance: newBalance });
          await fetchUsers();
          if (selectedUserId === user?.id) updateBalance(newBalance);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [simActive, growthRate, selectedUserId, users]);

  const handleManualUpdate = async (type) => {
    const amount = parseFloat(manualAmount);
    if (isNaN(amount)) return;
    const target = users.find(u => u._id === selectedUserId);
    if (!target) return;
    let newBalance = target.availableBalance;
    if (type === 'credit') newBalance += amount;
    else newBalance = Math.max(0, newBalance - amount);
    await updateUserBalance(selectedUserId, { availableBalance: newBalance });
    await fetchUsers();
    if (selectedUserId === user?.id) updateBalance(newBalance);
    setManualAmount('');
  };

  const handleWithdrawAction = async (id, status) => {
    await updateWithdrawal(id, status, `Processed by ${user?.fullName}`);
    await fetchWithdrawals();
    await fetchUsers(); // update user balances if approved
  };

  const handleBalanceEdit = async (userId, newBalance) => {
    await updateUserBalance(userId, { availableBalance: parseFloat(newBalance) });
    await fetchUsers();
    setEditingBalance(null);
  };

  const totalAUM = users.reduce((sum, u) => sum + u.availableBalance, 0);
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button onClick={() => setView('LANDING')} className="text-gold text-xs font-bold mb-2 flex items-center gap-1"><ChevronRight className="rotate-180" size={14} /> Exit</button>
            <h1 className="text-3xl font-black">Admin Control Center</h1>
            <p className="text-gray-500">Manage clients, simulate growth, audit logs</p>
          </div>
          <div className="text-right"><div className="text-xs text-gray-500">System Status</div><div className="text-green-400 font-mono text-sm">● OPERATIONAL</div></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total AUM" value={`$${(totalAUM / 1e6).toFixed(1)}M`} icon={BarChart3} />
          <StatCard title="Active Users" value={users.length} icon={Users} />
          <StatCard title="Pending Withdrawals" value={pendingWithdrawals} icon={Wallet} change="+3 from yesterday" positive={false} />
          <StatCard title="Unread Messages" value={messages.filter(m => !m.isRead).length} icon={MessageSquare} />
        </div>

        <div className="flex gap-2 border-b border-white/10 mb-6 overflow-x-auto">
          {['overview', 'simulate', 'users', 'withdrawals', 'deposits', 'logs', 'messages'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-t-xl font-medium transition ${activeTab === tab ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
          ))}
        </div>

        {activeTab === 'users' && (
          <div className="glass-card p-6 overflow-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10"><th className="text-left py-2">Name</th><th>Email</th><th>Balance</th><th>Role</th><th>Action</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-white/5">
                    <td className="py-2">{u.fullName}</td>
                    <td>{u.email}</td>
                    <td className="py-2">
                      {editingBalance === u._id ? (
                        <input type="number" defaultValue={u.availableBalance} onBlur={(e) => handleBalanceEdit(u._id, e.target.value)} className="bg-black border border-gold rounded px-2 py-1 w-32" autoFocus />
                      ) : (
                        <span className="cursor-pointer" onClick={() => setEditingBalance(u._id)}>${u.availableBalance.toLocaleString()} <Edit2 size={12} className="inline ml-1 text-gold" /></span>
                      )}
                    </td>
                    <td>{u.role}</td>
                    <td className="py-2"><button onClick={() => { setSelectedUserId(u._id); setActiveTab('simulate'); }} className="text-gold text-xs">Simulate</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="glass-card p-6 overflow-auto">
            <table className="w-full text-sm">
              <thead><tr><th>User</th><th>Amount</th><th>Destination</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {withdrawals.map(w => (
                  <tr key={w._id}>
                    <td className="py-2">{w.userId?.fullName || w.userId}</td>
                    <td className="py-2">${w.amount}</td>
                    <td className="py-2 text-xs font-mono">{w.destinationAddr?.slice(0, 10)}...</td>
                    <td className="py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${w.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : w.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{w.status}</span></td>
                    <td className="py-2">{w.status === 'PENDING' && (<div className="flex gap-2"><button onClick={() => handleWithdrawAction(w._id, 'APPROVED')} className="bg-green-600 px-2 py-1 rounded text-xs">Approve</button><button onClick={() => handleWithdrawAction(w._id, 'REJECTED')} className="bg-red-600 px-2 py-1 rounded text-xs">Reject</button></div>)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'simulate' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4">Wealth Rise Engine</h3>
              <div className="space-y-4">
                <div><label className="text-xs text-gray-500">Target Client</label><select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-2 mt-1">{users.map(u => <option key={u._id} value={u._id}>{u.fullName} (${u.availableBalance.toLocaleString()})</option>)}</select></div>
                <div><label className="text-xs text-gray-500">Growth Rate per Pulse (%)</label><div className="flex items-center gap-4"><input type="range" min="0.01" max="1" step="0.01" value={growthRate} onChange={e => setGrowthRate(parseFloat(e.target.value))} className="flex-1 accent-gold" /><span className="font-mono text-gold">{growthRate}%</span></div></div>
                <button onClick={() => setSimActive(!simActive)} className={`w-full py-3 rounded-xl font-bold transition ${simActive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gold text-black'}`}>{simActive ? <><Pause size={18} /> Stop Simulation</> : <><Play size={18} /> Start Pulse Engine</>}</button>
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4">Manual Adjustment</h3>
              <div className="space-y-4">
                <input type="number" value={manualAmount} onChange={e => setManualAmount(e.target.value)} placeholder="Amount in USD" className="w-full bg-black border border-white/10 rounded-lg p-2" />
                <div className="flex gap-4"><button onClick={() => handleManualUpdate('credit')} className="flex-1 bg-gold/20 text-gold py-2 rounded-lg">Credit</button><button onClick={() => handleManualUpdate('debit')} className="flex-1 bg-white/5 py-2 rounded-lg">Debit</button></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deposits' && (
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">Manual Deposit</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <select id="depUser" className="bg-black border border-white/10 rounded-lg p-2"><option value="">Select User</option>{users.map(u => <option key={u._id} value={u._id}>{u.fullName}</option>)}</select>
              <input type="number" id="depAmount" placeholder="Amount" className="bg-black border border-white/10 rounded-lg p-2" />
              <button className="bg-gold text-black py-2 rounded-lg font-bold" onClick={async () => { const userId = document.getElementById('depUser').value; const amount = parseFloat(document.getElementById('depAmount').value); if (userId && amount) { await createDeposit({ userId, amount, cryptoType: 'MANUAL' }); await fetchUsers(); alert('Deposit credited'); } }}>Credit Deposit</button>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="glass-card p-6 overflow-auto max-h-96">
            <table className="w-full text-xs"><thead><tr><th>Admin</th><th>User</th><th>Action</th><th>Time</th></tr></thead><tbody>{auditLogs.map(log => <tr key={log._id}><td>{log.adminId}</td><td>{log.userId}</td><td>{log.action}</td><td>{new Date(log.createdAt).toLocaleString()}</td></tr>)}</tbody></table>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="glass-card p-6 space-y-4">
            {messages.map(m => <div key={m._id} className={`p-4 rounded-xl ${!m.isRead ? 'bg-gold/10 border border-gold/20' : 'bg-white/5'}`}><p><strong>{m.name}</strong> ({m.email})</p><p>{m.message}</p><div className="text-right text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div></div>)}
          </div>
        )}
      </div>
    </div>
  );
}
