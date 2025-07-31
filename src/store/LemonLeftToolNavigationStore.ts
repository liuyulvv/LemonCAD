import { create } from "zustand";

type LeftToolNavigationStore = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

const useLeftToolNavigationStore = create<LeftToolNavigationStore>()((set) => ({
  collapsed: true,
  setCollapsed: (collapsed) => set({ collapsed }),
}));

export default useLeftToolNavigationStore;
