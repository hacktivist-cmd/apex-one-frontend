import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, ShieldCheck, Zap, Globe, ArrowRight, ChevronRight,
  BarChart3, Lock, Star, Mail, Send, User, Phone, MessageSquare, X
} from 'lucide-react';
import AuthModal from '../components/AuthModal';
import useUIStore from '../store/useUIStore';
import api from '../api/axios';

// Hero Section
const Hero = () => {
  const setAuthModalOpen = useUIStore(state => state.setAuthModalOpen);
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000" alt="Trading background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full backdrop-blur-sm">The Future of Wealth Management</span>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight">Watch Your <br /><span className="bg-gradient-to-r from-[#D4AF37] via-[#F3D06D] to-[#D4AF37] bg-clip-text text-transparent">Wealth Rise</span></h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg">Experience institutional-grade crypto investment tools. Deposit, track, and scale your portfolio with APEX ONE.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => setAuthModalOpen(true)} className="px-8 py-4 bg-[#D4AF37] text-black font-black rounded-xl text-lg flex items-center gap-2 hover:scale-105 transition-transform shadow-lg">Open Account <ArrowRight className="w-5 h-5" /></button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl text-lg hover:bg-white/20 transition-colors">View Markets</button>
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

// Review Form Modal (public submission)
const ReviewFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await onSubmit({ name, email, rating, text });
      setMessage('Thank you! Your review will be published after admin approval.');
      setTimeout(() => { onClose(); setName(''); setEmail(''); setRating(5); setText(''); setMessage(''); }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Leave a Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-xs text-gray-500">Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl p-3" /></div>
          <div><label className="text-xs text-gray-500">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl p-3" /></div>
          <div><label className="text-xs text-gray-500">Rating</label><div className="flex gap-2">{[...Array(5)].map((_, i) => <Star key={i} size={24} className={`cursor-pointer ${i < rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-500'}`} onClick={() => setRating(i+1)} />)}</div></div>
          <div><label className="text-xs text-gray-500">Review</label><textarea value={text} onChange={e => setText(e.target.value)} rows="4" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3"></textarea></div>
          {message && <div className="p-2 bg-green-500/10 text-green-500 rounded text-sm">{message}</div>}
          <button type="submit" disabled={loading} className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-xl">{loading ? 'Submitting...' : 'Submit Review'}</button>
        </form>
      </div>
    </div>
  );
};

// Marquee Reviews
const MarqueeReviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;
  const doubled = [...reviews, ...reviews];
  return (
    <div className="w-full overflow-hidden whitespace-nowrap bg-black/40 backdrop-blur-sm border-y border-white/5 py-3">
      <div className="inline-flex animate-marquee">
        {doubled.map((review, idx) => (
          <div key={idx} className="inline-flex items-center gap-4 mx-8">
            <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-sm font-bold">{review.name.charAt(0)}</div><div><p className="text-sm font-semibold">{review.name}</p><div className="flex text-[#D4AF37] text-xs">{Array(review.rating).fill().map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div></div></div>
            <p className="text-gray-300 text-sm italic">"{review.text.slice(0, 100)}..."</p>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Client Reviews Section (grid + marquee)
const ReviewsSection = ({ reviews, onOpenReviewForm }) => {
  const approvedReviews = reviews.filter(r => r.isActive);
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-gray-400">Trusted by investors worldwide</p>
          <button onClick={onOpenReviewForm} className="mt-6 bg-gold text-black px-6 py-2 rounded-lg font-semibold">Leave a Review</button>
        </div>
        {approvedReviews.length > 0 && <MarqueeReviews reviews={approvedReviews} />}
        {approvedReviews.length === 0 && <p className="text-center text-gray-500">Be the first to leave a review!</p>}
      </div>
    </section>
  );
};

// Footer (same as before)
const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await api.post('/newsletter/subscribe', { email });
      setMessage('Subscribed!');
      setEmail('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage('Error'); }
  };
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div><Link to="/" className="flex items-center gap-2 mb-6"><img src="/logo.png" alt="APEX ONE" className="h-10 w-auto" /></Link><p className="text-gray-500 text-sm">Redefining digital asset management.</p></div>
          <div><h4 className="text-white font-bold mb-6">Quick Links</h4><ul className="space-y-3"><li><Link to="/markets" className="text-gray-500 hover:text-gold">Markets</Link></li><li><Link to="/about" className="text-gray-500 hover:text-gold">About</Link></li><li><Link to="/contact" className="text-gray-500 hover:text-gold">Contact</Link></li></ul></div>
          <div><h4 className="text-white font-bold mb-6">Legal</h4><ul className="space-y-3"><li><Link to="/terms" className="text-gray-500 hover:text-gold">Terms</Link></li><li><Link to="/privacy" className="text-gray-500 hover:text-gold">Privacy</Link></li><li><Link to="/cookies" className="text-gray-500 hover:text-gold">Cookies</Link></li><li><Link to="/legal-audit" className="text-gray-500 hover:text-gold">Legal Audit</Link></li></ul></div>
          <div><h4 className="text-white font-bold mb-6">Newsletter</h4><form onSubmit={handleSubscribe} className="flex gap-2"><input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2" /><button type="submit" className="bg-gold text-black p-2 rounded-lg"><Send size={18} /></button></form>{message && <p className="text-xs text-gold mt-2">{message}</p>}</div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600"><p>© 2025 APEX ONE. All rights reserved.</p><div className="flex gap-4"><Lock className="w-4 h-4"/><ShieldCheck className="w-4 h-4"/></div></div>
      </div>
    </footer>
  );
};

// Main Landing Page
export default function LandingPage() {
  const [reviews, setReviews] = useState([]);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleSubmitReview = async (reviewData) => {
    await api.post('/reviews/submit', reviewData);
    // Do not refetch immediately – will appear after admin approval
  };

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
      <ReviewsSection reviews={reviews} onOpenReviewForm={() => setReviewFormOpen(true)} />
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
      <ReviewFormModal isOpen={reviewFormOpen} onClose={() => setReviewFormOpen(false)} onSubmit={handleSubmitReview} />
    </div>
  );
}
