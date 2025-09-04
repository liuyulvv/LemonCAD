import LemonSketchEntity from "../core/entity/LemonSketchEntity";
import type { LemonInteractorInfo } from "../core/interactor/LemonInteractorFilter";
import { LemonDocumentType } from "../documents/LemonDocument";
import useLemonAsideStore from "../store/LemonAsideStore";
import useLemonSketchStore from "../store/LemonSketchStore";
import useLemonStageStore, { LemonStageMode } from "../store/LemonStageStore";
import type LemonDrawInterface from "./LemonDrawInterface";
import { LemonDrawType } from "./LemonDrawInterface";

enum LemonDrawSketchState {
  Idle,
  WaitForPlane,
}

export default class LemonDrawSketch implements LemonDrawInterface {
  private state: LemonDrawSketchState = LemonDrawSketchState.Idle;
  private sketchEntity: LemonSketchEntity | null = null;

  public getDrawType(): LemonDrawType {
    return LemonDrawType.Sketch;
  }

  public begin(): void {
    useLemonStageStore.getState().setStageMode(LemonStageMode.Sketch);
    this.state = LemonDrawSketchState.WaitForPlane;
    useLemonStageStore.getState().interactorManager.clearPickedEntities();
    this.sketchEntity = new LemonSketchEntity();
    useLemonSketchStore.getState().setSketchEntity(this.sketchEntity);
  }

  public end(): void {
    if (this.sketchEntity) {
      useLemonAsideStore.getState().pushGeometryData({ title: useLemonSketchStore.getState().sketchName, key: this.sketchEntity.id });
      useLemonStageStore.getState().entityManager.addEntity(this.sketchEntity);
    }
    this.state = LemonDrawSketchState.Idle;
    this.sketchEntity = null;
    useLemonSketchStore.getState().setSketchEntity(null);
    useLemonStageStore.getState().setStageMode(LemonStageMode.Feature);
  }

  public shutdown(): void {
    this.state = LemonDrawSketchState.Idle;
    this.sketchEntity?.dispose();
    this.sketchEntity = null;
    useLemonSketchStore.getState().setSketchEntity(null);
    useLemonStageStore.getState().setStageMode(LemonStageMode.Feature);
  }

  public getFilterOrder(): number {
    return 1;
  }

  public onLeftButtonDown(info: LemonInteractorInfo): boolean {
    return false;
  }

  public onLeftButtonUp(info: LemonInteractorInfo): boolean {
    if (this.state == LemonDrawSketchState.WaitForPlane && this.sketchEntity) {
      const entity = useLemonStageStore.getState().interactorManager.pickEntity();
      if (entity) {
        if (entity.getEntityType() == LemonDocumentType.PlaneEntity) {
          this.sketchEntity.setPlaneEntityID(entity.id);
          return false;
        }
      }
    }
    return false;
  }

  public onRightButtonDown(info: LemonInteractorInfo): boolean {
    return false;
  }

  public onRightButtonUp(info: LemonInteractorInfo): boolean {
    return false;
  }

  public onMouseMove(info: LemonInteractorInfo): boolean {
    return false;
  }

  public onKeyPress(info: LemonInteractorInfo): boolean {
    return false;
  }

  public onKeyRelease(info: LemonInteractorInfo): boolean {
    return false;
  }
}
