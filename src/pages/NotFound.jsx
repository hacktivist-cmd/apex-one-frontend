import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Search, RefreshCcw, Terminal, Activity, ChevronRight, BarChart3, Cpu } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col justify-center items-center px-6 selection:bg-[#D4AF37] selection:text-black font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-900/10 via-transparent to-black opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[160px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
      </div>

      <div className="absolute top-10 left-10 z-20">
        <Link to="/" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 bg-[#D4AF37] flex items-center justify-center rounded-sm"><Cpu className="text-black w-4 h-4" /></div>
          <span className="text-lg font-black tracking-tighter uppercase">Apex<span className="text-[#D4AF37]">One</span></span>
        </Link>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative inline-block mb-8">
          <h1 className="text-[12rem] md:text-[20rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.p initial={{ letterSpacing: "0.2em", opacity: 0.5 }} animate={{ letterSpacing: "0.8em", opacity: 1 }} transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }} className="text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[0.8em] ml-[0.8em] whitespace-nowrap">Liquidity_Outlier_Detected</motion.p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight leading-none">UNRESOLVED <span className="text-[#D4AF37]">SETTLEMENT PATH</span></h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed font-medium">The requested asset endpoint or smart contract route is currently non-existent in our order book. The vault clearance may have timed out or the margin protocol has been updated.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/" className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all group"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Go Home</Link>
          <Link to="/markets" className="flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-black border border-[#D4AF37] rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_40px_rgba(212,175,55,0.2)]"><BarChart3 className="w-4 h-4" /> Markets</Link>
        </motion.div>
      </div>

      <div className="absolute bottom-10 w-full px-10 flex flex-col md:flex-row justify-between items-center gap-6 z-20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-700"><ShieldAlert className="w-3.5 h-3.5 text-red-900" /> Trace ID: 0xFX_NULL_88</div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-700"><Activity className="w-3.5 h-3.5" /> Latency: 0.00ms (Halted)</div>
        </div>
        <div className="flex items-center gap-4"><p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Session re-sync in 24s</p><div className="w-6 h-6 border-2 border-gray-800 border-t-[#D4AF37] rounded-full animate-spin" /></div>
      </div>
    </div>
  );
}
