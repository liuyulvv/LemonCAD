import type { LemonInteractorInfo } from "../core/interactor/LemonInteractorFilter";
import { LemonDocumentType } from "../documents/LemonDocument";
import useLemonFootStore from "../store/LemonFootStore";
import useLemonSketchStore from "../store/LemonSketchStore";
import useLemonStageStore, { LemonStageMode } from "../store/LemonStageStore";
import type LemonDrawInterface from "./LemonDrawInterface";
import { LemonDrawType } from "./LemonDrawInterface";

export default class LemonDrawSketch implements LemonDrawInterface {
  public getDrawType(): LemonDrawType {
    return LemonDrawType.Sketch;
  }

  public begin(): void {
    useLemonStageStore.getState().setStageMode(LemonStageMode.Sketch);
    const sketchEntity = useLemonSketchStore.getState().createSketchEntity;
    if (sketchEntity) {
      if (!sketchEntity.isSelected()) {
        useLemonStageStore.getState().interactorManager.clearPickedEntities();
      }
    } else {
      useLemonStageStore.getState().interactorManager.clearPickedEntities();
    }
  }

  public end(): void {
    useLemonSketchStore.getState().setCreateSketchEntity(null);
    useLemonStageStore.getState().setStageMode(LemonStageMode.None);
    useLemonFootStore.getState().setTip("");
  }

  public shutdown(): void {
    useLemonSketchStore.getState().setCreateSketchEntity(null);
    useLemonStageStore.getState().setStageMode(LemonStageMode.None);
  }

  public getFilterOrder(): number {
    return 1;
  }

  public onLeftButtonDown(_info: LemonInteractorInfo): boolean {
    return false;
  }

  public onLeftButtonUp(_info: LemonInteractorInfo): boolean {
    const sketchEntity = useLemonSketchStore.getState().createSketchEntity;
    if (!sketchEntity) {
      return false;
    }
    if (!sketchEntity.getPlaneEntityID()) {
      const entity = useLemonStageStore.getState().interactorManager.pickEntity();
      if (entity) {
        if (entity.getEntityType() == LemonDocumentType.PlaneEntity) {
          sketchEntity.setPlaneEntityID(entity.id);
          useLemonSketchStore.getState().setCreateSketchPlaneEntity(entity);
          return true;
        }
      }
    }
    return false;
  }

  public onRightButtonDown(_info: LemonInteractorInfo): boolean {
    return false;
  }

  public onRightButtonUp(_info: LemonInteractorInfo): boolean {
    return false;
  }

  public onMouseMove(_info: LemonInteractorInfo): boolean {
    return false;
  }

  public onKeyPress(_info: LemonInteractorInfo): boolean {
    return false;
  }

  public onKeyRelease(_info: LemonInteractorInfo): boolean {
    return false;
  }
}
