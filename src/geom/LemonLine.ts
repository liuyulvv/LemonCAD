import type LemonGeomInterface from "./LemonGeomInterface";
import { LemonGeomDiscreteness, LemonGeomType } from "./LemonGeomInterface";
import LemonPoint from "./LemonPoint";

export class LemonLine implements LemonGeomInterface {
  private source_: LemonPoint;
  private target_: LemonPoint;

  public constructor() {
    this.source_ = new LemonPoint();
    this.target_ = new LemonPoint();
  }

  public get source(): LemonPoint {
    return this.source_;
  }

  public set source(value: LemonPoint) {
    this.source_ = value;
  }

  public get target(): LemonPoint {
    return this.target_;
  }

  public set target(value: LemonPoint) {
    this.target_ = value;
  }

  public geomType(): LemonGeomType {
    return LemonGeomType.Line;
  }

  public discrete(): LemonGeomDiscreteness {
    const discreteness = new LemonGeomDiscreteness();
    discreteness.vertices = [this.source_.x, this.source_.y, this.source_.z, this.target_.x, this.target_.y, this.target_.z];
    discreteness.indices = [0, 1];
    return discreteness;
  }

  public discreteOutline(): Array<LemonGeomDiscreteness> {
    return [];
  }
}
