import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, ShieldCheck, Zap, Globe, ArrowRight, ChevronRight,
  BarChart3, Lock, Star, Mail, Send, Facebook, Twitter, Linkedin, Instagram
} from 'lucide-react';
import AuthModal from '../components/AuthModal';
import useUIStore from '../store/useUIStore';
import api from '../api/axios';

// Hero Section with full‑screen background image
const Hero = () => {
  const setAuthModalOpen = useUIStore(state => state.setAuthModalOpen);
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000" 
          alt="Trading background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full backdrop-blur-sm">
            The Future of Wealth Management
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight">
            Watch Your <br />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3D06D] to-[#D4AF37] bg-clip-text text-transparent">
              Wealth Rise
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg">
            Experience institutional-grade crypto investment tools. Deposit, track, and scale your portfolio with APEX ONE.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => setAuthModalOpen(true)} className="px-8 py-4 bg-[#D4AF37] text-black font-black rounded-xl text-lg flex items-center gap-2 hover:scale-105 transition-transform shadow-lg">
              Open Account <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl text-lg hover:bg-white/20 transition-colors">
              View Markets
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// TradingView Ticker
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
        { "proName": "BINANCE:SOLUSD", "title": "Solana" }
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

// Features Section
const Features = () => {
  const features = [
    { icon: ShieldCheck, title: "Secure Custody", desc: "Multi-sig cold storage for all digital assets." },
    { icon: Zap, title: "Real-time Growth", desc: "Watch your balance evolve in real-time." },
    { icon: Globe, title: "Global Access", desc: "Manage your wealth from anywhere." },
    { icon: BarChart3, title: "Insightful Analytics", desc: "Detailed equity curves and performance metrics." }
  ];
  return (
    <section className="py-24 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16"><h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Engineered for Excellence</h2><p className="text-gray-400 max-w-2xl mx-auto">We combine cutting-edge technology with traditional financial security.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 transition-all group">
              <div className="mb-6 p-3 w-fit rounded-2xl bg-white/5 group-hover:bg-[#D4AF37]/10 transition-colors"><f.icon className="text-[#D4AF37] w-8 h-8" /></div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Client Reviews Section (with fallback)
const Reviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-gray-400">Be the first to leave a review!</p>
        </div>
      </section>
    );
  }
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12"><h2 className="text-3xl md:text-5xl font-bold text-white mb-4">What Our Clients Say</h2><p className="text-gray-400">Trusted by investors worldwide</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <img src={review.image || "https://randomuser.me/api/portraits/men/1.jpg"} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                <div><h4 className="font-bold">{review.name}</h4><div className="flex text-[#D4AF37]">{Array(review.rating).fill().map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div></div>
              </div>
              <p className="text-gray-300 italic">"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Newsletter Footer Component
const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await api.post('/newsletter/subscribe', { email });
      setMessage('Subscribed successfully!');
      setEmail('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Subscription failed');
    }
  };
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6"><TrendingUp className="text-gold w-8 h-8" /><span className="text-2xl font-bold">APEX ONE</span></div>
            <p className="text-gray-500 text-sm">Redefining digital asset management with precision and security.</p>
          </div>
          <div><h4 className="text-white font-bold mb-6">Quick Links</h4><ul className="space-y-3"><li><a href="/markets" className="text-gray-500 hover:text-gold transition">Markets</a></li><li><a href="/about" className="text-gray-500 hover:text-gold transition">About Us</a></li><li><a href="/contact" className="text-gray-500 hover:text-gold transition">Contact</a></li><li><a href="/dashboard" className="text-gray-500 hover:text-gold transition">Dashboard</a></li></ul></div>
          <div><h4 className="text-white font-bold mb-6">Legal</h4><ul className="space-y-3"><li><a href="#" className="text-gray-500 hover:text-gold transition">Terms of Service</a></li><li><a href="#" className="text-gray-500 hover:text-gold transition">Privacy Policy</a></li><li><a href="#" className="text-gray-500 hover:text-gold transition">Cookie Policy</a></li></ul></div>
          <div><h4 className="text-white font-bold mb-6">Legal</h4><ul className="space-y-3"><li><Link to="/terms" className="text-gray-500 hover:text-gold transition">Terms of Service</Link></li><li><Link to="/privacy" className="text-gray-500 hover:text-gold transition">Privacy Policy</Link></li><li><Link to="/cookies" className="text-gray-500 hover:text-gold transition">Cookie Policy</Link></li><li><Link to="/legal-audit" className="text-gray-500 hover:text-gold transition">Legal Audit</Link></li></ul></div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© 2025 APEX ONE. All rights reserved.</p>
          <div className="flex gap-4"><Lock className="w-4 h-4"/><ShieldCheck className="w-4 h-4"/></div>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews');
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to load reviews:', err);
        // Fallback to empty array (no reviews shown)
        setReviews([]);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Hero />
      <TradingViewTicker />
      <div className="py-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around gap-8 text-center">
          <div><p className="text-3xl font-black">$12.4B+</p><p className="text-xs text-gray-500">Assets Managed</p></div>
          <div><p className="text-3xl font-black">240K+</p><p className="text-xs text-gray-500">Active Investors</p></div>
          <div><p className="text-3xl font-black">140+</p><p className="text-xs text-gray-500">Countries</p></div>
          <div><p className="text-3xl font-black text-[#D4AF37]">0.01s</p><p className="text-xs text-gray-500">Execution</p></div>
        </div>
      </div>
      <Features />
      <Reviews reviews={reviews} />
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#D4AF37]/5" />
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to witness the rise?</h2>
          <p className="text-gray-400 text-lg mb-10">Join thousands of investors who have already secured their future with APEX ONE.</p>
          <button onClick={() => useUIStore.getState().setAuthModalOpen(true)} className="px-10 py-5 bg-[#D4AF37] text-black font-black rounded-2xl text-xl shadow-lg hover:scale-105 transition-transform">Create Free Account</button>
        </div>
      </section>
      <Footer />
      <AuthModal />
    </div>
  );
}
