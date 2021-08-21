import { Shape, toPathSpec } from "./shape";

export interface Rectangle extends Shape {}

/**
 * A rectangle where the x-axis side length is ...x and the y-side is, well, y.
 * {0,0} is topLeft -- should it be center?
 */
export const rectangle = (x: number, y: number): Rectangle => {
  const points = {
    topLeft: { x: 0, y: 0 },
    topRight: { x: x, y: 0 },
    bottomRight: { x: x, y: y },
    bottomLeft: { x: 0, y: y },
  };
  return {
    points,
    pathSpec: toPathSpec(Object.values(points)),
  };
};
