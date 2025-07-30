import { WebGPUEngine } from "@babylonjs/core";

export default class LemonEngine extends WebGPUEngine {
  public constructor(canvas: HTMLCanvasElement) {
    super(canvas, {
      antialias: true,
      adaptToDeviceRatio: true,
    });
  }
}
