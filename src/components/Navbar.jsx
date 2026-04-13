import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Menu, X } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useUIStore from '../store/useUIStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const setAuthModalOpen = useUIStore(state => state.setAuthModalOpen);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#AA8418] rounded-lg flex items-center justify-center">
              <TrendingUp className="text-black w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">APEX<span className="text-[#D4AF37]">ONE</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-gray-300 hover:text-[#D4AF37] transition">Dashboard</Link>
            <Link to="/markets" className="text-gray-300 hover:text-[#D4AF37] transition">Markets</Link>
            <Link to="/portfolio" className="text-gray-300 hover:text-[#D4AF37] transition">Portfolio</Link>
            <Link to="/about" className="text-gray-300 hover:text-[#D4AF37] transition">About</Link>
            <Link to="/contact" className="text-gray-300 hover:text-[#D4AF37] transition">Contact</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-400">{user.fullName}</span>
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600/20 hover:bg-red-600/30 rounded-lg transition">Logout</button>
              </>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="px-4 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-yellow-500 transition">Sign In</button>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10 p-4 flex flex-col space-y-3">
          <Link to="/dashboard" className="text-gray-300 hover:text-[#D4AF37] py-2" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
          <Link to="/markets" className="text-gray-300 hover:text-[#D4AF37] py-2" onClick={() => setMobileMenuOpen(false)}>Markets</Link>
          <Link to="/portfolio" className="text-gray-300 hover:text-[#D4AF37] py-2" onClick={() => setMobileMenuOpen(false)}>Portfolio</Link>
          <Link to="/about" className="text-gray-300 hover:text-[#D4AF37] py-2" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link to="/contact" className="text-gray-300 hover:text-[#D4AF37] py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          {user ? (
            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left text-red-400 py-2">Logout</button>
          ) : (
            <button onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }} className="text-left text-[#D4AF37] py-2">Sign In</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
