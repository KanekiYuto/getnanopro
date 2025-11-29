import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
}

const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingText: undefined,
  showLoading: (text?: string) => set({ isLoading: true, loadingText: text }),
  hideLoading: () => set({ isLoading: false, loadingText: undefined }),
}));

export default useLoadingStore;
