import { Color3, StandardMaterial } from "@babylonjs/core";
import { v4 as uuidv4 } from "uuid";

export default class LemonMaterialManager {
  private static instance: LemonMaterialManager;

  private color: string;
  private selectedColor: string;
  private hoveredColor: string;

  private constructor() {
    this.color = "#0099FF";
    this.selectedColor = "#FFCC00";
    this.hoveredColor = "#FF6600";
  }

  public static getInstance(): LemonMaterialManager {
    if (!LemonMaterialManager.instance) {
      LemonMaterialManager.instance = new LemonMaterialManager();
    }
    return LemonMaterialManager.instance;
  }

  public getMaterial(color: string): StandardMaterial {
    const material = new StandardMaterial(uuidv4());
    material.emissiveColor = Color3.FromHexString(color);
    material.backFaceCulling = false;
    return material;
  }

  public getDefaultMaterial(): StandardMaterial {
    return this.getMaterial(this.color).clone(uuidv4());
  }

  public getSelectedMaterial(): StandardMaterial {
    return this.getMaterial(this.selectedColor).clone(uuidv4());
  }

  public getHoveredMaterial(): StandardMaterial {
    return this.getMaterial(this.hoveredColor).clone(uuidv4());
  }
}
