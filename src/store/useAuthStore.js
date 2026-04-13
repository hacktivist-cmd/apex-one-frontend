import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, token) => set({ user, accessToken: token }),
      logout: () => set({ user: null, accessToken: null }),
      updateBalance: (newBalance) => set((state) => ({
        user: state.user ? { ...state.user, availableBalance: newBalance } : null
      })),
    }),
    { name: 'auth-storage' }
  )
);

export default useAuthStore;
