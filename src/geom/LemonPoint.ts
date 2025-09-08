import type LemonGeomInterface from "./LemonGeomInterface";
import { LemonGeomDiscreteness, LemonGeomType } from "./LemonGeomInterface";
import LemonVector from "./LemonVector";

export interface LemonPointJSON {
  x: number;
  y: number;
  z: number;
}

export default class LemonPoint extends LemonVector implements LemonGeomInterface {
  public constructor(x?: number, y?: number, z?: number) {
    super(x, y, z);
  }

  public distance(point: LemonPoint): number {
    return LemonVector.Distance(this, point);
  }

  public geomType(): LemonGeomType {
    return LemonGeomType.Point;
  }

  public discrete(): LemonGeomDiscreteness {
    const discreteness = new LemonGeomDiscreteness();
    discreteness.vertices = [this.x, this.y, this.z];
    discreteness.indices = [0];
    return discreteness;
  }

  public discreteOutline(): Array<LemonGeomDiscreteness> {
    return [];
  }

  public serialize(): LemonPointJSON {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    };
  }

  public deserialize(doc: LemonPointJSON): void {
    this.x = doc.x;
    this.y = doc.y;
    this.z = doc.z;
  }

  public clone(): LemonPoint {
    return new LemonPoint(this.x, this.y, this.z);
  }

  public cross(other: LemonPoint): LemonPoint {
    const result = super.cross(other);
    return new LemonPoint(result.x, result.y, result.z);
  }
}
