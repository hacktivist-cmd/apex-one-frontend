import { useState } from 'react';
import { X, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import useUIStore from '../store/useUIStore';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen } = useUIStore();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { 
          email: formData.email, 
          password: formData.password 
        });
        setAuth(res.data.user, res.data.accessToken);
        setAuthModalOpen(false);
        window.location.href = res.data.user.role === 'ADMIN' ? '/admin' : '/dashboard';
      } else {
        // Registration: combine names
        const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`;
        await api.post('/auth/register', { 
          fullName, 
          email: formData.email, 
          phone: formData.phone,
          password: formData.password 
        });
        // Auto login after registration
        const res = await api.post('/auth/login', { 
          email: formData.email, 
          password: formData.password 
        });
        setAuth(res.data.user, res.data.accessToken);
        setAuthModalOpen(false);
        window.location.href = res.data.user.role === 'ADMIN' ? '/admin' : '/dashboard';
      }
    } catch (err) {
      console.error('Auth error:', err);
      const message = err.response?.data?.message || err.message || 'Authentication failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!authModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
        {/* Header with logo */}
        <div className="sticky top-0 bg-[#0A0A0A] border-b border-white/10 px-8 pt-6 pb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">APEX<span className="text-[#D4AF37]">ONE</span></span>
          </div>
          <button onClick={() => setAuthModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-2">
            {isLogin ? 'Welcome Back' : 'Broker Registration Form'}
          </h2>
          {!isLogin && (
            <p className="text-center text-gray-500 text-sm mb-6">
              Fill in your details to open an account
            </p>
          )}
          <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent my-6" />

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                {/* Name fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      placeholder="Optional"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {isLogin && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#D4AF37] text-black font-black rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    firstName: '',
                    middleName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    password: '',
                  });
                }}
                className="text-[#D4AF37] hover:underline font-medium"
              >
                {isLogin ? 'Register now' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
