import { Shape } from "./shape";

export interface Rectangle extends Shape {}

/**
 * A rectangle where the x-axis side length is ...x and the y-side is, well, y.
 */
export const rectangle = (x: number, y: number): Rectangle => {
  return {
    points: {
      topLeft: { x: 0, y: 0 },
      topRight: { x: x, y: 0 },
      bottomLeft: { x: 0, y: y },
      bottomRight: { x: x, y: y },
    },
    pathSpec: `M0 0 l${x} 0 l0 ${y} l${-x} 0 L0 0`,
  };
};
