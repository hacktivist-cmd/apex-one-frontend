import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, ShieldCheck, Zap, Globe, ArrowRight, Menu, X, ChevronRight,
  BarChart3, Lock
} from 'lucide-react';
import AuthModal from '../components/AuthModal';
import useUIStore from '../store/useUIStore';

const GlassNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const setAuthModalOpen = useUIStore(state => state.setAuthModalOpen);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Markets', path: '/markets' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative flex items-center justify-between px-6 py-3 rounded-2xl border border-white/10 transition-all duration-300 ${
          isScrolled ? 'bg-black/60 backdrop-blur-xl shadow-2xl' : 'bg-transparent'
        }`}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#AA8418] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <TrendingUp className="text-black w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">
              APEX<span className="text-[#D4AF37]">ONE</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-sm font-medium text-gray-300 hover:text-[#D4AF37] transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => setAuthModalOpen(true)} className="text-sm font-medium text-white hover:text-[#D4AF37] transition-colors">
              Login
            </button>
            <button onClick={() => setAuthModalOpen(true)} className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#B8962E] text-black font-bold rounded-xl transition-all transform hover:scale-105 shadow-[0_4px_15px_rgba(212,175,55,0.2)]">
              Start Rising
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-4 right-4 mt-2 p-6 bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/10 md:hidden flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-lg font-medium text-gray-300 hover:text-[#D4AF37]">{link.name}</Link>
            ))}
            <hr className="border-white/10" />
            <button onClick={() => setAuthModalOpen(true)} className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-xl">
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// TradingView Ticker component (same as before)
const TradingViewTicker = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [
        { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
        { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" },
        { "proName": "BINANCE:BNBUSD", "title": "BNB" },
        { "proName": "BINANCE:SOLUSD", "title": "Solana" },
        { "proName": "BINANCE:ADAUSD", "title": "Cardano" }
      ],
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "en"
    });
    const container = document.getElementById('tv-ticker');
    if (container) container.appendChild(script);
  }, []);
  return <div id="tv-ticker" className="w-full overflow-hidden bg-black/40 backdrop-blur-sm border-y border-white/5 py-1"></div>;
};

// Hero Section (unchanged, but ensure buttons open modal)
const Hero = () => {
  const setAuthModalOpen = useUIStore(state => state.setAuthModalOpen);
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full">
            The Future of Wealth Management
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight">
            Watch Your <br />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3D06D] to-[#D4AF37] bg-clip-text text-transparent">
              Wealth Rise
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience institutional-grade crypto investment tools. Deposit, track, and scale your portfolio with APEX ONE's high-performance ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => setAuthModalOpen(true)} className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] text-black font-black rounded-xl text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(212,175,55,0.3)]">
              Open Account <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-lg hover:bg-white/10 transition-colors">
              View Markets
            </button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 100 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="mt-20 relative">
          <div className="relative mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-2 backdrop-blur-3xl shadow-2xl">
            <img src="https://images.unsplash.com/photo-1642790103300-97e13b1fceb5?auto=format&fit=crop&q=80&w=2000" alt="Dashboard Preview" className="rounded-2xl opacity-80" onError={(e) => { e.target.src = "https://via.placeholder.com/1200x600/0a0a0a/D4AF37?text=APEX+ONE+DASHBOARD"; }} />
            <div className="absolute -top-10 -right-10 hidden lg:block p-4 bg-black/80 backdrop-blur-xl border border-[#D4AF37]/30 rounded-2xl shadow-2xl animate-bounce-slow">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center"><TrendingUp className="text-green-500 w-5 h-5" /></div><div><p className="text-[10px] text-gray-400 uppercase font-bold">Daily Profit</p><p className="text-white font-bold">+12.45%</p></div></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Features Section (shortened for brevity, but include all four features)
const Features = () => {
  const features = [
    { title: "Secure Custody", desc: "Multi-sig cold storage for all digital assets.", icon: <ShieldCheck className="w-8 h-8 text-[#D4AF37]" /> },
    { title: "Real-time Growth", desc: "Watch your balance evolve in real-time.", icon: <Zap className="w-8 h-8 text-[#D4AF37]" /> },
    { title: "Global Access", desc: "Manage your wealth from anywhere.", icon: <Globe className="w-8 h-8 text-[#D4AF37]" /> },
    { title: "Insightful Analytics", desc: "Detailed equity curves and performance metrics.", icon: <BarChart3 className="w-8 h-8 text-[#D4AF37]" /> }
  ];
  return (
    <section id="features" className="py-24 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16"><h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Engineered for Excellence</h2><p className="text-gray-400 max-w-2xl mx-auto">We combine cutting-edge technology with traditional financial security.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 transition-all group">
              <div className="mb-6 p-3 w-fit rounded-2xl bg-white/5 group-hover:bg-[#D4AF37]/10 transition-colors">{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer (shortened)
const Footer = () => (
  <footer className="bg-black border-t border-white/5 pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div><div className="flex items-center gap-2 mb-6"><div className="w-8 h-8 bg-[#D4AF37] rounded flex items-center justify-center"><TrendingUp className="text-black w-5 h-5" /></div><span className="text-xl font-bold tracking-tighter text-white">APEX<span className="text-[#D4AF37]">ONE</span></span></div><p className="text-gray-500 text-sm leading-relaxed">Redefining the digital asset landscape.</p></div>
        <div><h4 className="text-white font-bold mb-6">Platform</h4><ul className="space-y-4 text-sm text-gray-500"><li><a href="#" className="hover:text-[#D4AF37]">Market Overview</a></li><li><a href="#" className="hover:text-[#D4AF37]">Pricing Plans</a></li></ul></div>
        <div><h4 className="text-white font-bold mb-6">Company</h4><ul className="space-y-4 text-sm text-gray-500"><li><a href="#" className="hover:text-[#D4AF37]">About Us</a></li><li><a href="#" className="hover:text-[#D4AF37]">Terms</a></li></ul></div>
        <div><h4 className="text-white font-bold mb-6">Newsletter</h4><div className="flex gap-2"><input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white" /><button className="p-2 bg-[#D4AF37] rounded-lg text-black"><ChevronRight className="w-5 h-5" /></button></div></div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600"><p>© 2024 APEX ONE Wealth Management.</p><div className="flex gap-6"><span className="flex items-center gap-1"><Lock className="w-3 h-3"/> SSL Encrypted</span><span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> FCA Regulated</span></div></div>
    </div>
  </footer>
);

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black font-sans">
      <GlassNavbar />
      <main>
        <Hero />
        <TradingViewTicker />
        <section className="py-12 border-b border-white/5"><div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around gap-8 text-center"><div><p className="text-3xl font-black text-white">$12.4B+</p><p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Assets Managed</p></div><div><p className="text-3xl font-black text-white">240K+</p><p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Active Investors</p></div><div><p className="text-3xl font-black text-white">140+</p><p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Countries Supported</p></div><div><p className="text-3xl font-black text-[#D4AF37]">0.01s</p><p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Trade Execution</p></div></div></section>
        <Features />
        <section className="py-24 relative overflow-hidden"><div className="absolute inset-0 bg-[#D4AF37]/5" /><div className="max-w-4xl mx-auto px-4 relative z-10 text-center"><h2 className="text-4xl md:text-6xl font-black mb-8">Ready to witness the rise?</h2><p className="text-gray-400 text-lg mb-10">Join thousands of investors who have already secured their future with APEX ONE.</p><button onClick={() => useUIStore.getState().setAuthModalOpen(true)} className="px-10 py-5 bg-[#D4AF37] text-black font-black rounded-2xl text-xl shadow-[0_20px_50px_rgba(212,175,55,0.3)] hover:scale-105 transition-transform">Create Free Account</button></div></section>
      </main>
      <Footer />
      <AuthModal />
      <style>{`@keyframes bounce-slow{0%,100%{transform:translateY(-5%)}50%{transform:translateY(5%)}}.animate-bounce-slow{animation:bounce-slow 4s ease-in-out infinite;}`}</style>
    </div>
  );
}
