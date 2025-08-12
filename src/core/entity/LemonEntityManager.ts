import type LemonEntity from "./LemonEntity";

export default class LemonEntityManager {
  private entities: Map<string, LemonEntity> = new Map();

  public constructor() {}

  public addEntity(entity: LemonEntity): void {
    this.entities.set(entity.id, entity);
  }

  public getEntity(id: string): LemonEntity | undefined {
    return this.entities.get(id);
  }

  public removeEntity(id: string): void {
    this.entities.delete(id);
  }

  public dispose(): void {
    this.entities.clear();
  }
}
