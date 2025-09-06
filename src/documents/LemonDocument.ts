export enum LemonDocumentType {
  CAD,
  Entity,
  PointEntity,
  LineEntity,
  PlaneEntity,
  SketchEntity,
}

export default interface LemonDocument {
  getLemonType(): LemonDocumentType;
}
