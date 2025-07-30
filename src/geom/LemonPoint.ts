import type LemonGeomInterface from "./LemonGeomInterface";
import { LemonGeomDiscreteness, LemonGeomType } from "./LemonGeomInterface";
import LemonVector from "./LemonVector";

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
}
