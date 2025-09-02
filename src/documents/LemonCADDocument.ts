import { v4 as uuidv4 } from "uuid";
import LemonPlane from "../geom/LemonPlane";
import LemonPoint from "../geom/LemonPoint";
import type LemonDocument from "./LemonDocument";
import { LemonDocumentType } from "./LemonDocument";

export default class LemonCADDocument implements LemonDocument {
  public readonly id: string;
  public readonly origin: LemonPoint;
  public readonly frontPlane: LemonPlane;
  public readonly topPlane: LemonPlane;
  public readonly rightPlane: LemonPlane;

  public children: Array<LemonDocument>;

  public constructor() {
    this.id = uuidv4();
    this.origin = new LemonPoint(0, 0, 0);
    this.frontPlane = LemonPlane.frontPlane();
    this.topPlane = LemonPlane.topPlane();
    this.rightPlane = LemonPlane.rightPlane();
    this.children = [];
  }

  public getLemonType(): LemonDocumentType {
    return LemonDocumentType.CAD;
  }
}
