import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const setAuthModalOpen = useUIStore((state) => state.setAuthModalOpen);

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

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative flex items-center justify-between px-6 py-3 rounded-2xl border border-white/10 transition-all duration-300 ${
          isScrolled ? 'bg-black/60 backdrop-blur-xl shadow-2xl' : 'bg-transparent'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="APEX ONE" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-sm font-medium text-gray-300 hover:text-[#D4AF37] transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-300">Welcome, {user.fullName}</span>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-sm font-medium text-[#D4AF37] hover:text-gold">Admin</Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setAuthModalOpen(true)} className="text-sm font-medium text-white hover:text-[#D4AF37] transition-colors">
                  Login
                </button>
                <button onClick={() => setAuthModalOpen(true)} className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#B8962E] text-black font-bold rounded-xl transition-all transform hover:scale-105 shadow-[0_4px_15px_rgba(212,175,55,0.2)]">
                  Open Account
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 p-6 bg-black/95 backdrop-blur-2xl rounded-2xl border border-white/10 md:hidden flex flex-col gap-6 z-50">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="text-lg font-medium text-gray-300" onClick={() => setMobileMenuOpen(false)}>
              {link.name}
            </Link>
          ))}
          <hr className="border-white/10" />
          {user ? (
            <>
              <span className="text-sm text-gray-300">Welcome, {user.fullName}</span>
              {user.role === 'ADMIN' && <Link to="/admin" className="text-lg font-medium text-[#D4AF37]">Admin</Link>}
              <button onClick={handleLogout} className="w-full py-3 bg-red-500/20 text-red-400 font-bold rounded-xl">Logout</button>
            </>
          ) : (
            <button onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }} className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-xl">
              Get Started
            </button>
          )}
        </div>
      )}
      <AuthModal />
    </nav>
  );
};

export default Navbar;
