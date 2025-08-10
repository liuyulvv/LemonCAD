import { Mesh, Scene } from "@babylonjs/core";
import { v4 as uuidv4 } from "uuid";

export default class LemonEntity extends Mesh {
  protected scene: Scene = this._scene;

  protected showStatus: boolean = true;

  public constructor() {
    super(uuidv4());
  }

  public show(flag: boolean): void {
    this.showStatus = flag;
    this.setEnabled(flag);
  }
}
