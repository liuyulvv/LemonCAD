import { create } from "zustand";

interface SketchStore {
  sketchNumber: number;
  setSketchNumber: (number: number) => void;
}

const useLemonSketchStore = create<SketchStore>((set) => ({
  sketchNumber: 0,
  setSketchNumber: (sketchNumber) => set({ sketchNumber }),
}));

export default useLemonSketchStore;
