import type LemonGeomInterface from "./LemonGeomInterface";
import { LemonGeomDiscreteness, LemonGeomType } from "./LemonGeomInterface";
import LemonPoint, { type LemonPointJSON } from "./LemonPoint";

export interface LemonLineJSON {
  source: LemonPointJSON;
  target: LemonPointJSON;
}

export class LemonLine implements LemonGeomInterface {
  private source: LemonPoint;
  private target: LemonPoint;

  public constructor(source?: LemonPoint, target?: LemonPoint) {
    this.source = source || new LemonPoint();
    this.target = target || new LemonPoint();
  }

  public getSource(): LemonPoint {
    return this.source;
  }

  public setSource(point: LemonPoint) {
    this.source = point;
  }

  public getTarget(): LemonPoint {
    return this.target;
  }

  public setTarget(point: LemonPoint) {
    this.target = point;
  }

  public geomType(): LemonGeomType {
    return LemonGeomType.Line;
  }

  public discrete(): LemonGeomDiscreteness {
    const discreteness = new LemonGeomDiscreteness();
    discreteness.vertices = [this.source.x, this.source.y, this.source.z, this.target.x, this.target.y, this.target.z];
    discreteness.indices = [0, 1];
    return discreteness;
  }

  public discreteOutline(): Array<LemonGeomDiscreteness> {
    return [];
  }

  public serialize(): LemonLineJSON {
    return {
      source: this.source.serialize(),
      target: this.target.serialize(),
    };
  }

  public deserialize(doc: LemonLineJSON): void {
    this.source.deserialize(doc.source);
    this.target.deserialize(doc.target);
  }
}
