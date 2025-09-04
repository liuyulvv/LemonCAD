export enum LemonDocumentType {
  CAD,
  Entity,
  PointEntity,
  LineEntity,
  PlaneEntity,
}

export default interface LemonDocument {
  getLemonType(): LemonDocumentType;
}
