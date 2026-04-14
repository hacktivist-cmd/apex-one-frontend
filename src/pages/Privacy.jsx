import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Server, EyeOff, Clock, Search, ChevronRight, Globe, FileText, Terminal } from 'lucide-react';

const POLICY_SECTIONS = [
  { id: "data-collection", title: "Data Acquisition", icon: Server, content: "We collect institutional-grade identifiers including corporate registration details, authorized signatory biometrics, and source-of-wealth documentation. All acquisition is performed via 256-bit AES encrypted channels." },
  { id: "encryption", title: "Cryptographic Standards", icon: Lock, content: "Client data is stored using Multi-Party Computation (MPC) architecture. Personal Identifiable Information (PII) is decoupled from transaction metadata, ensuring that even in a breach scenario, data remains indecipherable." },
  { id: "third-party", title: "Disclosure Protocols", icon: EyeOff, content: "APEX ONE does not engage in data monetization. Information disclosure is strictly limited to regulatory authorities under valid subpoena within the jurisdictions of Switzerland and Singapore." },
  { id: "retention", title: "Data Longevity", icon: Clock, content: "Pursuant to global AML/CFT regulations, records are maintained for a period of seven (7) years post-account termination. Following this period, data is purged using DoD 5220.22-M standard wiping protocols." }
];

export default function Privacy() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            <Terminal className="w-4 h-4" /> Document 882-PRIVACY-01
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
            PRIVACY <span className="text-gray-700">&</span> <br /><span className="text-[#D4AF37]">DATA GOVERNANCE</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-500 text-lg leading-relaxed max-w-2xl">
            This document outlines the cryptographic and legal frameworks governing the protection of institutional assets and identity data within the APEX ONE ecosystem.
          </motion.p>
        </div>

        <div className="relative mb-16">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
          <input type="text" placeholder="Filter protocol sections..." className="w-full bg-white/5 border border-white/5 rounded-2xl py-6 pl-16 pr-6 text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all" onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {POLICY_SECTIONS.filter(s => s.title.toLowerCase().includes(searchQuery)).map((section, idx) => (
            <motion.div key={section.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2rem] hover:border-[#D4AF37]/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37] transition-all"><section.icon className="w-6 h-6 text-[#D4AF37] group-hover:text-black transition-all" /></div>
              <h3 className="text-xl font-bold mb-4">{section.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{section.content}</p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-[#D4AF37] transition-colors cursor-pointer">View Full Legal Clause <ChevronRight className="w-3 h-3" /></div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white/5 rounded-[2.5rem] p-8 md:p-12 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><Globe className="w-64 h-64" /></div>
          <div className="relative z-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] mb-6">Jurisdictional Framework</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div><p className="text-sm font-bold">GDPR (EEA)</p><p className="text-xs text-gray-500">Full compliance with the General Data Protection Regulation for all European entities.</p></div>
              <div><p className="text-sm font-bold">DPA (Switzerland)</p><p className="text-xs text-gray-500">Adherence to the highest standards of the Swiss Federal Act on Data Protection.</p></div>
              <div><p className="text-sm font-bold">PDPA (Singapore)</p><p className="text-xs text-gray-500">Strict data sovereignty protocols in accordance with the Personal Data Protection Act.</p></div>
            </div>
          </div>
        </motion.div>

        <div className="mt-32 text-center pb-20">
          <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-8"><FileText className="w-6 h-6 text-[#D4AF37]" /></div>
          <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">Integrity Through Transparency</h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto mb-10">By continuing to utilize the APEX ONE terminal, you acknowledge and agree to the cryptographic governance standards detailed herein.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button className="px-10 py-4 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 transition-transform">Accept Protocol</button>
            <button className="px-10 py-4 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white/5 transition-colors">Contact Compliance Desk</button>
          </div>
        </div>
      </div>
    </div>
  );
}
