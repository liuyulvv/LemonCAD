import { Matrix, Vector3 } from "@babylonjs/core";
import earcut from "earcut";
import type LemonGeomInterface from "./LemonGeomInterface";
import { LemonGeomDiscreteness, LemonGeomType } from "./LemonGeomInterface";
import type { LemonPointJSON } from "./LemonPoint";
import LemonPoint from "./LemonPoint";
import type LemonVector from "./LemonVector";

export interface LemonPlaneJSON {
  origin: LemonPointJSON;
  xAxis: LemonPointJSON;
  yAxis: LemonPointJSON;
  zAxis: LemonPointJSON;
}

export default class LemonPlane implements LemonGeomInterface {
  private origin: LemonPoint;
  private xAxis: LemonPoint;
  private yAxis: LemonPoint;
  private zAxis: LemonPoint;
  private localToWorldMatrix: Matrix;
  private worldToLocalMatrix: Matrix;

  public constructor() {
    this.origin = new LemonPoint(0, 0, 0);
    this.xAxis = new LemonPoint(1, 0, 0);
    this.yAxis = new LemonPoint(0, 1, 0);
    this.zAxis = new LemonPoint(0, 0, 1);
    this.localToWorldMatrix = Matrix.Identity();
    this.worldToLocalMatrix = Matrix.Identity();
    this.buildTransform();
  }

  public static fromAxis(origin: LemonPoint, xAxis: LemonPoint, yAxis: LemonPoint): LemonPlane {
    const plane = new LemonPlane();
    plane.origin = origin.clone();
    plane.xAxis = xAxis.clone().normalize();
    plane.yAxis = yAxis.clone().normalize();
    plane.zAxis = plane.xAxis.clone().cross(plane.yAxis).normalize();
    plane.buildTransform();
    return plane;
  }

  public static topPlane(): LemonPlane {
    const plane = new LemonPlane();
    return plane;
  }

  public static frontPlane(): LemonPlane {
    const plane = new LemonPlane();
    plane.xAxis = new LemonPoint(1, 0, 0);
    plane.yAxis = new LemonPoint(0, 0, 1);
    plane.zAxis = new LemonPoint(0, -1, 0);
    plane.buildTransform();
    return plane;
  }

  public static rightPlane(): LemonPlane {
    const plane = new LemonPlane();
    plane.xAxis = new LemonPoint(0, 1, 0);
    plane.yAxis = new LemonPoint(0, 0, 1);
    plane.zAxis = new LemonPoint(1, 0, 0);
    plane.buildTransform();
    return plane;
  }

  public localToWorld(localPoint: LemonPoint | LemonVector | Vector3): LemonPoint {
    const point = new LemonPoint(localPoint.x, localPoint.y, 0);
    const result = LemonPoint.TransformCoordinates(point, this.localToWorldMatrix);
    point.set(result.x, result.y, result.z);
    return point;
  }

  public worldToLocal(worldPoint: LemonPoint | LemonVector | Vector3): LemonPoint {
    const result = LemonPoint.TransformCoordinates(worldPoint, this.worldToLocalMatrix);
    const point = new LemonPoint(result.x, result.y, 0);
    return point;
  }

  public geomType(): LemonGeomType {
    return LemonGeomType.Plane;
  }

  public getNormal(): LemonPoint {
    return this.zAxis.clone().normalize();
  }

  public discrete(): LemonGeomDiscreteness {
    const width = 10;
    const height = 10;
    const leftTop = this.origin
      .add(
        this.xAxis
          .clone()
          .normalize()
          .scale(-width / 2)
      )
      .add(
        this.yAxis
          .clone()
          .normalize()
          .scale(height / 2)
      );
    const leftBottom = leftTop.clone().add(this.yAxis.clone().normalize().scale(-height));
    const rightTop = leftTop.clone().add(this.xAxis.clone().normalize().scale(width));
    const rightBottom = leftBottom.clone().add(this.xAxis.clone().normalize().scale(width));
    const vertices = [
      leftTop.x,
      leftTop.y,
      leftTop.z,
      leftBottom.x,
      leftBottom.y,
      leftBottom.z,
      rightBottom.x,
      rightBottom.y,
      rightBottom.z,
      rightTop.x,
      rightTop.y,
      rightTop.z,
    ];
    const projectedLeftTop = this.worldToLocal(leftTop);
    const projectedLeftBottom = this.worldToLocal(leftBottom);
    const projectedRightTop = this.worldToLocal(rightTop);
    const projectedRightBottom = this.worldToLocal(rightBottom);
    const projectedVertices = [
      projectedLeftTop.x,
      projectedLeftTop.y,
      projectedLeftTop.z,
      projectedLeftBottom.x,
      projectedLeftBottom.y,
      projectedLeftBottom.z,
      projectedRightBottom.x,
      projectedRightBottom.y,
      projectedRightBottom.z,
      projectedRightTop.x,
      projectedRightTop.y,
      projectedRightTop.z,
    ];
    const discreteness = new LemonGeomDiscreteness();
    discreteness.vertices = vertices;
    discreteness.indices = earcut(projectedVertices, [], 3);
    return discreteness;
  }

  public discreteOutline(): Array<LemonGeomDiscreteness> {
    const width = 10;
    const height = 10;
    const leftTop = this.origin
      .clone()
      .add(
        this.xAxis
          .clone()
          .normalize()
          .scale(-width / 2)
      )
      .add(
        this.yAxis
          .clone()
          .normalize()
          .scale(height / 2)
      );
    const leftBottom = leftTop.clone().add(this.yAxis.clone().normalize().scale(-height));
    const rightTop = leftTop.clone().add(this.xAxis.clone().normalize().scale(width));
    const rightBottom = leftBottom.clone().add(this.xAxis.clone().normalize().scale(width));

    const result: Array<LemonGeomDiscreteness> = [];
    const discreteness = new LemonGeomDiscreteness();
    discreteness.vertices = [leftTop.x, leftTop.y, leftTop.z, leftBottom.x, leftBottom.y, leftBottom.z];
    discreteness.vertices.push(rightBottom.x, rightBottom.y, rightBottom.z);
    discreteness.vertices.push(rightTop.x, rightTop.y, rightTop.z);
    discreteness.vertices.push(leftTop.x, leftTop.y, leftTop.z);
    discreteness.indices = [0, 1, 2, 3, 0];
    result.push(discreteness);
    return result;
  }

  private buildTransform(): void {
    Matrix.FromXYZAxesToRef(this.xAxis, this.yAxis, this.zAxis, this.localToWorldMatrix);
    this.localToWorldMatrix.setTranslation(this.origin);
    this.worldToLocalMatrix = this.localToWorldMatrix.clone().invert();
  }

  public serialize(): LemonPlaneJSON {
    return {
      origin: this.origin.serialize(),
      xAxis: this.xAxis.serialize(),
      yAxis: this.yAxis.serialize(),
      zAxis: this.zAxis.serialize(),
    };
  }

  public deserialize(doc: LemonPlaneJSON): void {
    this.origin.deserialize(doc.origin);
    this.xAxis.deserialize(doc.xAxis);
    this.yAxis.deserialize(doc.yAxis);
    this.zAxis.deserialize(doc.zAxis);
  }
}
