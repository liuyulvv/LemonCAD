import { Vector3 } from "@babylonjs/core";

export default class LemonVector extends Vector3 {
  public constructor(x?: number, y?: number, z?: number) {
    super(x, y, z);
  }

  public normalized(): LemonVector {
    const vector = new LemonVector(this.x, this.y, this.z);
    vector.normalize();
    return vector;
  }

  public clone(): LemonVector {
    return new LemonVector(this.x, this.y, this.z);
  }

  public cross(other: LemonVector): LemonVector {
    const result = super.cross(other);
    return new LemonVector(result.x, result.y, result.z);
  }
}
