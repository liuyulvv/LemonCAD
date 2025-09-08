import { Mesh, Scene, StandardMaterial } from "@babylonjs/core";
import { v4 as uuidv4 } from "uuid";
import type LemonDocument from "../../documents/LemonDocument";
import { LemonDocumentType } from "../../documents/LemonDocument";
import useLemonStageStore from "../../store/LemonStageStore";
import LemonMaterialManager from "../LemonMaterialManager";

export interface LemonEntityDocument extends LemonDocument {
  id: string;
}

export default class LemonEntity extends Mesh {
  protected entityID: string;
  protected entityName: string;
  protected scene: Scene = this._scene;
  protected selectedStatus: boolean = false;
  protected hoveredStatus: boolean = false;

  protected defaultMaterial: StandardMaterial;
  protected selectedMaterial: StandardMaterial;
  protected hoveredMaterial: StandardMaterial;

  public constructor() {
    super(uuidv4());
    this.entityID = this.id;
    this.entityName = "Entity";
    this.defaultMaterial = LemonMaterialManager.getInstance().getDefaultMaterial();
    this.selectedMaterial = LemonMaterialManager.getInstance().getSelectedMaterial();
    this.hoveredMaterial = LemonMaterialManager.getInstance().getHoveredMaterial();
    useLemonStageStore.getState().entityManager.addEntity(this);
  }

  public getEntityID(): string {
    return this.entityID;
  }

  public setEntityID(id: string): void {
    useLemonStageStore.getState().entityManager.removeEntity(this.entityID);
    this.entityID = id;
    this.id = id;
    useLemonStageStore.getState().entityManager.addEntity(this);
  }

  public getEntityName(): string {
    return this.entityName;
  }

  public setEntityName(name: string): void {
    this.entityName = name;
  }

  public show(flag: boolean): void {
    this.isVisible = flag;
    this.setEnabled(flag);
  }

  public getRootEntity(): LemonEntity {
    let root = this as LemonEntity;
    while (root && root.parent) {
      root = root.parent as LemonEntity;
    }
    return root;
  }

  public getParentEntity(): LemonEntity | null {
    const parent = this.parent as LemonEntity;
    return parent || null;
  }

  public getChildrenEntity(): Array<LemonEntity> {
    return this.getChildren().map((child) => child as LemonEntity);
  }

  // public getAllChildrenEntity(): Array<LemonEntity> {
  //   return this.getChildMeshes().map((child) => child as LemonEntity);
  // }

  public isSelected(): boolean {
    return this.selectedStatus;
  }

  public isHovered(): boolean {
    return this.hoveredStatus;
  }

  public onSelected(selected: boolean): void {
    this.selectedStatus = selected;
    if (selected) {
      this.material = this.selectedMaterial;
    } else {
      if (this.hoveredStatus) {
        this.material = this.hoveredMaterial;
      } else {
        this.material = this.defaultMaterial;
      }
    }
  }

  public onHovered(hovered: boolean): void {
    this.hoveredStatus = hovered;
    if (this.selectedStatus) {
      return;
    }
    if (hovered) {
      this.material = this.hoveredMaterial;
    } else {
      this.material = this.defaultMaterial;
    }
  }

  public override dispose(doNotRecurse?: boolean, _disposeMaterialAndTextures?: boolean): void {
    super.dispose(doNotRecurse, true);
    this.defaultMaterial.dispose();
    this.selectedMaterial.dispose();
    this.hoveredMaterial.dispose();
    useLemonStageStore.getState().entityManager.removeEntity(this.id);
  }

  public getEntityType(): LemonDocumentType {
    return LemonDocumentType.Entity;
  }

  public serialize(): LemonEntityDocument {
    return {
      getLemonType: () => {
        return LemonDocumentType.Entity;
      },
      id: this.id,
    };
  }

  public deserialize(doc: LemonEntityDocument): void {
    this.id = doc.id;
  }
}
