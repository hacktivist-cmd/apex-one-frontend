import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Phone, ShieldCheck, Globe, TrendingUp, LayoutDashboard, PieChart, Users, Settings, LogOut, Send, Headphones, CheckCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';
import api from '../api/axios';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-[#D4AF37] text-black font-bold shadow-[0_4px_20px_rgba(212,175,55,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    <Icon className="w-5 h-5" /><span className="text-sm">{label}</span>
  </div>
);

const ContactCard = ({ icon: Icon, title, value, description }) => (
  <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl hover:border-[#D4AF37]/30 transition-all group">
    <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Icon className="text-[#D4AF37] w-6 h-6" /></div>
    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">{title}</p>
    <h3 className="text-lg font-bold text-white mb-2">{value}</h3>
    <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
  </div>
);

export default function Contact() {
  const { user } = useAuthStore();
  const setView = useUIStore((state) => state.setView);
  const logout = useAuthStore((state) => state.logout);
  const [formData, setFormData] = useState({ name: user?.fullName || '', email: user?.email || '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);
    try {
      await api.post('/contact', { ...formData, userId: user?.id });
      setStatus({ type: 'success', message: 'Message sent successfully! We will respond within 24 hours.' });
      setFormData({ ...formData, message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); setView('LANDING'); };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <aside className="w-64 border-r border-white/5 p-6 hidden lg:flex flex-col gap-8 fixed inset-y-0">
        <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center"><TrendingUp className="text-black w-5 h-5" /></div><span className="text-xl font-bold tracking-tighter text-white">APEX<span className="text-[#D4AF37]">ONE</span></span></div>
        <nav className="flex-1 flex flex-col gap-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" onClick={() => setView('DASHBOARD')} />
          <SidebarItem icon={Globe} label="Markets" onClick={() => setView('MARKETS')} />
          <SidebarItem icon={PieChart} label="Portfolio" onClick={() => setView('DASHBOARD')} />
          <SidebarItem icon={Users} label="About" onClick={() => setView('ABOUT')} />
          <SidebarItem icon={MessageSquare} label="Support" active onClick={() => {}} />
          <SidebarItem icon={Settings} label="Settings" onClick={() => setView('SETTINGS')} />
        </nav>
        <div className="pt-6 border-t border-white/5"><button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-sm w-full"><LogOut className="w-4 h-4" /> Sign Out</button></div>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12">
        <header className="mb-12"><h1 className="text-3xl font-black mb-2">Concierge Terminal</h1><div className="flex items-center gap-4 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold"><span className="flex items-center gap-1.5 text-[#D4AF37]"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" /> Priority Support Active</span><span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Secure Channel</span></div></header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 lg:p-10">
            <h2 className="text-2xl font-bold mb-2">Secure Message Inquiry</h2>
            <p className="text-gray-500 text-sm mb-8">Submit an encrypted request to your dedicated relationship manager. Response time: &lt; 15 mins.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]" /></div>
              </div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Message</label><textarea rows="5" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] resize-none"></textarea></div>
              {status.message && <div className={`p-3 rounded-xl flex items-center gap-2 ${status.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>{status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}{status.message}</div>}
              <button type="submit" disabled={loading} className="w-full py-4 bg-[#D4AF37] text-black font-black rounded-2xl shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50">Dispatch Secure Inquiry <Send className="w-4 h-4" /></button>
            </form>
          </div>

          <div className="space-y-6">
            <ContactCard icon={Headphones} title="Concierge Desk" value="+1 (888) APEX-ONE" description="24/7 dedicated line for Priority and VIP tier members worldwide." />
            <ContactCard icon={Mail} title="Secure Email" value="desk@apexone.fi" description="PGP-encrypted communication for institutional trade settlement." />
            <ContactCard icon={MapPin} title="Global HQ" value="Mayfair, London" description="12 Berkeley Square, London W1J 6BD, United Kingdom." />
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 p-8 rounded-[2.5rem] relative overflow-hidden group">
              <div className="relative z-10"><h4 className="font-bold text-white mb-2">Live Chat Terminal</h4><p className="text-xs text-gray-500 mb-6 leading-relaxed">Connect instantly with an available asset manager for real-time guidance.</p><button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:gap-3 transition-all">Initialize Session <Send className="w-3 h-3" /></button></div>
              <Globe className="absolute -bottom-10 -right-10 w-32 h-32 text-[#D4AF37] opacity-5 group-hover:rotate-12 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
