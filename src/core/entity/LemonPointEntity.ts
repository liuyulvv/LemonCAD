import { Mesh, MeshBuilder, Observer, Scene } from "@babylonjs/core";
import { v4 as uuidv4 } from "uuid";
import { LemonDocumentType } from "../../documents/LemonDocument";
import type LemonPoint from "../../geom/LemonPoint";
import type { LemonPointJSON } from "../../geom/LemonPoint";
import LemonEntity, { type LemonEntityDocument } from "./LemonEntity";

export interface LemonPointEntityDocument extends LemonEntityDocument {
  point: LemonPointJSON;
}

export default class LemonPointEntity extends LemonEntity {
  private point: LemonPoint;
  private drawNeedUpdate = true;
  private onBeforeRenderObserver: Observer<Scene> | null = null;
  private centerMesh: Mesh | null = null;
  private torusMesh: Mesh | null = null;

  public constructor(point: LemonPoint, ignoreCameraZoom: boolean = true) {
    super();
    this.point = point;
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
    if (forceUpdate) {
      this.drawNeedUpdate = true;
    }
    if (this.drawNeedUpdate) {
      this.getChildMeshes().forEach((child) => child.dispose());
      this.centerMesh = MeshBuilder.CreateSphere(uuidv4(), { diameter: 0.1 });
      this.centerMesh.isPickable = false;
      this.centerMesh.doNotSyncBoundingInfo = true;
      this.centerMesh.material = this.defaultMaterial;
      this.addChild(this.centerMesh);

      this.torusMesh = MeshBuilder.CreateTorus(uuidv4(), { diameter: 0.3, thickness: 0.04 });
      this.torusMesh.isPickable = false;
      this.torusMesh.doNotSyncBoundingInfo = true;
      this.torusMesh.rotation.x = -Math.PI / 2;
      this.torusMesh.billboardMode = LemonEntity.BILLBOARDMODE_ALL;
      this.torusMesh.material = this.defaultMaterial;
      this.addChild(this.torusMesh);

      this.position.set(this.point.x, this.point.y, this.point.z);
      this.drawNeedUpdate = false;
      return;
    }
  }

  public onSelected(selected: boolean): void {
    super.onSelected(selected);
    if (this.centerMesh && this.torusMesh) {
      if (selected) {
        this.centerMesh.material = this.selectedMaterial;
        this.torusMesh.material = this.selectedMaterial;
      } else {
        this.centerMesh.material = this.defaultMaterial;
        this.torusMesh.material = this.defaultMaterial;
      }
    }
  }

  public onHovered(hovered: boolean): void {
    super.onHovered(hovered);
    if (this.selectedStatus || !this.centerMesh || !this.torusMesh) {
      return;
    }
    if (hovered) {
      this.centerMesh.material = this.hoveredMaterial;
      this.torusMesh.material = this.hoveredMaterial;
    } else {
      this.centerMesh.material = this.defaultMaterial;
      this.torusMesh.material = this.defaultMaterial;
    }
  }

  public dispose(doNotRecurse?: boolean, disposeMaterialAndTextures?: boolean): void {
    if (this.onBeforeRenderObserver) {
      this.scene.onBeforeRenderObservable.remove(this.onBeforeRenderObserver);
      this.onBeforeRenderObserver = null;
    }
    super.dispose(doNotRecurse, disposeMaterialAndTextures);
  }

  public getEntityType(): LemonDocumentType {
    return LemonDocumentType.PointEntity;
  }

  public serialize(): LemonPointEntityDocument {
    return {
      getLemonType: () => {
        return LemonDocumentType.PointEntity;
      },
      id: this.id,
      point: this.point.serialize(),
    };
  }

  public deserialize(doc: LemonPointEntityDocument): void {
    this.id = doc.id;
    this.point.deserialize(doc.point);
  }
}
