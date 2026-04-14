import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import useUIStore from '../store/useUIStore';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen } = useUIStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState({ firstName: '', middleName: '', lastName: '' });
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  // Password strength check
  const isStrongPassword = (pwd) => {
    const hasMinLength = pwd.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin) {
      // Validate strong password
      if (!isStrongPassword(password)) {
        setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character.');
        return;
      }
      // Validate phone and postcode
      if (!phone || phone.length < 10) {
        setError('Please enter a valid phone number.');
        return;
      }
      if (!postcode || postcode.length < 3) {
        setError('Please enter a valid postcode/ZIP code.');
        return;
      }
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });
        setAuth(res.data.user, res.data.accessToken);
        setAuthModalOpen(false);
        window.location.href = res.data.user.role === 'ADMIN' ? '/admin' : '/dashboard';
      } else {
        const fullNameStr = `${fullName.firstName} ${fullName.middleName} ${fullName.lastName}`.trim().replace(/\s+/g, ' ');
        await api.post('/auth/register', { 
          fullName: fullNameStr, 
          email, 
          password,
          phone,
          postcode
        });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-y-auto py-8">
      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-2xl w-full max-w-md p-8 relative shadow-2xl my-8">
        <button onClick={() => setAuthModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
        
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
            <>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={fullName.firstName}
                  onChange={(e) => setFullName({...fullName, firstName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                  required
                />
                <input
                  type="text"
                  placeholder="Middle Name (Optional)"
                  value={fullName.middleName}
                  onChange={(e) => setFullName({...fullName, middleName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Last Name"
                value={fullName.lastName}
                onChange={(e) => setFullName({...fullName, lastName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                required
              />
              <input
                type="text"
                placeholder="Postcode / ZIP Code"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                required
              />
            </>
          )}
          
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
            required
          />
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {!isLogin && !isStrongPassword(password) && password.length > 0 && (
            <p className="text-xs text-yellow-500">Weak password: use 8+ chars with uppercase, lowercase, number, and special character.</p>
          )}
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>
        
        {/* Social Login Placeholder */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0A0A0A] px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2 hover:bg-white/10 transition">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span className="text-sm">Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2 hover:bg-white/10 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
              </svg>
              <span className="text-sm">Apple</span>
            </button>
          </div>
        </div>
        
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
