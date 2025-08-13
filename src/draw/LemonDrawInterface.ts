import type LemonInteractorFilter from "../core/interactor/LemonInteractorFilter";

export enum LemonDrawType {
  Sketch,
}

export default interface LemonDrawInterface extends LemonInteractorFilter {
  getDrawType(): LemonDrawType;
  begin(): void;
  end(): void;
  shutdown(): void;
}
