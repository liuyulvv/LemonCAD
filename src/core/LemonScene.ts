import { AxesViewer, Color4, Scene, Vector3, WebGPUEngine } from "@babylonjs/core";
import LemonPoint from "../geom/LemonPoint";
import useLemonStageStore from "../store/LemonStageStore";
import LemonCamera from "./LemonCamera";
import LemonPlaneEntity from "./entity/LemonPlaneEntity";
import LemonPointEntity from "./entity/LemonPointEntity";
import LemonInteractorManager from "./interactor/LemonInteractorManager";

export default class LemonScene extends Scene {
  private camera: LemonCamera;
  private interactorManager: LemonInteractorManager;

  public constructor(engine: WebGPUEngine, canvas: HTMLCanvasElement) {
    super(engine, undefined);
    this.interactorManager = new LemonInteractorManager(this);
    useLemonStageStore.getState().setInteractorManager(this.interactorManager);

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

    const point = new LemonPoint(0, 0, 0);
    const pointEntity = new LemonPointEntity(point);
    pointEntity.draw(true);
  }

  public override dispose(): void {
    this.interactorManager.dispose();
    super.dispose();
  }
}
