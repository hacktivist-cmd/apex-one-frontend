import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function OAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userParam = params.get('user');
    if (token && userParam) {
      const user = JSON.parse(decodeURIComponent(userParam));
      setAuth(user, token);
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } else {
      navigate('/');
    }
  }, [location, navigate, setAuth]);

  return <div className="min-h-screen flex items-center justify-center text-white">Authenticating...</div>;
}
