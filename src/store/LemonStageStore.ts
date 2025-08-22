import { create } from "zustand";
import type LemonEntityManager from "../core/entity/LemonEntityManager";
import type LemonInteractorManager from "../core/interactor/LemonInteractorManager";
import type LemonCamera from "../core/LemonCamera";
import type LemonEngine from "../core/LemonEngine";
import type LemonScene from "../core/LemonScene";

type StageStore = {
  engine: LemonEngine;
  setEngine: (engine: LemonEngine) => void;
  scene: LemonScene;
  setScene: (scene: LemonScene) => void;
  camera: LemonCamera;
  setCamera: (camera: LemonCamera) => void;
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
  camera: {} as LemonCamera,
  setCamera: (camera) => set({ camera }),
  interactorManager: {} as LemonInteractorManager,
  setInteractorManager: (manager) => set({ interactorManager: manager }),
  entityManager: {} as LemonEntityManager,
  setEntityManager: (manager) => set({ entityManager: manager }),
}));

export default useLemonStageStore;
