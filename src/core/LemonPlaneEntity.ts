import { Color3, Mesh, MeshBuilder, StandardMaterial, VertexData } from "@babylonjs/core";
import { v4 as uuidv4 } from "uuid";
import LemonPlane from "../geom/LemonPlane";
import LemonVector from "../geom/LemonVector";
import LemonEntity from "./LemonEntity";

export default class LemonPlaneEntity extends LemonEntity {
  private plane: LemonPlane | null = null;
  private drawNeedUpdate = true;

  public constructor(plane?: LemonPlane) {
    super();
    this.plane = plane || null;
  }

  public static topPlane(): LemonPlaneEntity {
    const plane = LemonPlane.topPlane();
    const entity = new LemonPlaneEntity();
    entity.plane = plane;
    return entity;
  }

  public static frontPlane(): LemonPlaneEntity {
    const plane = LemonPlane.frontPlane();
    const entity = new LemonPlaneEntity();
    entity.plane = plane;
    return entity;
  }

  public static rightPlane(): LemonPlaneEntity {
    const plane = LemonPlane.rightPlane();
    const entity = new LemonPlaneEntity();
    entity.plane = plane;
    return entity;
  }

  public draw(forceUpdate: boolean = false): void {
    if (!this.plane) {
      return;
    }
    if (forceUpdate) {
      this.drawNeedUpdate = true;
    }
    if (this.drawNeedUpdate) {
      this.getChildMeshes().forEach((child) => child.dispose());
      const discreteness = this.plane.discrete();
      const vertexData = new VertexData();
      vertexData.positions = discreteness.vertices;
      vertexData.indices = discreteness.indices;
      const planeMesh = new Mesh(uuidv4());
      vertexData.applyToMesh(planeMesh, false);
      this.addChild(planeMesh);

      const material = new StandardMaterial("planeMaterial", this.scene);
      material.emissiveColor = Color3.FromHexString("#0099FF");
      material.alpha = 0.15;
      material.backFaceCulling = false;
      planeMesh.material = material;
      planeMesh.isPickable = false;
      planeMesh.doNotSyncBoundingInfo = true;

      const outlineDiscreteness = this.plane.discreteOutline();
      for (const outline of outlineDiscreteness) {
        const vertexDataOutline = new VertexData();
        vertexDataOutline.positions = outline.vertices;
        vertexDataOutline.indices = outline.indices;
        const points: Array<LemonVector> = [];
        for (let i = 0; i < outline.vertices.length; i += 3) {
          points.push(new LemonVector(outline.vertices[i], outline.vertices[i + 1], outline.vertices[i + 2]));
        }
        const outlineMesh = MeshBuilder.CreateLines(uuidv4(), {
          points: points,
        });
        this.addChild(outlineMesh);
        outlineMesh.color = Color3.FromHexString("#0099FF");
        outlineMesh.isPickable = false;
        outlineMesh.doNotSyncBoundingInfo = true;
      }
      this.drawNeedUpdate = false;
      return;
    }
  }
}
