import { Color4, Matrix, Plane, Scene, Vector3, WebGPUEngine } from "@babylonjs/core";
import LemonCADDocument from "../documents/LemonCADDocument";
import LemonPoint from "../geom/LemonPoint";
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
    this.entityManager = new LemonEntityManager();
    this.camera = new LemonCamera(this);
    this.useRightHandedSystem = true;
    this.gravity = new Vector3(0, 0, -9.81);
    this.clearColor = new Color4(1, 1, 1, 1);
    this.camera.attachControl(canvas, true);
    this.activeCamera = this.camera;
    this.document = new LemonCADDocument();
  }

  public init(): void {
    const topPlane = new LemonPlaneEntity(this.document.topPlane);
    topPlane.setEntityID("top-plane");
    topPlane.draw(true);
    topPlane.setEntityName("Top Plane");

    const frontPlane = new LemonPlaneEntity(this.document.frontPlane);
    frontPlane.setEntityID("front-plane");
    frontPlane.draw(true);
    frontPlane.setEntityName("Front Plane");

    const rightPlane = new LemonPlaneEntity(this.document.rightPlane);
    rightPlane.setEntityID("right-plane");
    rightPlane.draw(true);
    rightPlane.setEntityName("Right Plane");

    const pointEntity = new LemonPointEntity(this.document.origin);
    pointEntity.setEntityID("origin-point");
    pointEntity.draw(true);
    pointEntity.setEntityName("Origin");
  }

  public getCamera(): LemonCamera {
    return this.camera;
  }

  public getInteractorManager(): LemonInteractorManager {
    return this.interactorManager;
  }

  public getEntityManager(): LemonEntityManager {
    return this.entityManager;
  }

  public getDocument(): LemonCADDocument {
    return this.document;
  }

  public openDocument(document: LemonCADDocument): void {
    this.document = document;
  }

  public getRayIntersectsPlane(planeNormal: LemonPoint, screenX: number, screenY: number): LemonPoint {
    const ray = this.createPickingRay(screenX, screenY, Matrix.Identity(), this.camera, false);
    const plaen = Plane.FromPositionAndNormal(this.camera.target, planeNormal);
    const intersectionDistance = ray.intersectsPlane(plaen);
    if (intersectionDistance) {
      const intersection = ray.origin.add(ray.direction.scale(intersectionDistance));
      return new LemonPoint(intersection.x, intersection.y, intersection.z);
    }
    return new LemonPoint(0, 0, 0);
  }

  public override dispose(): void {
    this.entityManager.dispose();
    this.interactorManager.dispose();
    this.camera.dispose();
    super.dispose();
  }
}
