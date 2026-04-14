import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const setAuthModalOpen = useUIStore((state) => state.setAuthModalOpen);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Markets', path: '/markets' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3 bg-black/80 backdrop-blur-xl shadow-2xl' : 'py-5 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="APEX ONE" className="h-10 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-sm font-medium text-gray-300 hover:text-[#D4AF37] transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-gray-300 hover:text-[#D4AF37] transition-colors">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setAuthModalOpen(true)} className="text-sm font-medium text-white hover:text-[#D4AF37] transition-colors">
                  Login
                </button>
                <button onClick={() => setAuthModalOpen(true)} className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#B8962E] text-black font-bold rounded-xl transition-all transform hover:scale-105 shadow-md">
                  Open Account
                </button>
              </>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="text-lg font-medium text-gray-300 hover:text-[#D4AF37]" onClick={() => setMobileMenuOpen(false)}>
              {link.name}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" className="text-lg font-medium text-gray-300 hover:text-[#D4AF37]" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="text-lg font-medium text-red-400 text-left">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }} className="text-lg font-medium text-gray-300 hover:text-[#D4AF37] text-left">Login</button>
              <button onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }} className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-xl text-center">Open Account</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
