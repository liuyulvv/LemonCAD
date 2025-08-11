import { Mesh, Scene } from "@babylonjs/core";
import { v4 as uuidv4 } from "uuid";

export default class LemonEntity extends Mesh {
  protected scene: Scene = this._scene;

  public constructor() {
    super(uuidv4());
  }

  public show(flag: boolean): void {
    this.isVisible = flag;
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
}
