import type { LemonInteractorInfo } from "../core/interactor/LemonInteractorFilter";
import { LemonDocumentType } from "../documents/LemonDocument";
import useLemonFootStore from "../store/LemonFootStore";
import useLemonSketchStore from "../store/LemonSketchStore";
import useLemonStageStore, { LemonStageMode } from "../store/LemonStageStore";
import type LemonDrawInterface from "./LemonDrawInterface";
import { LemonDrawType } from "./LemonDrawInterface";
import LemonDrawSketchLine from "./LemonDrawSketchLine";

export default class LemonDrawSketch implements LemonDrawInterface {
  private readonly tip = "Sketch mode activated. You can now draw on the canvas.";
  private drawSketch: LemonDrawInterface | null = null;
  private drawSketchLine: LemonDrawSketchLine;

  public constructor() {
    this.drawSketchLine = new LemonDrawSketchLine();
  }

  public getDrawType(): LemonDrawType {
    return LemonDrawType.Sketch;
  }

  public begin(): void {
    useLemonFootStore.getState().setTip(this.tip);
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
    if (this.drawSketch) {
      this.drawSketch.end();
    }
    this.drawSketch = null;
    useLemonSketchStore.getState().setCreateSketchEntity(null);
    useLemonStageStore.getState().setStageMode(LemonStageMode.None);
    useLemonFootStore.getState().setTip("");
  }

  public shutdown(): void {
    if (this.drawSketch) {
      this.drawSketch.shutdown();
    }
    this.drawSketch = null;
    useLemonSketchStore.getState().setCreateSketchEntity(null);
    useLemonStageStore.getState().setStageMode(LemonStageMode.None);
    useLemonFootStore.getState().setTip("");
  }

  public getFilterOrder(): number {
    return 2;
  }

  public onLeftButtonDown(_info: LemonInteractorInfo): boolean {
    return false;
  }

  public onLeftButtonUp(info: LemonInteractorInfo): boolean {
    if (this.drawSketch) {
      return this.drawSketch.onLeftButtonUp(info);
    } else {
      const sketchEntity = useLemonSketchStore.getState().createSketchEntity;
      if (sketchEntity && !sketchEntity.getPlaneEntityID()) {
        const entity = useLemonStageStore.getState().interactorManager.pickEntity();
        if (entity) {
          if (entity.getEntityType() == LemonDocumentType.PlaneEntity) {
            sketchEntity.setPlaneEntityID(entity.id);
            useLemonSketchStore.getState().setCreateSketchPlaneEntity(entity);
          }
        }
      }
      return true;
    }
  }

  public onRightButtonDown(_info: LemonInteractorInfo): boolean {
    return false;
  }

  public onRightButtonUp(_info: LemonInteractorInfo): boolean {
    if (this.drawSketch) {
      this.drawSketch.end();
      this.drawSketch = null;
      useLemonFootStore.getState().setTip(this.tip);
      return true;
    }
    return false;
  }

  public onMouseMove(info: LemonInteractorInfo): boolean {
    if (this.drawSketch) {
      return this.drawSketch.onMouseMove(info);
    } else {
      return false;
    }
  }

  public onKeyPress(_info: LemonInteractorInfo): boolean {
    return false;
  }

  public onKeyRelease(_info: LemonInteractorInfo): boolean {
    return false;
  }

  public beginDraw(drawType: LemonDrawType): void {
    if (this.drawSketch && this.drawSketch.getDrawType() == drawType) {
      return;
    }
    if (this.drawSketch) {
      this.drawSketch.shutdown();
      this.drawSketch = null;
    }
    switch (drawType) {
      case LemonDrawType.SketchLine:
        this.drawSketch = this.drawSketchLine;
    }
    if (this.drawSketch) {
      this.drawSketch.begin();
    }
  }
}
