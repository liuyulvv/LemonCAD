import type { LemonInteractorInfo } from "../core/interactor/LemonInteractorFilter";
import useLemonStageStore from "../store/LemonStageStore";
import type LemonDrawInterface from "./LemonDrawInterface";
import { LemonDrawType } from "./LemonDrawInterface";

enum LemonDrawSketchState {
  Idle,
  WaitForPlane,
}

export default class LemonDrawSketch implements LemonDrawInterface {
  private state: LemonDrawSketchState = LemonDrawSketchState.Idle;

  public getDrawType(): LemonDrawType {
    return LemonDrawType.Sketch;
  }

  public begin(): void {
    this.state = LemonDrawSketchState.WaitForPlane;
    useLemonStageStore.getState().interactorManager.clearPickedEntities();
  }

  public end(): void {
    this.state = LemonDrawSketchState.Idle;
  }

  public shutdown(): void {}

  public getFilterOrder(): number {
    return 1;
  }

  public onLeftButtonDown(info: LemonInteractorInfo): boolean {
    return false;
  }

  public onLeftButtonUp(info: LemonInteractorInfo): boolean {
    if (this.state == LemonDrawSketchState.WaitForPlane) {
    }
    const entity = useLemonStageStore.getState().interactorManager.pickEntity();
    if (entity) {
      useLemonStageStore.getState().interactorManager.insertPickedEntity(entity);
    }
    return true;
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
