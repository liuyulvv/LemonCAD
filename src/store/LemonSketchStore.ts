import { create } from "zustand";
import type LemonSketchEntity from "../core/entity/LemonSketchEntity";

interface SketchStore {
  sketchNumber: number;
  setSketchNumber: (number: number) => void;
  sketchName: string;
  setSketchName: (name: string) => void;
  sketchEntity: LemonSketchEntity | null;
  setSketchEntity: (entity: LemonSketchEntity | null) => void;
}

const useLemonSketchStore = create<SketchStore>((set) => ({
  sketchNumber: 1,
  setSketchNumber: (sketchNumber) => set({ sketchNumber }),
  sketchName: "Sketch1",
  setSketchName: (name) => set({ sketchName: name }),
  sketchEntity: null,
  setSketchEntity: (entity) => set({ sketchEntity: entity }),
}));

export default useLemonSketchStore;
