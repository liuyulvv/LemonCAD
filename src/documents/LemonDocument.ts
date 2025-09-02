export enum LemonDocumentType {
  CAD,
  ENTITY,
  POINT_ENTITY,
  LINE_ENTITY,
  PLANE_ENTITY,
}

export default interface LemonDocument {
  getLemonType(): LemonDocumentType;
}
