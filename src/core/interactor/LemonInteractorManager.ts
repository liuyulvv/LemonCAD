import { Observer, PointerEventTypes, PointerInfo, type PickingInfo } from "@babylonjs/core";
import { LemonDocumentType } from "../../documents/LemonDocument";
import useLemonStageStore, { LemonStageMode } from "../../store/LemonStageStore";
import type LemonEntity from "../entity/LemonEntity";
import LemonScene from "../LemonScene";
import type LemonInteractorFilter from "./LemonInteractorFilter";
import type { LemonInteractorInfo } from "./LemonInteractorFilter";

export interface LemonPickInfo {
  distance: number;
  pickedEntity: LemonEntity;
}

export default class LemonInteractorManager {
  private scene: LemonScene;
  private interactorFilters: LemonInteractorFilter[] = [];
  private interactorInfo: LemonInteractorInfo;
  private pickedEntities: LemonEntity[] = [];
  private hoveredEntity: LemonEntity | null = null;

  private observerInfo: Observer<PointerInfo>;

  private leftPressed: boolean = false;
  private leftPressMoved: boolean = false;

  public constructor(scene: LemonScene) {
    this.scene = scene;
    this.interactorInfo = {
      screenX: 0,
      screenY: 0,
      worldX: 0,
      worldY: 0,
      worldZ: 0,
    };
    this.observerInfo = this.scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type == PointerEventTypes.POINTERDOWN) {
        if (pointerInfo.event.button == 0) {
          this.onLeftButtonDown();
        } else if (pointerInfo.event.button == 2) {
          this.onRightButtonDown();
        }
      } else if (pointerInfo.type == PointerEventTypes.POINTERUP) {
        if (pointerInfo.event.button == 0) {
          this.onLeftButtonUp();
        } else if (pointerInfo.event.button == 2) {
          this.onRightButtonUp();
        }
      } else if (pointerInfo.type == PointerEventTypes.POINTERMOVE) {
        this.onMouseMove();
      }
    });
  }

  public insertFilter(filter: LemonInteractorFilter): void {
    this.interactorFilters.push(filter);
    this.interactorFilters.sort((a, b) => b.getFilterOrder() - a.getFilterOrder());
  }

  public removeFilter(filter: LemonInteractorFilter): void {
    this.interactorFilters = this.interactorFilters.filter((f) => f != filter);
  }

  private fillInteractorInfo(): void {
    this.interactorInfo = {
      screenX: this.scene.pointerX,
      screenY: this.scene.pointerY,
      worldX: 0, // placeholder
      worldY: 0, // placeholder
      worldZ: 0, // placeholder
    };
  }

  public onLeftButtonDown(): void {
    this.leftPressed = true;
    this.fillInteractorInfo();
    for (const filter of this.interactorFilters) {
      if (filter.onLeftButtonDown(this.interactorInfo)) {
        return;
      }
    }
  }

  public onLeftButtonUp(): void {
    this.leftPressed = false;
    this.fillInteractorInfo();
    for (const filter of this.interactorFilters) {
      if (filter.onLeftButtonUp(this.interactorInfo)) {
        return;
      }
    }
    if (this.leftPressMoved) {
      this.leftPressMoved = false;
      return;
    }
    const pickedEntity = this.pickEntity();
    if (pickedEntity) {
      if (pickedEntity.isSelected()) {
        this.removePickedEntity(pickedEntity);
      } else {
        this.pushPickedEntity(pickedEntity);
      }
    }
  }

  public onRightButtonDown(): void {
    this.fillInteractorInfo();
    for (const filter of this.interactorFilters) {
      if (filter.onRightButtonDown(this.interactorInfo)) {
        return;
      }
    }
  }

  public onRightButtonUp(): void {
    this.fillInteractorInfo();
    for (const filter of this.interactorFilters) {
      if (filter.onRightButtonUp(this.interactorInfo)) {
        return;
      }
    }
  }

  public onMouseMove(): void {
    const screenX = this.interactorInfo.screenX;
    const screenY = this.interactorInfo.screenY;
    this.fillInteractorInfo();
    if (Math.abs(screenX - this.interactorInfo.screenX) > 2 && Math.abs(screenY - this.interactorInfo.screenY) < 2) {
      if (this.leftPressed) {
        this.leftPressMoved = true;
      } else {
        this.leftPressMoved = false;
      }
    }
    for (const filter of this.interactorFilters) {
      if (filter.onMouseMove(this.interactorInfo)) {
        return;
      }
    }
    const entity = this.pickEntity();
    if (entity) {
      if (this.hoveredEntity) {
        if (this.hoveredEntity != entity) {
          this.hoveredEntity.onHovered(false);
          this.hoveredEntity = entity;
          this.hoveredEntity.onHovered(true);
        }
      } else {
        this.hoveredEntity = entity;
        this.hoveredEntity.onHovered(true);
      }
    } else {
      if (this.hoveredEntity) {
        this.hoveredEntity.onHovered(false);
      }
      this.hoveredEntity = null;
    }
  }

  public onKeyPress(): void {
    this.fillInteractorInfo();
    for (const filter of this.interactorFilters) {
      if (filter.onKeyPress(this.interactorInfo)) {
        return;
      }
    }
  }

  public onKeyRelease(): void {
    this.fillInteractorInfo();
    for (const filter of this.interactorFilters) {
      if (filter.onKeyRelease(this.interactorInfo)) {
        return;
      }
    }
  }

  public pushPickedEntity(entity: LemonEntity) {
    this.pickedEntities.push(entity);
    useLemonStageStore.getState().setEntities(this.pickedEntities);
    if (useLemonStageStore.getState().stageMode == LemonStageMode.Sketch && entity.getEntityType() != LemonDocumentType.SketchEntity) {
      return;
    }
    entity.onSelected(true);
  }

  public removePickedEntity(entity: LemonEntity) {
    const index = this.pickedEntities.indexOf(entity);
    if (index !== -1) {
      this.pickedEntities.splice(index, 1);
      entity.onSelected(false);
    }
    useLemonStageStore.getState().setEntities(this.pickedEntities);
  }

  public clearPickedEntityExcept(entity: LemonEntity) {
    this.pickedEntities = this.pickedEntities.filter((e) => {
      if (e != entity) {
        e.onSelected(false);
        return false;
      }
      return true;
    });
    useLemonStageStore.getState().setEntities(this.pickedEntities);
  }

  public clearPickedEntities() {
    this.pickedEntities.forEach((entity) => {
      entity.onSelected(false);
    });
    this.pickedEntities = [];
    useLemonStageStore.getState().setEntities(this.pickedEntities);
  }

  public pickEntity(): LemonEntity | null {
    const pickInfo = this.getPickInfo();
    const result = this.sortPickInfo(pickInfo);
    return result.length > 0 ? result[0].pickedEntity : null;
  }

  private getPickInfo(): Array<PickingInfo> {
    const info = this.scene.multiPick(this.scene.pointerX, this.scene.pointerY, (mesh) => {
      let root = mesh;
      while (root.parent) {
        root = root.parent as LemonEntity;
      }
      const entity = root as LemonEntity;
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

  public setHoveredEntity(entity: LemonEntity | null): void {
    if (this.hoveredEntity) {
      this.hoveredEntity.onHovered(false);
    }
    this.hoveredEntity = entity;
    if (this.hoveredEntity) {
      this.hoveredEntity.onHovered(true);
    }
  }

  public dispose(): void {
    this.scene.onPointerObservable.remove(this.observerInfo);
    this.interactorFilters = [];
    this.pickedEntities = [];
    this.hoveredEntity = null;
  }
}
