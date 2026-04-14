import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ClientLayout from './layouts/ClientLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Kyc from './pages/Kyc';
import Settings from './pages/Settings';
import AdminPortal from './pages/AdminPortal';
import Markets from './pages/Markets';
import About from './pages/About';
import Contact from './pages/Contact';
import TermsOfService from './pages/TermsOfService';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import LegalAudit from './pages/LegalAudit';
import OAuthRedirect from './pages/OAuthRedirect';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/dashboard', '/admin', '/transactions', '/profile', '/kyc', '/settings'];
  const shouldHideNavbar = hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen bg-black">
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/legal-audit" element={<LegalAudit />} />
        <Route path="/oauth-redirect" element={<OAuthRedirect />} />

        <Route element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/kyc" element={<Kyc />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPortal /></ProtectedRoute>} />
        <Route path="/markets" element={<ProtectedRoute><Markets /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
