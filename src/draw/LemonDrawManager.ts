import useLemonStageStore from "../store/LemonStageStore";
import type LemonDrawInterface from "./LemonDrawInterface";
import { LemonDrawType } from "./LemonDrawInterface";
import LemonDrawSketch from "./LemonDrawSketch";

export default class LemonDrawManager {
  private static instance: LemonDrawManager;
  private drawType: LemonDrawType | null = null;
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

  public getDrawType(): LemonDrawType | null {
    return this.drawType;
  }

  public beginDraw(drawType: LemonDrawType): void {
    if (this.currentDraw) {
      if (this.currentDraw.getDrawType() == drawType) {
        return;
      } else {
        if (this.currentDraw.getDrawType() == LemonDrawType.Sketch && drawType >= LemonDrawType.SketchLine && drawType <= LemonDrawType.SketchLine) {
          this.drawType = drawType;
          this.drawSketch.beginDraw(drawType);
          return;
        } else {
          useLemonStageStore.getState().interactorManager.removeFilter(this.currentDraw);
          this.currentDraw.shutdown();
        }
      }
    }
    switch (drawType) {
      case LemonDrawType.Sketch:
        this.currentDraw = this.drawSketch;
        break;
    }
    this.drawType = drawType;
    if (this.currentDraw) {
      useLemonStageStore.getState().interactorManager.insertFilter(this.currentDraw);
      this.currentDraw.begin();
    }
  }

  public endDraw(): void {
    if (this.currentDraw) {
      this.currentDraw.end();
      useLemonStageStore.getState().interactorManager.removeFilter(this.currentDraw);
    }
    this.currentDraw = null;
    this.drawType = null;
  }

  public shutdown(): void {
    if (this.currentDraw) {
      useLemonStageStore.getState().interactorManager.removeFilter(this.currentDraw);
      this.currentDraw.shutdown();
      this.currentDraw = null;
      this.drawType = null;
    }
  }
}
