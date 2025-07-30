export class LemonGeomDiscreteness {
  public vertices: Array<number>;
  public indices: Array<number>;

  public constructor(vertices: Array<number> = [], indices: Array<number> = []) {
    this.vertices = vertices;
    this.indices = indices;
  }
}

export enum LemonGeomType {
  Point,
  Line,
  Plane,
}

export default interface LemonGeomInterface {
  geomType(): LemonGeomType;
  discrete(): LemonGeomDiscreteness;
  discreteOutline(): Array<LemonGeomDiscreteness>;
}
