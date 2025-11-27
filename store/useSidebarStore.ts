import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleCollapsed: () => void;
}

const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  isCollapsed: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  closeSidebar: () => set({ isOpen: false }),
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));

export default useSidebarStore;
