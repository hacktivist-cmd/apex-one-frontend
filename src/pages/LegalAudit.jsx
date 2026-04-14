import React from 'react';
import { motion } from 'framer-motion';
import { Scale, ShieldCheck, Gavel, ClipboardList, History, Briefcase, Globe, FileCheck, ExternalLink, ArrowLeft } from 'lucide-react';

const AUDIT_REPORTS = [
  { firm: "Deloitte & Touche", type: "Financial Reserve Audit", date: "Q3 2024", status: "Verified", description: "Full attestation of segregated client assets and 1:1 reserve backing for digital holdings." },
  { firm: "Chainalysis", type: "KYT / AML Compliance", date: "Continuous", status: "Active", description: "Real-time monitoring of on-chain transactions to prevent illicit flow of funds and maintain regulatory hygiene." },
  { firm: "KPMG", type: "Operational Risk Assessment", date: "Bi-Annual", status: "Certified", description: "Evaluation of internal controls, MPC key management, and institutional security infrastructure." }
];

const LICENSES = [
  { jurisdiction: "Switzerland", body: "FINMA", ref: "CH-882.409.11", status: "Active" },
  { jurisdiction: "Singapore", body: "MAS", ref: "SG-PS-2024-09", status: "Authorized" },
  { jurisdiction: "Global", body: "ISO/IEC 27001", ref: "IS-774201", status: "Certified" }
];

export default function LegalAudit() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-24">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4"><Gavel className="w-4 h-4" /> Transparency Report v4.0</motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase">LEGAL <span className="text-[#D4AF37]">AUDIT</span></h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">APEX ONE operates under a multi-jurisdictional regulatory framework, undergoing rigorous quarterly examinations to ensure the total solvency and security of institutional client assets.</p>
        </div>

        <div className="mb-24"><h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 mb-8">Registry of Licenses</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{LICENSES.map((license, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all"><div><p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-1">{license.jurisdiction}</p><p className="text-sm font-bold text-white uppercase">{license.body}</p><p className="text-[10px] text-gray-600 font-mono mt-2">{license.ref}</p></div><div className="text-right"><div className="flex items-center gap-1.5 text-green-500 text-[10px] font-black uppercase tracking-widest"><ShieldCheck className="w-3 h-3" /> {license.status}</div></div></motion.div>))}</div></div>

        <div className="space-y-6 mb-24"><h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 mb-8">Recent Attestations</h2>{AUDIT_REPORTS.map((report, idx) => (<motion.div key={idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 md:p-12 hover:border-white/10 transition-all group"><div className="flex flex-col md:flex-row justify-between gap-8"><div className="md:w-1/3"><div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all"><ClipboardList className="w-5 h-5" /></div><div><h3 className="font-black text-xl">{report.firm}</h3><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{report.date}</p></div></div><span className="inline-block px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest rounded border border-green-500/20">Pass / Unqualified Opinion</span></div><div className="md:w-2/3 border-l border-white/5 md:pl-12"><h4 className="text-lg font-bold mb-4 flex items-center gap-2">{report.type} <History className="w-4 h-4 text-gray-600" /></h4><p className="text-gray-500 text-sm leading-relaxed mb-8">{report.description}</p><button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:underline">View Full PDF Attestation <ExternalLink className="w-3 h-3" /></button></div></div></motion.div>))}</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-20 border-t border-white/5"><div><div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6"><Briefcase className="w-6 h-6 text-[#D4AF37]" /></div><h2 className="text-3xl font-black mb-6 uppercase tracking-tighter leading-none">Institutional <br /> Relations Desk</h2><p className="text-gray-500 text-sm leading-relaxed">Our compliance team is available for direct consultation with Tier-1 fund managers and sovereign wealth officers regarding specific jurisdictional requirements.</p></div><div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[2.5rem] flex flex-col justify-center gap-6"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center"><Globe className="w-5 h-5 text-gray-500" /></div><div><p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Primary Jurisdiction</p><p className="text-sm font-bold">Zug, Switzerland (Crypto Valley)</p></div></div><button className="w-full py-5 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] transition-transform">Request Due Diligence Pack</button></div></div>
      </div>
    </div>
  );
}
