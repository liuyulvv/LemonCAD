import { create } from "zustand";

type FootStore = {
  tip: string;
  setTip: (tip: string) => void;
  clearTip: () => void;
};

const useLemonFootStore = create<FootStore>()((set) => ({
  tip: "",
  setTip: (tip) => set({ tip }),
  clearTip: () => set({ tip: "" }),
}));

export default useLemonFootStore;
