export interface LemonInteractorInfo {
  screenX: number;
  screenY: number;
  worldX: number;
  worldY: number;
  worldZ: number;
}

export default interface LemonInteractorFilter {
  getFilterOrder(): number;
  onLeftButtonDown(info: LemonInteractorInfo): boolean;
  onLeftButtonUp(info: LemonInteractorInfo): boolean;
  onRightButtonDown(info: LemonInteractorInfo): boolean;
  onRightButtonUp(info: LemonInteractorInfo): boolean;
  onMouseMove(info: LemonInteractorInfo): boolean;
  onKeyPress(info: LemonInteractorInfo): boolean;
  onKeyRelease(info: LemonInteractorInfo): boolean;
}
