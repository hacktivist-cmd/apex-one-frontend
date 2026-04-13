import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Wallet, History, MessageSquare, 
  Play, Pause, RefreshCw, ChevronRight, BarChart3,
  Edit2, Trash2, UserPlus, Plus, X
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
  const [users, setUsers] = useState([]);
  const [editingBalance, setEditingBalance] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: '', email: '', password: '', availableBalance: 0 });
  const [simulating, setSimulating] = useState(null);
  const [simPercent, setSimPercent] = useState(0.5);

  const fetchUsers = async () => {
    const res = await api.get('/admin/users');
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBalanceEdit = async (userId, newBalance) => {
    await api.patch(`/admin/users/${userId}/balance`, { availableBalance: parseFloat(newBalance) });
    await fetchUsers();
    setEditingBalance(null);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await api.delete(`/admin/users/${userId}`);
      await fetchUsers();
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    await api.post('/admin/users', newUser);
    setShowCreateModal(false);
    setNewUser({ fullName: '', email: '', password: '', availableBalance: 0 });
    await fetchUsers();
  };

  const handleSimulate = async (userId) => {
    setSimulating(userId);
    try {
      await api.post(`/admin/simulate/${userId}`, { growthPercent: simPercent });
      await fetchUsers();
    } catch (err) {
      console.error('Simulation failed', err);
    }
    setSimulating(null);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button onClick={() => setView('LANDING')} className="text-gold text-xs font-bold mb-2 flex items-center gap-1"><ChevronRight className="rotate-180" size={14} /> Exit</button>
            <h1 className="text-3xl font-black">Admin Control Center</h1>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="bg-gold text-black px-4 py-2 rounded-xl flex items-center gap-2"><UserPlus size={18} /> Create User</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Users" value={users.length} icon={Users} />
          <StatCard title="Total AUM" value={`$${users.reduce((s, u) => s + u.availableBalance, 0).toLocaleString()}`} icon={Wallet} />
          <StatCard title="Admins" value={users.filter(u => u.role === 'ADMIN').length} icon={TrendingUp} />
        </div>

        <div className="glass-card p-6 overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10"><th className="text-left py-2">Name</th><th>Email</th><th>Balance</th><th>Role</th><th>Simulate</th><th>Actions</th></tr></thead>
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
                  <td className="py-2">{u.role}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <input type="number" step="0.1" defaultValue={0.5} onChange={(e) => setSimPercent(parseFloat(e.target.value))} className="w-16 bg-black border border-white/10 rounded px-1 py-0.5 text-xs" />
                      <button onClick={() => handleSimulate(u._id)} disabled={simulating === u._id} className="text-gold text-xs">Apply %</button>
                    </div>
                  </td>
                  <td className="py-2">
                    <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-400"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0A0A0A] border border-gold/20 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Create User</h2><button onClick={() => setShowCreateModal(false)}><X /></button></div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input type="text" placeholder="Full Name" value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-2" required />
              <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-2" required />
              <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-2" required />
              <input type="number" placeholder="Initial Balance" value={newUser.availableBalance} onChange={e => setNewUser({...newUser, availableBalance: parseFloat(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl p-2" />
              <button type="submit" className="w-full bg-gold text-black py-2 rounded-xl">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
