import { create } from "zustand";
import type LemonEngine from "../core/LemonEngine";
import type LemonScene from "../core/LemonScene";
import type LemonEntityManager from "../core/entity/LemonEntityManager";
import type LemonInteractorManager from "../core/interactor/LemonInteractorManager";

type StageStore = {
  engine: LemonEngine;
  setEngine: (engine: LemonEngine) => void;
  scene: LemonScene;
  setScene: (scene: LemonScene) => void;
  interactorManager: LemonInteractorManager;
  setInteractorManager: (manager: LemonInteractorManager) => void;
  entityManager: LemonEntityManager;
  setEntityManager: (manager: LemonEntityManager) => void;
};

const useLemonStageStore = create<StageStore>()((set) => ({
  engine: {} as LemonEngine,
  setEngine: (engine) => set({ engine }),
  scene: {} as LemonScene,
  setScene: (scene) => set({ scene }),
  interactorManager: {} as LemonInteractorManager,
  setInteractorManager: (manager) => set({ interactorManager: manager }),
  entityManager: {} as LemonEntityManager,
  setEntityManager: (manager) => set({ entityManager: manager }),
}));

export default useLemonStageStore;
