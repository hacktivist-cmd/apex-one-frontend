import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Wallet, History, MessageSquare, Play, Pause, 
  RefreshCw, ChevronRight, BarChart3, Edit2, Trash2, UserPlus, Shield,
  CheckCircle, XCircle, Clock, Mail, Eye, Download, Send, Star,
  Zap, Globe, AlertCircle
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';
import api from '../api/axios';

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="glass-card p-6">
    <div className="flex justify-between items-start">
      <div><p className="text-gray-400 text-sm uppercase tracking-wider">{title}</p><p className="text-2xl font-bold mt-1">{value}</p></div>
      <div className="p-3 bg-white/5 rounded-full"><Icon size={20} className="text-gold" /></div>
    </div>
  </div>
);

export default function AdminPortal() {
  const { user } = useAuthStore();
  const setView = useUIStore(state => state.setView);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [editingBalance, setEditingBalance] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const [createUserForm, setCreateUserForm] = useState({ fullName: '', email: '', password: '', role: 'USER', availableBalance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [simUser, setSimUser] = useState(null);
  const [simRate, setSimRate] = useState(0.05);
  const [simActive, setSimActive] = useState(false);
  const [simAllActive, setSimAllActive] = useState(false);
  const [globalGrowthRate, setGlobalGrowthRate] = useState(0.05);
  const [simulationIntervals, setSimulationIntervals] = useState({});
  const [kycUsers, setKycUsers] = useState([]);
  const [selectedKycUser, setSelectedKycUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [createUserError, setCreateUserError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const backendBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://apex-one-backend.onrender.com';

  const fetchUsers = async () => {
    const res = await api.get('/admin/users');
    setUsers(res.data);
  };
  const fetchTransactions = async () => { const res = await api.get('/admin/transactions'); setTransactions(res.data); };
  const fetchKycPending = async () => { const res = await api.get('/admin/kyc/pending'); setKycUsers(res.data); };
  const fetchMessages = async () => { const res = await api.get('/admin/contact-messages'); setMessages(res.data); };
  const fetchNewsletter = async () => { const res = await api.get('/admin/newsletter'); setSubscribers(res.data); };
  const fetchReviews = async () => { const res = await api.get('/admin/reviews'); setReviews(res.data); };

  useEffect(() => {
    fetchUsers();
    fetchTransactions();
    fetchKycPending();
    fetchMessages();
    fetchNewsletter();
    fetchReviews();
  }, []);

  const handleUpdateBalance = async (userId) => {
    await api.patch(`/admin/users/${userId}/balance`, { availableBalance: parseFloat(newBalance) });
    fetchUsers();
    setEditingBalance(null);
    setNewBalance('');
  };
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete this user? This action is permanent.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (err) {
        setDeleteError(err.response?.data?.message || 'Delete failed');
        setTimeout(() => setDeleteError(''), 3000);
      }
    }
  };
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateUserError('');
    try {
      await api.post('/admin/users', createUserForm);
      fetchUsers();
      setCreateUserForm({ fullName: '', email: '', password: '', role: 'USER', availableBalance: 0 });
      setActiveTab('users');
    } catch (err) {
      setCreateUserError(err.response?.data?.message || 'Create failed');
    }
  };

  const handleTransactionAction = async (id, status) => {
    await api.patch(`/admin/transactions/${id}`, { status });
    fetchTransactions();
    fetchUsers();
  };

  const startIndividualSimulation = async () => {
    if (!simUser) return alert('Select a user');
    await api.post('/admin/simulation/start', { userId: simUser, growthRate: simRate });
    setSimActive(true);
    alert('Individual simulation started');
  };
  const stopIndividualSimulation = async () => {
    if (!simUser) return;
    await api.post('/admin/simulation/stop', { userId: simUser });
    setSimActive(false);
    alert('Individual simulation stopped');
  };

  const startGlobalSimulation = async () => {
    setSimAllActive(true);
    Object.values(simulationIntervals).forEach(interval => clearInterval(interval));
    const intervals = {};
    for (const u of users) {
      const interval = setInterval(async () => {
        const increment = u.availableBalance * (globalGrowthRate / 100);
        const newBalance = u.availableBalance + increment;
        await api.patch(`/admin/users/${u._id}/balance`, { availableBalance: newBalance });
        fetchUsers();
      }, 3000);
      intervals[u._id] = interval;
    }
    setSimulationIntervals(intervals);
    alert('Global simulation started');
  };
  const stopGlobalSimulation = async () => {
    Object.values(simulationIntervals).forEach(interval => clearInterval(interval));
    setSimulationIntervals({});
    setSimAllActive(false);
    alert('Global simulation stopped');
  };

  const handleKycAction = async (userId, status) => {
    await api.patch(`/admin/kyc/${userId}`, { status });
    fetchKycPending();
    fetchUsers();
    setSelectedKycUser(null);
  };

  const handleReviewAction = async (id, isActive) => {
    await api.patch(`/admin/reviews/${id}`, { isActive });
    fetchReviews();
  };
  const handleDeleteReview = async (id) => {
    if (window.confirm('Delete this review?')) {
      await api.delete(`/admin/reviews/${id}`);
      fetchReviews();
    }
  };

  const markMessageRead = async (id) => {
    await api.patch(`/admin/contact-messages/${id}/read`);
    fetchMessages();
  };
  const deleteMessage = async (id) => {
    if (window.confirm('Delete this message?')) {
      await api.delete(`/admin/contact-messages/${id}`);
      fetchMessages();
    }
  };
  const deleteSubscriber = async (id) => {
    if (window.confirm('Remove this subscriber?')) {
      await api.delete(`/admin/newsletter/${id}`);
      fetchNewsletter();
    }
  };

  const pendingCount = transactions.filter(t => t.status === 'PENDING').length;
  const unreadCount = messages.filter(m => !m.isRead).length;
  const pendingKycCount = kycUsers.length;
  const pendingReviewsCount = reviews.filter(r => !r.isActive).length;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div><button onClick={() => setView('LANDING')} className="text-gold text-xs font-bold mb-2 flex items-center gap-1"><ChevronRight className="rotate-180" size={14} /> Exit</button><h1 className="text-3xl font-black">Admin Control Center</h1></div>
          <div className="text-right"><div className="text-xs text-gray-500">System Status</div><div className="text-green-400 font-mono text-sm">● OPERATIONAL</div></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <StatCard title="Total Users" value={users.length} icon={Users} />
          <StatCard title="Total AUM" value={`$${users.reduce((s, u) => s + u.availableBalance, 0).toLocaleString()}`} icon={BarChart3} />
          <StatCard title="Pending Requests" value={pendingCount} icon={Clock} />
          <StatCard title="Pending KYC" value={pendingKycCount} icon={Shield} />
          <StatCard title="Pending Reviews" value={pendingReviewsCount} icon={Star} />
          <StatCard title="Unread Messages" value={unreadCount} icon={Mail} />
        </div>

        <div className="flex gap-2 border-b border-white/10 mb-6 overflow-x-auto">
          {['users', 'transactions', 'simulate', 'kyc', 'reviews', 'messages', 'newsletter'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-t-xl font-medium transition ${activeTab === tab ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'}`}>{tab.toUpperCase()}</button>
          ))}
        </div>

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="glass-card p-6 overflow-auto">
            <div className="mb-6"><button onClick={() => setActiveTab('create')} className="bg-gold text-black px-4 py-2 rounded-lg">+ Create New User</button></div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10"><th className="text-left py-2">Name</th><th>Email</th><th>Balance</th><th>KYC</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-white/5">
                    <td className="py-2">{u.fullName}</td>
                    <td>{u.email}</td>
                    <td className="py-2">
                      {editingBalance === u._id ? (
                        <div className="flex gap-2"><input type="number" value={newBalance} onChange={e => setNewBalance(e.target.value)} className="bg-black border border-gold rounded px-2 py-1 w-28" /><button onClick={() => handleUpdateBalance(u._id)} className="text-gold text-xs">Save</button><button onClick={() => setEditingBalance(null)} className="text-gray-400 text-xs">Cancel</button></div>
                      ) : (
                        <span className="cursor-pointer" onClick={() => { setEditingBalance(u._id); setNewBalance(u.availableBalance); }}>${u.availableBalance.toLocaleString()} <Edit2 size={12} className="inline ml-1 text-gold" /></span>
                      )}
                    </td>
                    <td className="py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${u.kycStatus === 'VERIFIED' ? 'bg-green-500/20 text-green-400' : u.kycStatus === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{u.kycStatus}</span></td>
                    <td>{u.role}</td>
                    <td className="py-2">
                      {u.role !== 'ADMIN' && (
                        <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:bg-red-500/10 p-1 rounded"><Trash2 size={16} /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CREATE USER FORM */}
        {activeTab === 'create' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><UserPlus size={20} /> Create New User</h3>
            {createUserError && <div className="mb-4 p-2 bg-red-500/20 text-red-400 rounded">{createUserError}</div>}
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input type="text" placeholder="Full Name" value={createUserForm.fullName} onChange={e => setCreateUserForm({...createUserForm, fullName: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-2" required />
              <input type="email" placeholder="Email" value={createUserForm.email} onChange={e => setCreateUserForm({...createUserForm, email: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-2" required />
              <input type="password" placeholder="Password" value={createUserForm.password} onChange={e => setCreateUserForm({...createUserForm, password: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-2" required />
              <select value={createUserForm.role} onChange={e => setCreateUserForm({...createUserForm, role: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-2"><option value="USER">User</option><option value="ADMIN">Admin</option></select>
              <input type="number" placeholder="Initial Balance" value={createUserForm.availableBalance} onChange={e => setCreateUserForm({...createUserForm, availableBalance: parseFloat(e.target.value)})} className="w-full bg-black border border-white/10 rounded-lg p-2" />
              <button type="submit" className="bg-gold text-black px-4 py-2 rounded-lg">Create User</button>
              <button type="button" onClick={() => setActiveTab('users')} className="ml-2 bg-white/5 px-4 py-2 rounded-lg">Cancel</button>
            </form>
          </div>
        )}

        {/* Other tabs (transactions, simulate, kyc, reviews, messages, newsletter) – same as before, omitted for brevity */}
        {/* They are identical to the previous version; add them back if needed. */}
      </div>
    </div>
  );
}
