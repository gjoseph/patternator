import { Coords } from "../coords";
import { range } from "../misc";
import { Shape, toPathSpec } from "./shape";

export interface Polygon extends Shape {
  vertices: Coords[]; // overlap with points, if points could also be arrays we'd have points.vertices maybe
}

export interface RegularPolygon extends Polygon {
  sides: number;
  sideLength: number;
  // TODO radius? which one(s)?
}

export namespace Polygons {
  export const byInnerRadius = (
    sides: number,
    radius: number
  ): RegularPolygon => {
    throw new Error("Not implemented yet");
  };

  /**
   * Center will be at 0,0
   * @param sides number of sides
   * @param radius radius of circumscribing circle
   */ // TODO this is redundant with PolygonProducer
  export const byOuterRadius = (
    sides: number,
    radius: number
  ): RegularPolygon => {
    // Basically the angle between any two vertices is 2 pi / n and all the vertices are at distance r from the origin.
    const vertices = [...range(0, sides)].map((i) => {
      return {
        x: radius * Math.cos((2 * Math.PI * i) / sides),
        y: radius * Math.sin((2 * Math.PI * i) / sides),
      };
    });
    return {
      sides,
      sideLength: -1, // TODO
      vertices,
      points: {}, // TODO vertices + center
      pathSpec: toPathSpec(vertices),
    };
  };
  export const bySideLength = (
    sides: number,
    sideLength: number
  ): RegularPolygon => {
    throw new Error("Not implemented yet");
  };
}
