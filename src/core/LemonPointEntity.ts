import { MeshBuilder, Observer, Scene } from "@babylonjs/core";
import { v4 as uuidv4 } from "uuid";
import type LemonPoint from "../geom/LemonPoint";
import LemonVector from "../geom/LemonVector";
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
            const distance = LemonVector.Distance(this.position, camera.position);
            const scale = distance / Math.sqrt(300);
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
      const sphereMesh = MeshBuilder.CreateSphere(uuidv4(), { diameter: 0.15 });
      sphereMesh.isPickable = false;
      sphereMesh.doNotSyncBoundingInfo = true;
      this.addChild(sphereMesh);
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
