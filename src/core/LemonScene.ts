import { Color4, Scene, Vector3, WebGPUEngine } from "@babylonjs/core";
import LemonCADDocument from "../documents/LemonCADDocument";
import LemonDrawManager from "../draw/LemonDrawManager";
import useLemonStageStore from "../store/LemonStageStore";
import LemonCamera from "./LemonCamera";
import LemonEntityManager from "./entity/LemonEntityManager";
import LemonPlaneEntity from "./entity/LemonPlaneEntity";
import LemonPointEntity from "./entity/LemonPointEntity";
import LemonInteractorManager from "./interactor/LemonInteractorManager";

export default class LemonScene extends Scene {
  private camera: LemonCamera;
  private interactorManager: LemonInteractorManager;
  private entityManager: LemonEntityManager;
  private document: LemonCADDocument;

  public constructor(engine: WebGPUEngine, canvas: HTMLCanvasElement) {
    super(engine, undefined);
    this.interactorManager = new LemonInteractorManager(this);
    useLemonStageStore.getState().setInteractorManager(this.interactorManager);
    this.entityManager = new LemonEntityManager();
    useLemonStageStore.getState().setEntityManager(this.entityManager);
    this.camera = new LemonCamera(this);
    useLemonStageStore.getState().setCamera(this.camera);
    useLemonStageStore.getState().setDrawManager(LemonDrawManager.getInstance());

    this.useRightHandedSystem = true;
    this.gravity = new Vector3(0, 0, -9.81);
    this.clearColor = new Color4(1, 1, 1, 1);

    this.camera.attachControl(canvas, true);
    this.activeCamera = this.camera;

    this.document = new LemonCADDocument();

    const topPlane = new LemonPlaneEntity(this.document.topPlane);
    topPlane.id = "top-plane";
    topPlane.name = topPlane.id;
    topPlane.draw(true);

    const frontPlane = new LemonPlaneEntity(this.document.frontPlane);
    frontPlane.id = "front-plane";
    frontPlane.name = frontPlane.id;
    frontPlane.draw(true);

    const rightPlane = new LemonPlaneEntity(this.document.rightPlane);
    rightPlane.id = "right-plane";
    rightPlane.name = rightPlane.id;
    rightPlane.draw(true);

    const pointEntity = new LemonPointEntity(this.document.origin);
    pointEntity.id = "origin-point";
    pointEntity.name = pointEntity.id;
    pointEntity.draw(true);

    this.entityManager.addEntity(topPlane);
    this.entityManager.addEntity(frontPlane);
    this.entityManager.addEntity(rightPlane);
    this.entityManager.addEntity(pointEntity);
  }

  public open(document: LemonCADDocument): void {
    this.document = document;
  }

  public override dispose(): void {
    this.entityManager.dispose();
    this.interactorManager.dispose();
    this.camera.dispose();
    super.dispose();
  }
}
