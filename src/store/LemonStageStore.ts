import { create } from "zustand";
import type LemonEntity from "../core/entity/LemonEntity";
import type LemonEntityManager from "../core/entity/LemonEntityManager";
import type LemonInteractorManager from "../core/interactor/LemonInteractorManager";
import type LemonCamera from "../core/LemonCamera";
import type LemonEngine from "../core/LemonEngine";
import type LemonScene from "../core/LemonScene";
import type LemonDrawManager from "../draw/LemonDrawManager";

export enum LemonStageMode {
  None = "None",
  Sketch = "Sketch",
  Feature = "Feature",
}

type StageStore = {
  engine: LemonEngine;
  setEngine: (engine: LemonEngine) => void;
  scene: LemonScene;
  setScene: (scene: LemonScene) => void;
  camera: LemonCamera;
  setCamera: (camera: LemonCamera) => void;
  stageMode: LemonStageMode;
  setStageMode: (mode: LemonStageMode) => void;
  interactorManager: LemonInteractorManager;
  setInteractorManager: (manager: LemonInteractorManager) => void;
  entityManager: LemonEntityManager;
  setEntityManager: (manager: LemonEntityManager) => void;
  drawManager: LemonDrawManager;
  setDrawManager: (manager: LemonDrawManager) => void;
  entities: Array<LemonEntity>;
  setEntities: (entities: Array<LemonEntity>) => void;
};

const useLemonStageStore = create<StageStore>()((set) => ({
  engine: {} as LemonEngine,
  setEngine: (engine) => set({ engine }),
  scene: {} as LemonScene,
  setScene: (scene) => set({ scene }),
  camera: {} as LemonCamera,
  setCamera: (camera) => set({ camera }),
  stageMode: LemonStageMode.None,
  setStageMode: (mode) => set({ stageMode: mode }),
  interactorManager: {} as LemonInteractorManager,
  setInteractorManager: (manager) => set({ interactorManager: manager }),
  entityManager: {} as LemonEntityManager,
  setEntityManager: (manager) => set({ entityManager: manager }),
  drawManager: {} as LemonDrawManager,
  setDrawManager: (manager) => set({ drawManager: manager }),
  entities: [],
  setEntities: (entities) => set({ entities }),
}));

export default useLemonStageStore;
