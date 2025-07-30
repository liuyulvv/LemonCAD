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

class LemonArcRotateCameraPointersInput extends BaseCameraPointersInput {
  // @ts-ignore
  public camera: ArcRotateCamera;
  public static MinimumRadiusForPinch: number = 0.001;

  public override getClassName(): string {
    return "LemonArcRotateCameraPointersInput";
  }

  public override buttons = [1, 2]; // left: 0, mid: 1, right: 2

  private angularSensibilityX = 1000.0;
  private angularSensibilityY = 1000.0;
  private panningSensibility: number = 1000.0;
  private _isPanClick: boolean = false;

  public override onButtonDown(evt: IPointerEvent): void {
    this._isPanClick = evt.button == 1;
  }

  public override onButtonUp(_evt: IPointerEvent): void {}

  public override onLostFocus(): void {
    this._isPanClick = false;
  }

  public override onTouch(point: Nullable<PointerTouch>, offsetX: number, offsetY: number): void {
    if (this.panningSensibility !== 0 && ((this._ctrlKey && this.camera._useCtrlForPanning) || this._isPanClick)) {
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
    } else {
      this.camera.inertialAlphaOffset -= offsetX / this.angularSensibilityX;
      this.camera.inertialBetaOffset -= offsetY / this.angularSensibilityY;
    }
  }
}

export default class LemonCamera extends ArcRotateCamera {
  public constructor(scene: Scene) {
    super("camera", Math.PI / 2, 0, 10, Vector3.Zero(), scene);
    this.lowerBetaLimit = 0;
    this.upVector = new Vector3(0, 0, 1);

    this.inputs.clear();
    this.inputs.addMouseWheel();
    this.inputs.add(new LemonArcRotateCameraPointersInput());
    this._panningMouseButton = 1;

    this.setPosition(new Vector3(-10, -10, 10));
  }
}
