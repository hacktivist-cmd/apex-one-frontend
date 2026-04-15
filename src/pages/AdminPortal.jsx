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
  
  // Users
  const [users, setUsers] = useState([]);
  const [editingBalance, setEditingBalance] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const [createUserForm, setCreateUserForm] = useState({ fullName: '', email: '', password: '', role: 'USER', availableBalance: 0 });
  
  // Transactions
  const [transactions, setTransactions] = useState([]);
  
  // Simulation
  const [simUser, setSimUser] = useState(null);
  const [simRate, setSimRate] = useState(0.05);
  const [simActive, setSimActive] = useState(false);
  const [simAllActive, setSimAllActive] = useState(false);
  const [globalGrowthRate, setGlobalGrowthRate] = useState(0.05);
  const [simulationIntervals, setSimulationIntervals] = useState({});
  
  // KYC
  const [kycUsers, setKycUsers] = useState([]);
  const [selectedKycUser, setSelectedKycUser] = useState(null);
  
  // Reviews
  const [reviews, setReviews] = useState([]);
  
  // Messages
  const [messages, setMessages] = useState([]);
  
  // Newsletter
  const [subscribers, setSubscribers] = useState([]);
  
  // Errors
  const [createUserError, setCreateUserError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const backendBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://apex-one-backend.onrender.com';

  const fetchUsers = async () => {
    const res = await api.get('/admin/users');
    setUsers(res.data);
  };
  const fetchTransactions = async () => {
    const res = await api.get('/admin/transactions');
    setTransactions(res.data);
  };
  const fetchKycPending = async () => {
    const res = await api.get('/admin/kyc/pending');
    setKycUsers(res.data);
  };
  const fetchMessages = async () => {
    const res = await api.get('/admin/contact-messages');
    setMessages(res.data);
  };
  const fetchNewsletter = async () => {
    const res = await api.get('/admin/newsletter');
    setSubscribers(res.data);
  };
  const fetchReviews = async () => {
    const res = await api.get('/admin/reviews');
    setReviews(res.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchTransactions();
    fetchKycPending();
    fetchMessages();
    fetchNewsletter();
    fetchReviews();
  }, []);

  // User management
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

  // Transaction approval
  const handleTransactionAction = async (id, status) => {
    await api.patch(`/admin/transactions/${id}`, { status });
    fetchTransactions();
    fetchUsers();
  };

  // Simulation – Individual
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

  // Simulation – Global
  const startGlobalSimulation = async () => {
    setSimAllActive(true);
    // Clear existing intervals
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

  // KYC actions
  const handleKycAction = async (userId, status) => {
    await api.patch(`/admin/kyc/${userId}`, { status });
    fetchKycPending();
    fetchUsers();
    setSelectedKycUser(null);
  };

  // Review actions
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

  // Message actions
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

  // Newsletter actions
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

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <div className="glass-card p-6 overflow-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10"><th>User</th><th>Type</th><th>Amount</th><th>Crypto</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx._id} className="border-b border-white/5">
                    <td className="py-2">{tx.userId?.fullName || tx.userId}</td>
                    <td className="py-2">{tx.type}</td>
                    <td className="py-2">${tx.amount}</td>
                    <td className="py-2">{tx.cryptoType || '-'}</td>
                    <td className="py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${tx.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : tx.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{tx.status}</span></td>
                    <td className="py-2">
                      {tx.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleTransactionAction(tx._id, 'APPROVED')} className="bg-green-600 px-2 py-1 rounded text-xs">Approve</button>
                          <button onClick={() => handleTransactionAction(tx._id, 'REJECTED')} className="bg-red-600 px-2 py-1 rounded text-xs">Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SIMULATE TAB */}
        {activeTab === 'simulate' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Zap size={20} className="text-gold" /> Individual Simulation</h3>
              <div className="space-y-4">
                <select onChange={e => setSimUser(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-2">
                  <option value="">Select User</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.fullName} (${u.availableBalance.toLocaleString()})</option>)}
                </select>
                <div><label className="text-xs text-gray-500">Growth Rate per Pulse (%)</label><input type="number" step="0.01" value={simRate} onChange={e => setSimRate(parseFloat(e.target.value))} className="w-full bg-black border border-white/10 rounded-lg p-2" /></div>
                <div className="flex gap-4">
                  <button onClick={startIndividualSimulation} className="bg-gold text-black px-4 py-2 rounded-lg flex items-center gap-2"><Play size={16} /> Start</button>
                  <button onClick={stopIndividualSimulation} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2"><Pause size={16} /> Stop</button>
                </div>
                {simActive && <p className="text-green-500 text-sm">Simulation running for selected user...</p>}
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Globe size={20} className="text-gold" /> Global Simulation (All Users)</h3>
              <div className="space-y-4">
                <div><label className="text-xs text-gray-500">Global Growth Rate per Pulse (%)</label><input type="number" step="0.01" value={globalGrowthRate} onChange={e => setGlobalGrowthRate(parseFloat(e.target.value))} className="w-full bg-black border border-white/10 rounded-lg p-2" /></div>
                <div className="flex gap-4">
                  <button onClick={startGlobalSimulation} className="bg-gold text-black px-4 py-2 rounded-lg flex items-center gap-2"><Play size={16} /> Start All</button>
                  <button onClick={stopGlobalSimulation} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2"><Pause size={16} /> Stop All</button>
                </div>
                {simAllActive && <p className="text-green-500 text-sm">Global simulation running for all users...</p>}
              </div>
            </div>
          </div>
        )}

        {/* KYC TAB */}
        {activeTab === 'kyc' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">KYC Verification Requests</h3>
            {selectedKycUser ? (
              <div className="space-y-4">
                <button onClick={() => setSelectedKycUser(null)} className="text-gold text-sm">← Back to list</button>
                <div className="bg-white/5 p-4 rounded-xl">
                  <p><strong>Name:</strong> {selectedKycUser.fullName}</p>
                  <p><strong>Email:</strong> {selectedKycUser.email}</p>
                  <p><strong>SSN (last 4):</strong> {selectedKycUser.ssnLast4 || 'N/A'}</p>
                  <p><strong>Submitted:</strong> {new Date(selectedKycUser.createdAt).toLocaleString()}</p>
                  <div className="mt-4">
                    <p className="font-bold mb-2">Uploaded Documents:</p>
                    {selectedKycUser.kycDocuments?.map((doc, i) => (
                      <a key={i} href={`${backendBase}/${doc}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gold underline"><Eye size={16} /> View Document {i+1}</a>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => handleKycAction(selectedKycUser._id, 'VERIFIED')} className="bg-green-600 px-4 py-2 rounded-lg">Approve</button>
                    <button onClick={() => handleKycAction(selectedKycUser._id, 'REJECTED')} className="bg-red-600 px-4 py-2 rounded-lg">Reject</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {kycUsers.map(u => (
                  <div key={u._id} className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                    <div><p className="font-bold">{u.fullName}</p><p className="text-sm text-gray-400">{u.email}</p></div>
                    <button onClick={() => setSelectedKycUser(u)} className="bg-gold/20 text-gold px-4 py-2 rounded-lg">Review</button>
                  </div>
                ))}
                {kycUsers.length === 0 && <p className="text-gray-500">No pending KYC requests.</p>}
              </div>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-xl font-bold mb-4">Manage Reviews</h3>
            {reviews.map(review => (
              <div key={review._id} className={`p-4 rounded-xl ${!review.isActive ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/5'}`}>
                <div className="flex justify-between items-start">
                  <div><p className="font-bold">{review.name}</p><p className="text-sm text-gray-400">{review.email}</p><div className="flex text-[#D4AF37] text-sm">{Array(review.rating).fill().map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div></div>
                  <div className="flex gap-2">
                    {!review.isActive && <button onClick={() => handleReviewAction(review._id, true)} className="bg-green-600 px-3 py-1 rounded text-xs">Approve</button>}
                    {review.isActive && <button onClick={() => handleReviewAction(review._id, false)} className="bg-yellow-600 px-3 py-1 rounded text-xs">Unapprove</button>}
                    <button onClick={() => handleDeleteReview(review._id)} className="bg-red-600 px-3 py-1 rounded text-xs">Delete</button>
                  </div>
                </div>
                <p className="mt-2 text-gray-300">{review.text}</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(review.createdAt).toLocaleString()}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="glass-card p-6 space-y-4">
            {messages.map(m => (
              <div key={m._id} className={`p-4 rounded-xl ${!m.isRead ? 'bg-gold/10 border border-gold/20' : 'bg-white/5'}`}>
                <div className="flex justify-between items-start">
                  <div><p className="font-bold">{m.name}</p><p className="text-sm text-gray-400">{m.email}</p></div>
                  <div className="flex gap-2">
                    {!m.isRead && <button onClick={() => markMessageRead(m._id)} className="text-gold text-xs">Mark read</button>}
                    <button onClick={() => deleteMessage(m._id)} className="text-red-400 text-xs">Delete</button>
                  </div>
                </div>
                <p className="mt-2">{m.message}</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(m.createdAt).toLocaleString()}</p>
              </div>
            ))}
            {messages.length === 0 && <p className="text-gray-500">No messages.</p>}
          </div>
        )}

        {/* NEWSLETTER TAB */}
        {activeTab === 'newsletter' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Newsletter Subscribers</h3>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10"><th className="text-left py-2">Email</th><th>Subscribed On</th><th>Actions</th></tr></thead>
                <tbody>
                  {subscribers.map(s => (
                    <tr key={s._id} className="border-b border-white/5">
                      <td className="py-2">{s.email}</td>
                      <td className="py-2">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                      <td className="py-2"><button onClick={() => deleteSubscriber(s._id)} className="text-red-500 text-xs">Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {subscribers.length === 0 && <p className="text-gray-500">No subscribers yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
