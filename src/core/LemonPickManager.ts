import type { PickingInfo } from "@babylonjs/core";
import LemonEntity from "./entity/LemonEntity";
import LemonScene from "./LemonScene";

export interface LemonPickInfo {
  distance: number;
  pickedEntity: LemonEntity;
}

export default class LemonPickManager {
  private scene!: LemonScene;
  private static instance: LemonPickManager;
  private pickedEntities: Array<LemonEntity> = [];

  private constructor() {}

  public static getInstance(scene?: LemonScene): LemonPickManager {
    if (!LemonPickManager.instance) {
      LemonPickManager.instance = new LemonPickManager();
    }
    if (scene) {
      LemonPickManager.instance.scene = scene;
    }
    return LemonPickManager.instance;
  }

  public addPickEntity(entity: LemonEntity) {
    this.pickedEntities.push(entity);
    entity.onSelected(true);
  }

  public removePickEntity(entity: LemonEntity) {
    const index = this.pickedEntities.indexOf(entity);
    if (index !== -1) {
      this.pickedEntities.splice(index, 1);
      entity.onSelected(false);
    }
  }

  public clearPickedEntities() {
    this.pickedEntities.forEach((entity) => {
      entity.onSelected(false);
    });
    this.pickedEntities = [];
  }

  public pickEntity(): LemonEntity | null {
    const pickInfo = this.getPickInfo();
    const result = this.sortPickInfo(pickInfo);
    return result.length > 0 ? result[0].pickedEntity : null;
  }

  public pickEntities(): Array<LemonEntity> {
    const pickInfo = this.getPickInfo();
    const result = this.sortPickInfo(pickInfo);
    return result.map((info) => info.pickedEntity);
  }

  private getPickInfo(): Array<PickingInfo> {
    const info = this.scene.multiPick(this.scene.pointerX, this.scene.pointerY, (mesh) => {
      let root = mesh;
      while (root.parent) {
        root = root.parent as LemonEntity;
      }
      let entity = root as LemonEntity;
      return entity.isEnabled() && entity.isVisible && entity.isPickable;
    });
    return info ? info : [];
  }

  private sortPickInfo(pickInfo: Array<PickingInfo>): Array<LemonPickInfo> {
    const info: Array<LemonPickInfo> = [];
    const inserted: Set<string> = new Set();
    for (const pick of pickInfo) {
      if (pick.hit) {
        const mesh = pick.pickedMesh;
        if (mesh) {
          const entity = mesh.parent as LemonEntity;
          const root = entity.getRootEntity();
          if (inserted.has(root.id)) {
            continue;
          }
          inserted.add(root.id);
          info.push({
            distance: pick.distance,
            pickedEntity: root,
          });
        }
      }
    }
    info.sort((a, b) => {
      return a.distance - b.distance;
    });
    return info;
  }
}
