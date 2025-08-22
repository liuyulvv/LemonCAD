import {
  BaseCameraPointersInput,
  Matrix,
  Observer,
  Plane,
  PointerEventTypes,
  PointerInfo,
  Scene,
  TransformNode,
  UniversalCamera,
  Vector3,
  type IPointerEvent,
  type Nullable,
  type PointerTouch,
} from "@babylonjs/core";

class LemonArcRotateCameraPointersInput extends BaseCameraPointersInput {
  public camera!: LemonCamera;

  public override getClassName(): string {
    return "LemonArcRotateCameraPointersInput";
  }

  public override buttons = [0, 1, 2]; // left: 0, mid: 1, right: 2

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
    if (!point) {
      return;
    }
    if (this.panningSensibility !== 0 && (this._ctrlKey || this.isPanClick)) {
      const cameraDirection = this.camera.target.subtract(this.camera.targetNode.position).normalize();
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
        this.camera.target.addInPlace(offset);
        this.camera.targetNode.position.addInPlace(offset);
      }
    } else if (this.isRotateClick) {
      const cameraDirection = this.camera.target.subtract(this.camera.targetNode.position).normalize();
      const panningPlane = Plane.FromPositionAndNormal(this.camera.target, cameraDirection);
      const scene = this.camera.getScene();
      const xRay = scene.createPickingRay(point.x - 5, point.y, Matrix.Identity(), this.camera, false);
      const zRay = scene.createPickingRay(point.x, point.y - 5, Matrix.Identity(), this.camera, false);
      const currentRay = scene.createPickingRay(point.x, point.y, Matrix.Identity(), this.camera, false);
      const xIntersectionDistance = xRay.intersectsPlane(panningPlane);
      const zIntersectionDistance = zRay.intersectsPlane(panningPlane);
      const currentIntersectionDistance = currentRay.intersectsPlane(panningPlane);
      if (xIntersectionDistance && zIntersectionDistance && currentIntersectionDistance) {
        const xIntersection = xRay.origin.add(xRay.direction.scale(xIntersectionDistance));
        const zIntersection = zRay.origin.add(zRay.direction.scale(zIntersectionDistance));
        const currentIntersection = currentRay.origin.add(currentRay.direction.scale(currentIntersectionDistance));

        const xAxis = xIntersection.subtract(currentIntersection).normalize();
        const zAxis = zIntersection.subtract(currentIntersection).normalize();

        const rotateX = -offsetY * 0.01;
        this.camera.targetNode.rotateAround(this.camera.target, xAxis, rotateX);

        const rotateZ = -offsetX * 0.01;
        this.camera.targetNode.rotateAround(this.camera.target, zAxis, rotateZ);
      }
    }
  }
}

export default class LemonCamera extends UniversalCamera {
  private oldRadius: number = 30;
  public targetNode: TransformNode;

  private observerInfo: Observer<PointerInfo>;

  public constructor(scene: Scene) {
    super("LemonCamera3D", new Vector3(0, -30, 0), scene);

    this.targetNode = new TransformNode("LemonCameraTargetNode", scene);
    this.targetNode.position = new Vector3(0, -30, 0);

    this.orthoLeft = -30;
    this.orthoRight = 30;
    this.mode = LemonCamera.ORTHOGRAPHIC_CAMERA;

    this.inputs.clear();
    this.inputs.add(new LemonArcRotateCameraPointersInput());

    this.upVector = new Vector3(0, 0, 1);
    this.setTarget(new Vector3(0, 0, 0));
    this.parent = this.targetNode;

    this._scene.onBeforeRenderObservable.add(() => {
      const engine = this._scene.getEngine();
      const canvas = engine.getRenderingCanvas();
      if (canvas) {
        const radius = this.target.subtract(this.position).length();
        const radius_change_ratio = radius / this.oldRadius;
        this.orthoLeft! *= radius_change_ratio;
        this.orthoRight! *= radius_change_ratio;
        this.oldRadius = radius;
        const ratio = canvas.height / canvas.width;
        this.orthoTop = this.orthoRight! * ratio;
        this.orthoBottom = this.orthoLeft! * ratio;
      }
    });

    this.observerInfo = this._scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type == PointerEventTypes.POINTERWHEEL) {
        const event = pointerInfo.event as WheelEvent;
        event.preventDefault();
        const delta = -event.deltaY * 0.1;
        this.orthoLeft! += delta;
        this.orthoRight! -= delta;
        this.orthoLeft = Math.min(this.orthoLeft!, -1);
        this.orthoRight = -this.orthoLeft;
        this.orthoRight = Math.min(Math.max(this.orthoRight!, 1), 500);
        this.orthoLeft = -this.orthoRight;
      }
    });
  }

  public lookFromTop(): void {}

  public override dispose(): void {
    this._scene.onPointerObservable.remove(this.observerInfo);
    super.dispose();
  }
}
