import React from 'react';
import { motion } from 'framer-motion';
import { Database, ShieldCheck, Lock, Cpu, Info, ChevronRight, ExternalLink } from 'lucide-react';

const COOKIE_GROUPS = [
  { title: "Essential System Tokens", category: "Strictly Necessary", description: "These tokens are required for session persistence and identity authentication. Without these, secure access to the brokerage terminal is impossible.", items: ["Session ID", "Auth Token", "CSRF Protection"], status: "Mandatory" },
  { title: "Market Preference Storage", category: "Functional", description: "Stores local UI preferences including chart intervals, dark pool layout configurations, and selected base currency pairs.", items: ["UI Settings", "Chart Config", "Locale Preferences"], status: "Optional" },
  { title: "Execution Diagnostics", category: "Performance", description: "Aggregated, non-PII data used to measure terminal latency and execution speed across different global access points.", items: ["Latency Logs", "Node Tracking", "Load Balancing"], status: "Optional" }
];

export default function Cookies() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4"><Cpu className="w-4 h-4" /> Terminal Asset 019-COOKIE-PROTOCOL</motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">COOKIE <span className="text-[#D4AF37]">PROTOCOLS</span></h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">We utilize persistent and session-based local identifiers to ensure the integrity of the trading environment and optimize high-frequency execution speeds.</p>
        </div>

        <div className="space-y-6 mb-24">
          {COOKIE_GROUPS.map((group, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start hover:border-[#D4AF37]/30 transition-all group">
              <div className="md:w-1/3"><div className="flex items-center gap-3 mb-4"><span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${group.status === 'Mandatory' ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-[#D4AF37] border border-[#D4AF37]/20'}`}>{group.status}</span></div><h3 className="text-xl font-bold mb-2 group-hover:text-[#D4AF37] transition-colors">{group.title}</h3><p className="text-[#D4AF37]/60 text-[10px] font-black uppercase tracking-widest">{group.category}</p></div>
              <div className="md:w-2/3 border-l border-white/5 md:pl-8"><p className="text-gray-500 text-sm leading-relaxed mb-6">{group.description}</p><div className="flex flex-wrap gap-3">{group.items.map(item => (<span key={item} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item}</span>))}</div></div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20 border-t border-white/5">
          <div><h2 className="text-3xl font-black mb-6 uppercase tracking-tighter">Diagnostic Transparency</h2><p className="text-gray-500 text-sm leading-relaxed mb-8">APEX ONE operates on a "Zero-Third-Party" analytics model. We do not integrate external trackers from advertising networks or social platforms. All diagnostic data remains within our private cloud infrastructure.</p><div className="space-y-4"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-green-500" /></div><span className="text-xs font-bold text-gray-400 uppercase tracking-widest">No Third-Party Advertising Cookies</span></div><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center"><Lock className="w-5 h-5 text-[#D4AF37]" /></div><span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hardened Cross-Site Scripting (XSS) Protection</span></div></div></div>
          <div className="bg-[#0A0A0A] border border-white/5 p-1 rounded-3xl overflow-hidden shadow-2xl"><div className="bg-white/5 p-4 flex items-center gap-2 border-b border-white/5"><div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500/50" /><div className="w-2 h-2 rounded-full bg-yellow-500/50" /><div className="w-2 h-2 rounded-full bg-green-500/50" /></div><span className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-4">Local_Storage_Inspector.exe</span></div><div className="p-6 font-mono text-[11px] space-y-2"><p className="text-green-500 tracking-tighter">{`> Scanning active terminal tokens...`}</p><p className="text-gray-500">{`[SUCCESS] __apex_session_id: encrypted_blob_v4`}</p><p className="text-gray-500">{`[SUCCESS] __apex_chart_prefs: { "pair": "BTC/USD", "interval": "1m" }`}</p><p className="text-[#D4AF37]">{`[ACTIVE] __apex_mpc_shard_01: status_verified`}</p><p className="text-gray-500 animate-pulse">{`> Monitoring latency... 0.04ms`}</p></div></div>
        </div>

        <div className="bg-[#D4AF37] rounded-[2.5rem] p-12 text-center text-black mt-20"><h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">Privacy Override</h2><p className="text-black/70 text-sm max-w-lg mx-auto mb-10 font-bold uppercase tracking-tight">Institutional users may opt-out of all non-essential telemetry. Note that certain UI preference persistence will be disabled.</p><div className="flex flex-col md:flex-row justify-center gap-4"><button className="px-10 py-4 bg-black text-[#D4AF37] font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 transition-transform">Reset Terminal Storage</button><button className="px-10 py-4 border border-black/20 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-black/5 transition-colors">Preference Center</button></div></div>
      </div>
    </div>
  );
}
