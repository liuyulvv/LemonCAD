import { AxesViewer, Color4, Scene, Vector3, WebGPUEngine } from "@babylonjs/core";
import LemonCamera from "./LemonCamera";
import LemonPlaneEntity from "./LemonPlaneEntity";

export default class LemonScene extends Scene {
  private camera: LemonCamera;

  public constructor(engine: WebGPUEngine, canvas: HTMLCanvasElement) {
    super(engine, undefined);
    this.camera = new LemonCamera(this);

    this.useRightHandedSystem = true;
    this.gravity = new Vector3(0, 0, -9.81);
    this.clearColor = new Color4(1, 1, 1, 1);

    this.camera.attachControl(canvas, true);
    this.activeCamera = this.camera;

    new AxesViewer(this);

    const topPlane = LemonPlaneEntity.topPlane();
    topPlane.draw(true);

    const frontPlane = LemonPlaneEntity.frontPlane();
    frontPlane.draw(true);

    const rightPlane = LemonPlaneEntity.rightPlane();
    rightPlane.draw(true);
  }
}
