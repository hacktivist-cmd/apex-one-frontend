import { useEffect } from 'react';
import io from 'socket.io-client';
import useAuthStore from '../store/useAuthStore';

let socket;

export const useSocket = () => {
  const user = useAuthStore((state) => state.user);
  const updateBalance = useAuthStore((state) => state.updateBalance);

  useEffect(() => {
    if (user && !socket) {
      socket = io('/', { query: { userId: user.id } });
      socket.on('balance-update', (data) => {
        updateBalance(data.availableBalance);
      });
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [user, updateBalance]);
};
