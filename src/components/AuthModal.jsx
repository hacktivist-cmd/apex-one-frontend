import { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import useUIStore from '../store/useUIStore';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen } = useUIStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });
        setAuth(res.data.user, res.data.accessToken);
        setAuthModalOpen(false);
        window.location.href = res.data.user.role === 'ADMIN' ? '/admin' : '/dashboard';
      } else {
        await api.post('/auth/register', { fullName, email, password });
        const res = await api.post('/auth/login', { email, password });
        setAuth(res.data.user, res.data.accessToken);
        setAuthModalOpen(false);
        window.location.href = res.data.user.role === 'ADMIN' ? '/admin' : '/dashboard';
      }
    } catch (err) {
      console.error('Auth error:', err);
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!authModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-2xl w-full max-w-md p-8 relative shadow-2xl">
        <button 
          onClick={() => setAuthModalOpen(false)} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        {/* Logo at the top */}
        <div className="flex justify-center mb-6">
          <Link to="/" onClick={() => setAuthModalOpen(false)}>
            <img src="/logo.png" alt="APEX ONE" className="h-12 w-auto" />
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center text-[#D4AF37] mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[#D4AF37] hover:underline font-medium"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
