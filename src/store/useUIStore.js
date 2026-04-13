import { create } from 'zustand';

const useUIStore = create((set) => ({
  view: 'LANDING',
  setView: (view) => set({ view }),
  authModalOpen: false,
  setAuthModalOpen: (open) => set({ authModalOpen: open }),
}));

export default useUIStore;
