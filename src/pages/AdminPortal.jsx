import { useState, useEffect } from 'react';
import { TrendingUp, Users, Wallet, History, MessageSquare, Play, Pause, RefreshCw, ChevronRight, BarChart3, Edit2, Trash2, UserPlus } from 'lucide-react';
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
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [editingBalance, setEditingBalance] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const [simUser, setSimUser] = useState(null);
  const [simRate, setSimRate] = useState(0.05);
  const [simActive, setSimActive] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({ fullName: '', email: '', password: '', role: 'USER', availableBalance: 0 });

  const fetchUsers = async () => {
    const res = await api.get('/admin/users');
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleUpdateBalance = async (userId) => {
    await api.patch(`/admin/users/${userId}/balance`, { availableBalance: parseFloat(newBalance) });
    fetchUsers();
    setEditingBalance(null);
    setNewBalance('');
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete this user?')) {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    await api.post('/admin/users', createUserForm);
    fetchUsers();
    setCreateUserForm({ fullName: '', email: '', password: '', role: 'USER', availableBalance: 0 });
  };

  const startSimulation = async () => {
    if (!simUser) return alert('Select a user');
    await api.post('/admin/simulation/start', { userId: simUser, growthRate: simRate });
    setSimActive(true);
    alert('Simulation started');
  };

  const stopSimulation = async () => {
    if (!simUser) return;
    await api.post('/admin/simulation/stop', { userId: simUser });
    setSimActive(false);
    alert('Simulation stopped');
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button onClick={() => setView('LANDING')} className="text-gold text-xs font-bold mb-2 flex items-center gap-1"><ChevronRight className="rotate-180" size={14} /> Exit</button>
            <h1 className="text-3xl font-black">Admin Control Center</h1>
          </div>
          <div className="text-right"><div className="text-xs text-gray-500">System Status</div><div className="text-green-400 font-mono text-sm">● OPERATIONAL</div></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Users" value={users.length} icon={Users} />
          <StatCard title="Total AUM" value={`$${users.reduce((s, u) => s + u.availableBalance, 0).toLocaleString()}`} icon={BarChart3} />
          <StatCard title="Admins" value={users.filter(u => u.role === 'ADMIN').length} icon={Shield} />
        </div>

        <div className="flex gap-2 border-b border-white/10 mb-6">
          {['users', 'simulate', 'create'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-t-xl font-medium transition ${activeTab === tab ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'}`}>{tab.toUpperCase()}</button>
          ))}
        </div>

        {activeTab === 'users' && (
          <div className="glass-card p-6 overflow-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10"><th className="text-left py-2">Name</th><th>Email</th><th>Balance</th><th>Role</th><th>Actions</th></tr></thead>
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
                    <td>{u.role}</td>
                    <td className="py-2"><button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:bg-red-500/10 p-1 rounded"><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'simulate' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Wealth Rise Simulation</h3>
            <div className="space-y-4">
              <select onChange={e => setSimUser(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-2">
                <option value="">Select User</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.fullName} (${u.availableBalance})</option>)}
              </select>
              <div><label className="text-xs text-gray-500">Growth Rate per Pulse (%)</label><input type="number" step="0.01" value={simRate} onChange={e => setSimRate(parseFloat(e.target.value))} className="w-full bg-black border border-white/10 rounded-lg p-2" /></div>
              <div className="flex gap-4">
                <button onClick={startSimulation} className="bg-gold text-black px-4 py-2 rounded-lg flex items-center gap-2"><Play size={16} /> Start</button>
                <button onClick={stopSimulation} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2"><Pause size={16} /> Stop</button>
              </div>
              {simActive && <p className="text-green-500 text-sm">Simulation running for selected user...</p>}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><UserPlus size={20} /> Create New User</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input type="text" placeholder="Full Name" value={createUserForm.fullName} onChange={e => setCreateUserForm({...createUserForm, fullName: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-2" required />
              <input type="email" placeholder="Email" value={createUserForm.email} onChange={e => setCreateUserForm({...createUserForm, email: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-2" required />
              <input type="password" placeholder="Password" value={createUserForm.password} onChange={e => setCreateUserForm({...createUserForm, password: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-2" required />
              <select value={createUserForm.role} onChange={e => setCreateUserForm({...createUserForm, role: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-2"><option value="USER">User</option><option value="ADMIN">Admin</option></select>
              <input type="number" placeholder="Initial Balance" value={createUserForm.availableBalance} onChange={e => setCreateUserForm({...createUserForm, availableBalance: parseFloat(e.target.value)})} className="w-full bg-black border border-white/10 rounded-lg p-2" />
              <button type="submit" className="bg-gold text-black px-4 py-2 rounded-lg">Create User</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
