import { AxesViewer, Color4, Scene, Vector3, WebGPUEngine } from "@babylonjs/core";
import LemonCamera from "./LemonCamera";

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
  }
}
