import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Wallet, History, MessageSquare, Play, Pause, 
  ChevronRight, BarChart3, Edit2, Trash2, UserPlus, Shield,
  CheckCircle, XCircle, Clock, Mail, Eye, Star, StarOff
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
  const [transactions, setTransactions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [kycUsers, setKycUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [simUser, setSimUser] = useState(null);
  const [simRate, setSimRate] = useState(0.05);
  const [simActive, setSimActive] = useState(false);
  const [editingBalance, setEditingBalance] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const [createUserForm, setCreateUserForm] = useState({ fullName: '', email: '', password: '', role: 'USER', availableBalance: 0 });

  const fetchUsers = async () => { const res = await api.get('/admin/users'); setUsers(res.data); };
  const fetchTransactions = async () => { const res = await api.get('/admin/transactions'); setTransactions(res.data); };
  const fetchReviews = async () => { const res = await api.get('/admin/reviews'); setReviews(res.data); };
  const fetchKycPending = async () => { const res = await api.get('/admin/kyc/pending'); setKycUsers(res.data); };
  const fetchMessages = async () => { const res = await api.get('/admin/contact-messages'); setMessages(res.data); };
  const fetchNewsletter = async () => { const res = await api.get('/admin/newsletter'); setSubscribers(res.data); };

  useEffect(() => {
    fetchUsers(); fetchTransactions(); fetchReviews(); fetchKycPending(); fetchMessages(); fetchNewsletter();
  }, []);

  const handleUpdateBalance = async (userId) => {
    await api.patch(`/admin/users/${userId}/balance`, { availableBalance: parseFloat(newBalance) });
    fetchUsers(); setEditingBalance(null); setNewBalance('');
  };
  const handleDeleteUser = async (userId) => { if (confirm('Delete?')) { await api.delete(`/admin/users/${userId}`); fetchUsers(); } };
  const handleCreateUser = async (e) => { e.preventDefault(); await api.post('/admin/users', createUserForm); fetchUsers(); setCreateUserForm({ fullName: '', email: '', password: '', role: 'USER', availableBalance: 0 }); };

  const handleTransactionAction = async (id, status) => { await api.patch(`/admin/transactions/${id}`, { status }); fetchTransactions(); fetchUsers(); };
  const startSimulation = async () => { if (!simUser) return alert('Select user'); await api.post('/admin/simulation/start', { userId: simUser, growthRate: simRate }); setSimActive(true); alert('Started'); };
  const stopSimulation = async () => { if (!simUser) return; await api.post('/admin/simulation/stop', { userId: simUser }); setSimActive(false); alert('Stopped'); };
  const markMessageRead = async (id) => { await api.patch(`/admin/contact-messages/${id}/read`); fetchMessages(); };
  const deleteMessage = async (id) => { if (confirm('Delete message?')) { await api.delete(`/admin/contact-messages/${id}`); fetchMessages(); } };
  const deleteSubscriber = async (id) => { if (confirm('Remove subscriber?')) { await api.delete(`/admin/newsletter/${id}`); fetchNewsletter(); } };
  const approveReview = async (id) => { await api.patch(`/admin/reviews/${id}/approve`); fetchReviews(); };
  const deleteReview = async (id) => { if (confirm('Delete review?')) { await api.delete(`/admin/reviews/${id}`); fetchReviews(); } };

  const pendingCount = transactions.filter(t => t.status === 'PENDING').length;
  const pendingKyc = kycUsers.length;
  const unreadMessages = messages.filter(m => !m.isRead).length;
  const pendingReviews = reviews.filter(r => !r.isActive).length;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div><button onClick={() => setView('LANDING')} className="text-gold text-xs font-bold mb-2 flex items-center gap-1"><ChevronRight className="rotate-180" size={14} /> Exit</button><h1 className="text-3xl font-black">Admin Control Center</h1></div>
          <div className="text-right"><div className="text-xs text-gray-500">System Status</div><div className="text-green-400 font-mono text-sm">● OPERATIONAL</div></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <StatCard title="Users" value={users.length} icon={Users} />
          <StatCard title="Pending Requests" value={pendingCount} icon={Clock} />
          <StatCard title="Pending KYC" value={pendingKyc} icon={Shield} />
          <StatCard title="Unread Messages" value={unreadMessages} icon={Mail} />
          <StatCard title="Pending Reviews" value={pendingReviews} icon={Star} />
        </div>
        <div className="flex gap-2 border-b border-white/10 mb-6 overflow-x-auto">
          {['users', 'transactions', 'kyc', 'messages', 'newsletter', 'reviews', 'simulate'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-t-xl font-medium transition ${activeTab === tab ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'}`}>{tab.toUpperCase()}</button>
          ))}
        </div>

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="glass-card p-6 overflow-auto">
            <div className="mb-4"><button onClick={() => setActiveTab('create')} className="bg-gold text-black px-4 py-2 rounded-lg">+ Create User</button></div>
            <table className="w-full text-sm"><thead><tr><th>Name</th><th>Email</th><th>Balance</th><th>Role</th><th>Actions</th></tr></thead><tbody>
              {users.map(u => (
                <tr key={u._id}><td>{u.fullName}</td><td>{u.email}</td><td>{editingBalance === u._id ? (<div className="flex gap-2"><input type="number" value={newBalance} onChange={e => setNewBalance(e.target.value)} className="bg-black border border-gold rounded px-2 py-1 w-28" /><button onClick={() => handleUpdateBalance(u._id)} className="text-gold">Save</button><button onClick={() => setEditingBalance(null)}>Cancel</button></div>) : (<span className="cursor-pointer" onClick={() => { setEditingBalance(u._id); setNewBalance(u.availableBalance); }}>${u.availableBalance.toLocaleString()} <Edit2 size={12} className="inline ml-1 text-gold" /></span>)}</td><td>{u.role}</td><td><button onClick={() => handleDeleteUser(u._id)} className="text-red-500"><Trash2 size={16} /></button></td></tr>
              ))}
            </tbody></table>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <div className="glass-card p-6 overflow-auto"><table className="w-full text-sm"><thead><tr><th>User</th><th>Type</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            {transactions.map(tx => (
              <tr key={tx._id}><td>{tx.userId?.fullName}</td><td>{tx.type}</td><td>${tx.amount}</td><td>{tx.status}</td><td>{tx.status === 'PENDING' && (<div className="flex gap-2"><button onClick={() => handleTransactionAction(tx._id, 'APPROVED')} className="bg-green-600 px-2 py-1 rounded text-xs">Approve</button><button onClick={() => handleTransactionAction(tx._id, 'REJECTED')} className="bg-red-600 px-2 py-1 rounded text-xs">Reject</button></div>)}</td></tr>
            ))}
          </tbody></table></div>
        )}

        {/* KYC TAB */}
        {activeTab === 'kyc' && (
          <div className="glass-card p-6"><div className="space-y-4">{kycUsers.map(u => (<div key={u._id} className="bg-white/5 p-4 rounded-xl flex justify-between"><div><p className="font-bold">{u.fullName}</p><p className="text-sm">{u.email}</p><p>SSN: {u.ssnLast4}</p></div><div className="flex gap-2"><button className="bg-green-600 px-3 py-1 rounded text-xs">Approve</button><button className="bg-red-600 px-3 py-1 rounded text-xs">Reject</button></div></div>))}</div></div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="glass-card p-6 space-y-4">{messages.map(m => (<div key={m._id} className={`p-4 rounded-xl ${!m.isRead ? 'bg-gold/10 border border-gold/20' : 'bg-white/5'}`}><div className="flex justify-between"><div><p className="font-bold">{m.name}</p><p className="text-sm text-gray-400">{m.email}</p></div><div className="flex gap-2">{!m.isRead && <button onClick={() => markMessageRead(m._id)} className="text-gold text-xs">Mark read</button>}<button onClick={() => deleteMessage(m._id)} className="text-red-400 text-xs">Delete</button></div></div><p className="mt-2">{m.message}</p></div>))}</div>
        )}

        {/* NEWSLETTER TAB */}
        {activeTab === 'newsletter' && (
          <div className="glass-card p-6 overflow-auto"><table className="w-full text-sm"><thead><tr><th>Email</th><th>Subscribed</th><th>Actions</th></tr></thead><tbody>{subscribers.map(s => (<tr key={s._id}><td>{s.email}</td><td>{new Date(s.subscribedAt).toLocaleDateString()}</td><td><button onClick={() => deleteSubscriber(s._id)} className="text-red-500 text-xs">Remove</button></td></tr>))}</tbody></table></div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="glass-card p-6 space-y-4">
            {reviews.map(r => (
              <div key={r._id} className={`p-4 rounded-xl ${!r.isActive ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/5'}`}>
                <div className="flex justify-between items-start">
                  <div><p className="font-bold">{r.name}</p><div className="flex text-[#D4AF37] text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div><p className="text-gray-300 mt-2">{r.text}</p></div>
                  <div className="flex gap-2">
                    {!r.isActive && <button onClick={() => approveReview(r._id)} className="bg-green-600 px-3 py-1 rounded text-xs">Approve</button>}
                    <button onClick={() => deleteReview(r._id)} className="bg-red-600 px-3 py-1 rounded text-xs">Delete</button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{new Date(r.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* SIMULATE TAB */}
        {activeTab === 'simulate' && (
          <div className="glass-card p-6"><div className="space-y-4"><select onChange={e => setSimUser(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-2"><option value="">Select User</option>{users.map(u => <option key={u._id} value={u._id}>{u.fullName} (${u.availableBalance})</option>)}</select><div><label>Growth Rate (%)</label><input type="number" step="0.01" value={simRate} onChange={e => setSimRate(parseFloat(e.target.value))} className="w-full bg-black border border-white/10 rounded-lg p-2" /></div><div className="flex gap-4"><button onClick={startSimulation} className="bg-gold text-black px-4 py-2 rounded-lg">Start</button><button onClick={stopSimulation} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg">Stop</button></div>{simActive && <p className="text-green-500">Simulation running...</p>}</div></div>
        )}

        {/* CREATE USER FORM */}
        {activeTab === 'create' && (
          <div className="glass-card p-6"><h3 className="text-xl font-bold mb-4">Create User</h3><form onSubmit={handleCreateUser} className="space-y-4"><input type="text" placeholder="Full Name" value={createUserForm.fullName} onChange={e => setCreateUserForm({...createUserForm, fullName: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-2" required /><input type="email" placeholder="Email" value={createUserForm.email} onChange={e => setCreateUserForm({...createUserForm, email: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-2" required /><input type="password" placeholder="Password" value={createUserForm.password} onChange={e => setCreateUserForm({...createUserForm, password: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-2" required /><select value={createUserForm.role} onChange={e => setCreateUserForm({...createUserForm, role: e.target.value})}><option>USER</option><option>ADMIN</option></select><input type="number" placeholder="Initial Balance" value={createUserForm.availableBalance} onChange={e => setCreateUserForm({...createUserForm, availableBalance: parseFloat(e.target.value)})} className="w-full bg-black border border-white/10 rounded-lg p-2" /><button type="submit" className="bg-gold text-black px-4 py-2 rounded-lg">Create</button><button onClick={() => setActiveTab('users')} className="ml-2 bg-white/5 px-4 py-2 rounded-lg">Cancel</button></form></div>
        )}
      </div>
    </div>
  );
}
