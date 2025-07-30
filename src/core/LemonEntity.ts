import { Mesh, Scene } from "@babylonjs/core";
import { v4 as uuidv4 } from "uuid";

export default class LemonEntity extends Mesh {
  protected scene: Scene = this._scene;

  public constructor() {
    super(uuidv4());
  }
}
