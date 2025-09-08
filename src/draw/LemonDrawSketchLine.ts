import LemonLineEntity from "../core/entity/LemonLineEntity";
import type LemonPlaneEntity from "../core/entity/LemonPlaneEntity";
import type LemonSketchEntity from "../core/entity/LemonSketchEntity";
import type { LemonInteractorInfo } from "../core/interactor/LemonInteractorFilter";
import { LemonDocumentType } from "../documents/LemonDocument";
import { LemonLine } from "../geom/LemonLine";
import type LemonPlane from "../geom/LemonPlane";
import LemonPoint from "../geom/LemonPoint";
import useLemonFootStore from "../store/LemonFootStore";
import useLemonSketchStore from "../store/LemonSketchStore";
import useLemonStageStore from "../store/LemonStageStore";
import type LemonDrawInterface from "./LemonDrawInterface";
import { LemonDrawType } from "./LemonDrawInterface";

enum LemonDrawSketchLineState {
  Idle,
  Drawing,
}

export default class LemonDrawSketchLine implements LemonDrawInterface {
  private state: LemonDrawSketchLineState = LemonDrawSketchLineState.Idle;
  private lineEntities: Array<LemonLineEntity> = [];
  private currentLineEntity: LemonLineEntity | null = null;
  private pointA: LemonPoint = new LemonPoint();
  private pointB: LemonPoint = new LemonPoint();
  private sketchEntity: LemonSketchEntity | null = null;
  private plane: LemonPlane | null = null;

  public getDrawType(): LemonDrawType {
    return LemonDrawType.SketchLine;
  }

  public begin(): void {
    this.lineEntities = [];
    this.state = LemonDrawSketchLineState.Idle;
    this.currentLineEntity = new LemonLineEntity(new LemonLine());
    this.sketchEntity = useLemonSketchStore.getState().createSketchEntity;
    if (this.sketchEntity) {
      const entityID = this.sketchEntity.getPlaneEntityID();
      if (entityID) {
        const entity = useLemonStageStore.getState().entityManager.getEntity(entityID);
        if (entity && entity.getEntityType() == LemonDocumentType.PlaneEntity) {
          const planeEntity = entity as LemonPlaneEntity;
          const plane = planeEntity.getPlane();
          if (plane) {
            this.plane = plane;
            useLemonStageStore.getState().camera.lookAtPlane(plane.getNormal());
          } else {
            this.plane = null;
          }
        }
      }
    } else {
      this.plane = null;
      useLemonFootStore.getState().setTip("Please create or select a sketch or plane first.");
    }
  }

  public end(): void {
    this.lineEntities = [];
    this.currentLineEntity?.dispose();
    this.currentLineEntity = null;
    this.state = LemonDrawSketchLineState.Idle;
    this.sketchEntity = null;
    this.plane = null;
  }

  public shutdown(): void {
    for (const lineEntity of this.lineEntities) {
      lineEntity.dispose();
    }
    this.lineEntities = [];
    this.currentLineEntity?.dispose();
    this.currentLineEntity = null;
    this.state = LemonDrawSketchLineState.Idle;
    this.sketchEntity = null;
    this.plane = null;
  }

  public getFilterOrder(): number {
    return 1;
  }

  public onLeftButtonDown(_info: LemonInteractorInfo): boolean {
    return false;
  }

  public onLeftButtonUp(info: LemonInteractorInfo): boolean {
    if (this.currentLineEntity && this.sketchEntity && this.plane) {
      if (this.state == LemonDrawSketchLineState.Idle) {
        this.pointA = useLemonStageStore.getState().scene.getRayIntersectsPlane(this.plane.getNormal(), info.screenX, info.screenY);
        this.state = LemonDrawSketchLineState.Drawing;
      } else if (this.state == LemonDrawSketchLineState.Drawing) {
        this.pointB = useLemonStageStore.getState().scene.getRayIntersectsPlane(this.plane.getNormal(), info.screenX, info.screenY);
        this.currentLineEntity.updateLine(new LemonLine(this.pointA, this.pointB));
        this.currentLineEntity.draw();
        this.lineEntities.push(this.currentLineEntity);
        this.pointA = this.pointB;
        this.currentLineEntity = new LemonLineEntity(new LemonLine(this.pointA));
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
    if (this.currentLineEntity && this.sketchEntity && this.plane) {
      if (this.state == LemonDrawSketchLineState.Idle) {
        return false;
      } else if (this.state == LemonDrawSketchLineState.Drawing) {
        this.pointB = useLemonStageStore.getState().scene.getRayIntersectsPlane(this.plane.getNormal(), _info.screenX, _info.screenY);
        this.currentLineEntity.updateLine(new LemonLine(this.pointA, this.pointB));
        this.currentLineEntity.draw();
        return true;
      }
    }
    return false;
  }

  public onKeyPress(_info: LemonInteractorInfo): boolean {
    return false;
  }

  public onKeyRelease(_info: LemonInteractorInfo): boolean {
    return false;
  }
}
