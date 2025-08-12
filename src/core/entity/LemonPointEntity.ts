import { MeshBuilder, Observer, Scene } from "@babylonjs/core";
import { v4 as uuidv4 } from "uuid";
import type LemonPoint from "../../geom/LemonPoint";
import LemonEntity from "./LemonEntity";

export default class LemonPointEntity extends LemonEntity {
  private point: LemonPoint | null = null;
  private drawNeedUpdate = true;
  private onBeforeRenderObserver: Observer<Scene> | null = null;

  public constructor(point?: LemonPoint, ignoreCameraZoom: boolean = true) {
    super();
    this.point = point || null;
    this.onBeforeRenderObserver = ignoreCameraZoom
      ? this.scene.onBeforeRenderObservable.add(() => {
          const camera = this.scene.activeCamera;
          if (camera && this.position) {
            const scale = camera.orthoLeft! / 30;
            this.scaling.setAll(scale);
          }
        })
      : null;
  }

  public draw(forceUpdate: boolean = false): void {
    if (!this.point) {
      return;
    }
    if (forceUpdate) {
      this.drawNeedUpdate = true;
    }
    if (this.drawNeedUpdate) {
      this.getChildMeshes().forEach((child) => child.dispose());
      const centerMesh = MeshBuilder.CreateSphere(uuidv4(), { diameter: 0.05 });
      centerMesh.isPickable = false;
      centerMesh.doNotSyncBoundingInfo = true;
      this.addChild(centerMesh);

      const torusMesh = MeshBuilder.CreateTorus(uuidv4(), { diameter: 0.15, thickness: 0.02 });
      torusMesh.isPickable = false;
      torusMesh.doNotSyncBoundingInfo = true;
      torusMesh.rotation.x = -Math.PI / 2;
      torusMesh.billboardMode = LemonEntity.BILLBOARDMODE_ALL;
      this.addChild(torusMesh);

      this.position.set(this.point.x, this.point.y, this.point.z);
      this.drawNeedUpdate = false;
      return;
    }
  }

  public dispose(doNotRecurse?: boolean, disposeMaterialAndTextures?: boolean): void {
    if (this.onBeforeRenderObserver) {
      this.scene.onBeforeRenderObservable.remove(this.onBeforeRenderObserver);
      this.onBeforeRenderObserver = null;
    }
    this.point = null;
    super.dispose(doNotRecurse, disposeMaterialAndTextures);
  }
}
