import { Mesh, MeshBuilder, Observer, Scene } from "@babylonjs/core";
import { v4 as uuidv4 } from "uuid";
import { LemonLine } from "../../geom/LemonLine";
import type LemonPoint from "../../geom/LemonPoint";
import LemonVector from "../../geom/LemonVector";
import LemonEntity from "./LemonEntity";

export default class LemonLineEntity extends LemonEntity {
  private line: LemonLine | null = null;
  private drawNeedUpdate = true;
  private lineMesh: Mesh | null = null;
  private lineMeshPoints: LemonVector[] = [];
  private onBeforeRenderObserver: Observer<Scene>;

  public constructor(line?: LemonLine) {
    super();
    this.line = line || null;
    this.onBeforeRenderObserver = this.scene.onBeforeRenderObservable.add(() => {
      const camera = this.scene.activeCamera;
      if (camera && this.position) {
        const scale = camera.orthoTop! / 30;
        if (this.lineMesh) {
          this.lineMesh = MeshBuilder.CreateTube(uuidv4(), {
            path: this.lineMeshPoints,
            radius: 0.02 * scale,
            updatable: true,
          });
        }
      }
    });
  }

  public static fromPoints(source: LemonPoint, target: LemonPoint): LemonLineEntity {
    const entity = new LemonLineEntity();
    entity.line = new LemonLine(source, target);
    return entity;
  }

  public draw(forceUpdate: boolean = false): void {
    if (!this.line) {
      return;
    }
    if (forceUpdate) {
      this.drawNeedUpdate = true;
    }
    if (this.drawNeedUpdate) {
      this.getChildMeshes().forEach((child) => child.dispose());
      const discreteness = this.line.discrete();
      const points: Array<LemonVector> = [];
      for (let i = 0; i < discreteness.vertices.length; i += 3) {
        points.push(new LemonVector(discreteness.vertices[i], discreteness.vertices[i + 1], discreteness.vertices[i + 2]));
      }
      this.lineMeshPoints = points;
      this.lineMesh = MeshBuilder.CreateTube(uuidv4(), {
        path: points,
        radius: 0.02,
        updatable: true,
      });
      this.lineMesh.material = this.defaultMaterial;
      this.lineMesh.isPickable = false;
      this.lineMesh.doNotSyncBoundingInfo = true;
      this.addChild(this.lineMesh);
      this.drawNeedUpdate = false;
      return;
    }
  }

  public dispose(doNotRecurse?: boolean, disposeMaterialAndTextures?: boolean): void {
    if (this.onBeforeRenderObserver) {
      this.scene.onBeforeRenderObservable.remove(this.onBeforeRenderObserver);
    }
    super.dispose(doNotRecurse, disposeMaterialAndTextures);
  }
}
