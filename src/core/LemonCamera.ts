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
import { LemonDrawType } from "../draw/LemonDrawInterface";
import LemonVector from "../geom/LemonVector";
import useLemonStageStore from "../store/LemonStageStore";

class LemonArcRotateCameraPointersInput extends BaseCameraPointersInput {
  public camera!: ArcRotateCamera;

  public override getClassName(): string {
    return "LemonArcRotateCameraPointersInput";
  }

  public override buttons = [0, 1, 2]; // left: 0, mid: 1, right: 2

  private angularSensibilityX = 1000.0;
  private angularSensibilityY = 1000.0;
  private panningSensibility: number = 1000.0;
  private isRotateClick: boolean = false;
  private isPanClick: boolean = false;

  public override onButtonDown(evt: IPointerEvent): void {
    if (evt.button == 1) {
      this.isPanClick = true;
    } else if (evt.button == 2) {
      this.isRotateClick = true;
    }
  }

  public override onButtonUp(evt: IPointerEvent): void {
    if (evt.button == 1) {
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
      if (!point) {
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
      const drawType = useLemonStageStore.getState().drawManager.getDrawType();
      if (drawType && drawType >= LemonDrawType.SketchLine && drawType <= LemonDrawType.SketchLine) {
        return;
      }
      this.camera.inertialAlphaOffset -= offsetX / this.angularSensibilityX;
      this.camera.inertialBetaOffset -= offsetY / this.angularSensibilityY;
    }
  }
}

export default class LemonCamera extends ArcRotateCamera {
  private oldRadius: number = 10;

  public constructor(scene: Scene) {
    super("LemonCamera3D", Math.PI / 2, 0, 10, Vector3.Zero(), scene);
    this.lowerBetaLimit = 0;
    this.upperBetaLimit = Math.PI;
    this.upVector = new Vector3(0, 0, 1);

    this.orthoLeft = -30;
    this.orthoRight = 30;
    this.mode = LemonCamera.ORTHOGRAPHIC_CAMERA;

    this.inputs.clear();
    this.inputs.addMouseWheel();
    this.inputs.add(new LemonArcRotateCameraPointersInput());
    this._panningMouseButton = 1;

    this.setPosition(new Vector3(-15, -5, 10));
    this.oldRadius = this.radius;

    this.lowerRadiusLimit = 0.1;
    this.upperRadiusLimit = 100;

    this.lookAtPlane(new LemonVector(0, 0, 1));

    this._scene.onBeforeRenderObservable.add(() => {
      const engine = this._scene.getEngine();
      const canvas = engine.getRenderingCanvas();
      if (canvas) {
        const radius_change_ratio = this.radius / this.oldRadius;
        this.orthoLeft! *= radius_change_ratio;
        this.orthoRight! *= radius_change_ratio;
        this.oldRadius = this.radius;
        const ratio = canvas.height / canvas.width;
        this.orthoTop = this.orthoRight! * ratio;
        this.orthoBottom = this.orthoLeft! * ratio;
      }
    });
  }

  public lookAtPlane(zDirection: Vector3): void {
    const radius = this.radius;
    const newPosition = zDirection.scale(radius);
    this.setPosition(newPosition);
  }
}
