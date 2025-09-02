import { Mesh, MeshBuilder, Observer, Scene, StandardMaterial, VertexData } from "@babylonjs/core";
import { v4 as uuidv4 } from "uuid";
import { LemonDocumentType } from "../../documents/LemonDocument";
import LemonPlane, { type LemonPlaneJSON } from "../../geom/LemonPlane";
import LemonVector from "../../geom/LemonVector";
import LemonEntity, { type LemonEntityDocument } from "./LemonEntity";

export interface LemonPlaneEntityDocument extends LemonEntityDocument {
  plane: LemonPlaneJSON;
}

export default class LemonPlaneEntity extends LemonEntity {
  private plane: LemonPlane;
  private drawNeedUpdate = true;
  private planeMesh: Mesh | null = null;
  private outlineMesh: Mesh | null = null;
  private outlineMeshPoints: Array<LemonVector> = [];
  private outlineMaterial: StandardMaterial;
  private onBeforeRenderObserver: Observer<Scene>;

  public constructor(plane: LemonPlane) {
    super();
    this.plane = plane;
    this.outlineMaterial = this.defaultMaterial.clone(uuidv4());
    this.defaultMaterial.alpha = 0.15;
    this.selectedMaterial.alpha = 0.15;
    this.onBeforeRenderObserver = this.scene.onBeforeRenderObservable.add(() => {
      const camera = this.scene.activeCamera;
      if (camera && this.position) {
        const scale = camera.orthoLeft! / 30;
        if (this.outlineMesh) {
          this.outlineMesh = MeshBuilder.CreateTube(uuidv4(), {
            path: this.outlineMeshPoints,
            radius: 0.02 * scale,
            updatable: true,
            instance: this.outlineMesh,
          });
        }
      }
    });
  }

  public draw(forceUpdate: boolean = false): void {
    if (forceUpdate) {
      this.drawNeedUpdate = true;
    }
    if (this.drawNeedUpdate) {
      this.getChildMeshes().forEach((child) => child.dispose());
      const discreteness = this.plane.discrete();
      const vertexData = new VertexData();
      vertexData.positions = discreteness.vertices;
      vertexData.indices = discreteness.indices;
      this.planeMesh = new Mesh(uuidv4());
      vertexData.applyToMesh(this.planeMesh, false);
      this.addChild(this.planeMesh);

      this.planeMesh.material = this.defaultMaterial;

      this.planeMesh.isPickable = false;
      this.planeMesh.doNotSyncBoundingInfo = true;

      const outlineDiscreteness = this.plane.discreteOutline();
      this.outlineMeshPoints = [];
      for (const outline of outlineDiscreteness) {
        const vertexDataOutline = new VertexData();
        vertexDataOutline.positions = outline.vertices;
        vertexDataOutline.indices = outline.indices;
        const points: Array<LemonVector> = [];
        for (let i = 0; i < outline.vertices.length; i += 3) {
          points.push(new LemonVector(outline.vertices[i], outline.vertices[i + 1], outline.vertices[i + 2]));
        }
        this.outlineMeshPoints.push(...points);
      }
      this.outlineMesh = MeshBuilder.CreateTube(uuidv4(), {
        path: this.outlineMeshPoints,
        radius: 0.02,
        updatable: true,
      });
      this.addChild(this.outlineMesh);
      this.outlineMesh.material = this.outlineMaterial;
      this.outlineMesh.isPickable = false;
      this.outlineMesh.doNotSyncBoundingInfo = true;

      this.drawNeedUpdate = false;
      return;
    }
  }

  public getPlane(): LemonPlane {
    return this.plane;
  }

  public onSelected(selected: boolean): void {
    super.onSelected(selected);
    if (this.planeMesh) {
      if (selected) {
        this.planeMesh.material = this.selectedMaterial;
      } else {
        this.planeMesh.material = this.defaultMaterial;
      }
    }
  }

  public onHovered(hovered: boolean): void {
    super.onHovered(hovered);
    if (this.selectedStatus || !this.outlineMesh) {
      return;
    }
    if (hovered) {
      this.outlineMesh.material = this.hoveredMaterial;
    } else {
      this.outlineMesh.material = this.outlineMaterial;
    }
  }

  public dispose(doNotRecurse?: boolean, disposeMaterialAndTextures?: boolean): void {
    if (this.onBeforeRenderObserver) {
      this.scene.onBeforeRenderObservable.remove(this.onBeforeRenderObserver);
    }
    super.dispose(doNotRecurse, disposeMaterialAndTextures);
  }

  public serialize(): LemonPlaneEntityDocument {
    return {
      getLemonType: () => {
        return LemonDocumentType.PLANE_ENTITY;
      },
      id: this.id,
      plane: this.plane.serialize(),
    };
  }

  public deserialize(doc: LemonPlaneEntityDocument): void {
    this.id = doc.id;
    this.plane.deserialize(doc.plane);
  }
}
