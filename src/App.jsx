import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black">
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/legal-audit" element={<LegalAudit />} />
          <Route path="/oauth-redirect" element={<OAuthRedirect />} />

          {/* Protected client routes (with sidebar) */}
          <Route element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/kyc" element={<Kyc />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Admin route */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPortal /></ProtectedRoute>} />
          <Route path="/markets" element={<ProtectedRoute><Markets /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
