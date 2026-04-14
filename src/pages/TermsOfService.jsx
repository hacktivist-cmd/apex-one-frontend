import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Info, ShieldCheck, Lock, ChevronRight } from 'lucide-react';

const LegalSection = ({ title, children }) => (
  <div className="mb-12">
    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
      <div className="w-1 h-6 bg-[#D4AF37] rounded-full" />
      {title}
    </h3>
    <div className="text-gray-400 text-sm leading-relaxed space-y-4">{children}</div>
  </div>
);

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20">
              <Scale className="text-[#D4AF37] w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Terms of Service</h1>
              <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-bold">Effective Date: January 01, 2024</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-start gap-4">
            <Info className="text-[#D4AF37] w-5 h-5 mt-1 shrink-0" />
            <p className="text-sm text-gray-400">
              Please read these terms carefully. By accessing the APEX ONE terminal, you acknowledge that you are an institutional or accredited investor as defined by your local regulatory authority.
            </p>
          </div>
        </header>

        <div className="space-y-4">
          <LegalSection title="1. Acceptance of Terms">
            <p>By accessing or using the services provided by APEX ONE Financial Group ("Company", "We", "Our"), including our digital asset custody, trading terminal, and portfolio management tools, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            <p>If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
          </LegalSection>

          <LegalSection title="2. Institutional Eligibility">
            <p>The APEX ONE platform is exclusively intended for "Accredited Investors," "Qualified Purchasers," or "Institutional Clients" as defined under the Securities Act of 1933 or the equivalent regulatory framework in your jurisdiction.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Minimum account equity requirements apply for all Priority and VIP tiers.</li>
              <li>Verification of institutional status is required via our KYC/KYB protocol.</li>
              <li>Services are not available to retail investors or residents of prohibited jurisdictions.</li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Risk Disclosure">
            <p>Trading digital assets involves significant risk. The value of digital assets can be extremely volatile and may result in the total loss of principal. APEX ONE does not provide investment, tax, or legal advice.</p>
            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
              <p className="text-red-400 font-bold mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Market Risk Warning</p>
              <p className="text-xs text-gray-500">Past performance is not indicative of future results. Leveraging and margin trading significantly increase the risk of liquidation.</p>
            </div>
          </LegalSection>

          <LegalSection title="4. Custody & Security">
            <p>APEX ONE utilizes Multi-Party Computation (MPC) and hardware security modules (HSM) for asset custody. While we maintain industry-leading security protocols, the client acknowledges the inherent risks of digital asset storage.</p>
            <p>Assets held in "Cold Storage" are insured up to the policy limits specified in your Master Service Agreement (MSA).</p>
          </LegalSection>

          <LegalSection title="5. Termination">
            <p>We reserve the right to suspend or terminate your access to the platform at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the platform, us, or third parties, or for any other reason.</p>
          </LegalSection>
        </div>

        <footer className="mt-20 pt-12 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm mb-8">Should you have questions regarding these terms, please contact our Legal & Compliance department via the secure concierge terminal.</p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-[#D4AF37] text-black font-black rounded-xl hover:scale-105 transition-transform flex items-center gap-2">Download PDF <ChevronRight className="w-4 h-4" /></button>
            <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">Print Document</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
