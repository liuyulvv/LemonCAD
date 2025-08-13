import useLemonStageStore from "../store/LemonStageStore";
import type LemonDrawInterface from "./LemonDrawInterface";
import { LemonDrawType } from "./LemonDrawInterface";
import LemonDrawSketch from "./LemonDrawSketch";

export default class LemonDrawManager {
  private static instance: LemonDrawManager;
  private currentDraw: LemonDrawInterface | null = null;
  private drawSketch: LemonDrawSketch;

  private constructor() {
    this.drawSketch = new LemonDrawSketch();
  }

  public static getInstance(): LemonDrawManager {
    if (!LemonDrawManager.instance) {
      LemonDrawManager.instance = new LemonDrawManager();
    }
    return LemonDrawManager.instance;
  }

  public beginDraw(type: LemonDrawType): void {
    if (this.currentDraw) {
      if (this.currentDraw.getDrawType() == type) {
        return;
      } else {
        useLemonStageStore.getState().interactorManager.removeFilter(this.currentDraw);
        this.currentDraw.shutdown();
      }
    }
    switch (type) {
      case LemonDrawType.Sketch:
        this.currentDraw = this.drawSketch;
        break;
    }
    useLemonStageStore.getState().interactorManager.insertFilter(this.currentDraw);
    this.currentDraw.begin();
  }

  public endDraw(): void {
    if (this.currentDraw) {
      this.currentDraw.shutdown();
    }
    this.currentDraw = null;
  }
}
