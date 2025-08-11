import {
  ArcRotateCamera,
  BaseCameraPointersInput,
  Matrix,
  Plane,
  Scene,
  Vector3,
  type IPointerEvent,
  type Nullable,
  type PointerTouch,
} from "@babylonjs/core";
import LemonPickManager from "./LemonPickManager";

class LemonArcRotateCameraPointersInput extends BaseCameraPointersInput {
  // @ts-ignore
  public camera: ArcRotateCamera;

  public override getClassName(): string {
    return "LemonArcRotateCameraPointersInput";
  }

  public override buttons = [0, 1, 2]; // left: 0, mid: 1, right: 2

  private angularSensibilityX = 1000.0;
  private angularSensibilityY = 1000.0;
  private panningSensibility: number = 1000.0;
  private isPickClick: boolean = false;
  private isRotateClick: boolean = false;
  private isPanClick: boolean = false;

  public override onButtonDown(evt: IPointerEvent): void {
    this.isPickClick = evt.button == 0;
    this.isPanClick = evt.button == 1;
    this.isRotateClick = evt.button == 2;
    if (this.isPickClick) {
      const pickedEntity = LemonPickManager.getInstance().pickEntity();
      if (pickedEntity) {
        pickedEntity.isSelected()
          ? LemonPickManager.getInstance().removePickEntity(pickedEntity)
          : LemonPickManager.getInstance().addPickEntity(pickedEntity);
      }
    }
  }

  public override onButtonUp(evt: IPointerEvent): void {
    if (evt.button == 0) {
      this.isPickClick = false;
    } else if (evt.button == 1) {
      this.isPanClick = false;
    } else if (evt.button == 2) {
      this.isRotateClick = false;
    }
  }

  public override onLostFocus(): void {
    this.isPanClick = false;
    this.isRotateClick = false;
  }

  public override onTouch(point: Nullable<PointerTouch>, offsetX: number, offsetY: number): void {
    if (this.panningSensibility !== 0 && ((this._ctrlKey && this.camera._useCtrlForPanning) || this.isPanClick)) {
      if (!point || !this.camera) {
        return;
      }
      const cameraDirection = this.camera.target.subtract(this.camera.position).normalize();
      const panningPlane = Plane.FromPositionAndNormal(this.camera.target, cameraDirection);
      const scene = this.camera.getScene();
      const lastRay = scene.createPickingRay(point.x - offsetX, point.y - offsetY, Matrix.Identity(), this.camera, false);
      const currentRay = scene.createPickingRay(point.x, point.y, Matrix.Identity(), this.camera, false);
      const lastIntersectionDistance = lastRay.intersectsPlane(panningPlane);
      const currentIntersectionDistance = currentRay.intersectsPlane(panningPlane);
      if (lastIntersectionDistance && currentIntersectionDistance) {
        const lastIntersection = lastRay.origin.add(lastRay.direction.scale(lastIntersectionDistance));
        const currentIntersection = currentRay.origin.add(currentRay.direction.scale(currentIntersectionDistance));
        const offset = lastIntersection.subtract(currentIntersection);
        this.camera.position.addInPlace(offset);
        this.camera.target.addInPlace(offset);
      }
    } else if (this.isRotateClick) {
      this.camera.inertialAlphaOffset -= offsetX / this.angularSensibilityX;
      this.camera.inertialBetaOffset -= offsetY / this.angularSensibilityY;
    }
  }
}

export default class LemonCamera extends ArcRotateCamera {
  public constructor(scene: Scene) {
    super("camera", Math.PI / 2, 0, 10, Vector3.Zero(), scene);
    this.lowerBetaLimit = null;
    this.upperBetaLimit = null;
    this.upVector = new Vector3(0, 0, 1);

    this.inputs.clear();
    this.inputs.addMouseWheel();
    this.inputs.add(new LemonArcRotateCameraPointersInput());
    this._panningMouseButton = 1;

    this.setPosition(new Vector3(-10, -10, 10));
  }
}
