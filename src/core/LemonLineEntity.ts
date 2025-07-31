import { Mesh, MeshBuilder } from "@babylonjs/core";
import { v4 as uuidv4 } from "uuid";
import { LemonLine } from "../geom/LemonLine";
import type LemonPoint from "../geom/LemonPoint";
import LemonVector from "../geom/LemonVector";
import LemonEntity from "./LemonEntity";

export default class LemonLineEntity extends LemonEntity {
  private line: LemonLine | null = null;
  private drawNeedUpdate = true;

  public constructor(line?: LemonLine) {
    super();
    this.line = line || null;
  }

  public static fromPoints(source: LemonPoint, target: LemonPoint): LemonLineEntity {
    const entity = new LemonLineEntity();
    entity.line = new LemonLine(source, target);
    return entity;
  }

  public draw(forceUpdate: boolean = false): void {
    if (!this.line) {
      return;
    }
    if (forceUpdate) {
      this.drawNeedUpdate = true;
    }
    if (this.drawNeedUpdate) {
      this.scene.removeMesh(this, true);
      const discreteness = this.line.discrete();
      const points: Array<LemonVector> = [];
      for (let i = 0; i < discreteness.vertices.length; i += 3) {
        points.push(new LemonVector(discreteness.vertices[i], discreteness.vertices[i + 1], discreteness.vertices[i + 2]));
      }
      const lineMesh = MeshBuilder.CreateLines(uuidv4(), {
        points: points,
      });
      Mesh.MergeMeshes([lineMesh], true);
      return;
    }
  }
}
