import { create } from "zustand";
import type LemonEngine from "../core/LemonEngine";
import type LemonPickManager from "../core/LemonPickManager";
import type LemonScene from "../core/LemonScene";

type StageStore = {
  engine: LemonEngine;
  setEngine: (engine: LemonEngine) => void;
  scene: LemonScene;
  setScene: (scene: LemonScene) => void;
  pickManager: LemonPickManager;
  setPickManager: (manager: LemonPickManager) => void;
};

const useLemonStageStore = create<StageStore>()((set) => ({
  engine: {} as LemonEngine,
  setEngine: (engine) => set({ engine }),
  scene: {} as LemonScene,
  setScene: (scene) => set({ scene }),
  pickManager: {} as LemonPickManager,
  setPickManager: (manager) => set({ pickManager: manager }),
}));

export default useLemonStageStore;
