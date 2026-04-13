import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Zap, Users, Cpu, Lock, ChevronRight, TrendingUp, LayoutDashboard, PieChart, ArrowRightLeft, Activity, Settings, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-[#D4AF37] text-black font-bold shadow-[0_4px_20px_rgba(212,175,55,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    <Icon className="w-5 h-5" /><span className="text-sm">{label}</span>
  </div>
);

const ValueProp = ({ icon: Icon, title, description }) => (
  <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl hover:border-[#D4AF37]/30 transition-all group">
    <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="text-[#D4AF37] w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </div>
);

export default function About() {
  const setView = useUIStore((state) => state.setView);
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = () => { logout(); setView('LANDING'); };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      <aside className="w-64 border-r border-white/5 p-6 hidden lg:flex flex-col gap-8 fixed inset-y-0">
        <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center"><TrendingUp className="text-black w-5 h-5" /></div><span className="text-xl font-bold tracking-tighter text-white">APEX<span className="text-[#D4AF37]">ONE</span></span></div>
        <nav className="flex-1 flex flex-col gap-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" onClick={() => setView('DASHBOARD')} />
          <SidebarItem icon={Globe} label="Markets" onClick={() => setView('MARKETS')} />
          <SidebarItem icon={PieChart} label="Portfolio" onClick={() => setView('DASHBOARD')} />
          <SidebarItem icon={Users} label="About Us" active onClick={() => {}} />
          <SidebarItem icon={Settings} label="Settings" onClick={() => setView('DASHBOARD')} />
        </nav>
        <div className="pt-6 border-t border-white/5"><button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-sm w-full"><LogOut className="w-4 h-4" /> Sign Out</button></div>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12">
        <section className="relative py-20 overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#0A0A0A] to-transparent border border-white/5 mb-16">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#D4AF37]/5 blur-[120px] rounded-full" />
          <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mb-6"><ShieldCheck className="w-3 h-3" /> Established 2014</motion.div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">The Standard in <span className="text-[#D4AF37]">Digital Asset</span> Custody.</h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10">APEX ONE provides institutional-grade infrastructure for the world's most sophisticated investors, merging traditional financial rigor with frontier technology.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 bg-[#D4AF37] text-black font-black rounded-2xl shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:scale-105 transition-transform flex items-center gap-2">Join the Network <ChevronRight className="w-5 h-5" /></button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors">View Governance</button>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-12"><h2 className="text-3xl font-black mb-2 tracking-tight">Pillars of Excellence</h2><p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Our Commitment to Security and Performance</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ValueProp icon={Lock} title="Military-Grade Security" description="Our MPC-based custody solution ensures that private keys never exist in a single location, providing protection against both physical and cyber threats." />
            <ValueProp icon={Zap} title="Ultra-Low Latency" description="Execute trades with sub-millisecond latency through our global Tier-1 data center presence in London, New York, and Tokyo." />
            <ValueProp icon={Globe} title="Global Compliance" description="Fully licensed and regulated across multiple jurisdictions, adhering to the highest standards of AML, KYC, and financial reporting." />
            <ValueProp icon={Cpu} title="Advanced Algorithms" description="Access proprietary execution algorithms designed to minimize market impact and capture alpha in highly volatile environments." />
            <ValueProp icon={Activity} title="Real-time Auditing" description="Proof of Reserves updated every block. Our transparent ledger allows for continuous verification of asset backing." />
            <ValueProp icon={ShieldCheck} title="Insured Assets" description="Our cold storage holdings are backed by a comprehensive insurance policy through Lloyds of London, covering up to $500M." />
          </div>
        </section>

        <section className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div><h2 className="text-4xl font-black mb-6 tracking-tight leading-tight">Trusted by over <span className="text-[#D4AF37]">250+</span> Global Institutions.</h2><p className="text-gray-500 mb-8 leading-relaxed">From family offices to sovereign wealth funds, APEX ONE is the choice for those who demand uncompromising performance and total discretion.</p>
              <div className="grid grid-cols-2 gap-8">
                <div><p className="text-3xl font-black text-white">$42B+</p><p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Assets Under Custody</p></div>
                <div><p className="text-3xl font-black text-white">15ms</p><p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Execution Speed</p></div>
                <div><p className="text-3xl font-black text-white">99.99%</p><p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Uptime Record</p></div>
                <div><p className="text-3xl font-black text-white">24/7</p><p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Expert Support</p></div>
              </div>
            </div>
            <div className="relative"><div className="aspect-video bg-gradient-to-tr from-[#D4AF37]/20 to-transparent rounded-2xl border border-white/5 flex items-center justify-center"><Globe className="w-32 h-32 text-[#D4AF37] opacity-20 animate-pulse" /><div className="absolute inset-0 flex items-center justify-center"><div className="w-3/4 h-3/4 border border-[#D4AF37]/10 rounded-full animate-ping" /></div></div></div>
          </div>
        </section>

        <div className="mt-20 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center"><TrendingUp className="text-black w-5 h-5" /></div><span className="text-lg font-bold tracking-tighter">APEX ONE</span></div>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">© 2024 APEX ONE FINANCIAL GROUP. ALL RIGHTS RESERVED. SEC REGULATED.</p>
        </div>
      </main>
    </div>
  );
}
