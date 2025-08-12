import { create } from "zustand";
import type LemonEngine from "../core/LemonEngine";
import type LemonScene from "../core/LemonScene";
import type LemonInteractorManager from "../core/interactor/LemonInteractorManager";

type StageStore = {
  engine: LemonEngine;
  setEngine: (engine: LemonEngine) => void;
  scene: LemonScene;
  setScene: (scene: LemonScene) => void;
  interactorManager: LemonInteractorManager;
  setInteractorManager: (manager: LemonInteractorManager) => void;
};

const useLemonStageStore = create<StageStore>()((set) => ({
  engine: {} as LemonEngine,
  setEngine: (engine) => set({ engine }),
  scene: {} as LemonScene,
  setScene: (scene) => set({ scene }),
  interactorManager: {} as LemonInteractorManager,
  setInteractorManager: (manager) => set({ interactorManager: manager }),
}));

export default useLemonStageStore;
