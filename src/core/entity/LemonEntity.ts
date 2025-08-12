import { Mesh, Scene, StandardMaterial } from "@babylonjs/core";
import { v4 as uuidv4 } from "uuid";
import LemonMaterialManager from "../LemonMaterialManager";

export default class LemonEntity extends Mesh {
  protected scene: Scene = this._scene;
  protected selectedStatus: boolean = false;
  protected hoveredStatus: boolean = false;

  protected defaultMaterial: StandardMaterial;
  protected selectedMaterial: StandardMaterial;
  protected hoveredMaterial: StandardMaterial;

  public constructor() {
    super(uuidv4());

    this.defaultMaterial = LemonMaterialManager.getInstance().getDefaultMaterial();
    this.selectedMaterial = LemonMaterialManager.getInstance().getSelectedMaterial();
    this.hoveredMaterial = LemonMaterialManager.getInstance().getHoveredMaterial();
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
    let parent = this.parent as LemonEntity;
    return parent || null;
  }

  public getChildrenEntity(): Array<LemonEntity> {
    return this.getChildren().map((child) => child as LemonEntity);
  }

  public getAllChildrenEntity(): Array<LemonEntity> {
    return this.getChildMeshes().map((child) => child as LemonEntity);
  }

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
  }
}
