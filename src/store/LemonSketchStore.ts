import { create } from "zustand";
import type LemonEntity from "../core/entity/LemonEntity";
import type LemonSketchEntity from "../core/entity/LemonSketchEntity";

interface SketchStore {
  createSketchNumber: number;
  updateCreateSketchNumber: () => void;
  createSketchName: string;
  setCreateSketchName: (name: string) => void;
  createSketchEntity: LemonSketchEntity | null;
  setCreateSketchEntity: (entity: LemonSketchEntity | null) => void;
  createSketchPlaneEntity: LemonEntity | null;
  setCreateSketchPlaneEntity: (entity: LemonEntity | null) => void;
}

const useLemonSketchStore = create<SketchStore>((set) => ({
  createSketchNumber: 1,
  updateCreateSketchNumber: () => set((state) => ({ createSketchNumber: state.createSketchNumber + 1 })),
  createSketchName: "Sketch1",
  setCreateSketchName: (name) => set({ createSketchName: name }),
  createSketchEntity: null,
  setCreateSketchEntity: (entity) => set({ createSketchEntity: entity }),
  createSketchPlaneEntity: null,
  setCreateSketchPlaneEntity: (entity) => set({ createSketchPlaneEntity: entity }),
}));

export default useLemonSketchStore;
