import { AngleInDegrees } from "../misc";
import { Shape } from "./shape";

export interface Triangle extends Shape {
  // points: {
  //   a: Coords;
  //   b: Coords;
  //   c: Coords;
  // TODO: add center
  // };
  sides: {
    a: number;
    b: number;
    c: number;
  };
  angles: {
    ab: AngleInDegrees;
    bc: AngleInDegrees;
    ac: AngleInDegrees;
  };
}

/**
 * If 1 parameter is given, returns an equilateral triangle. If 2 parameters are given, returns a right angle triangle,
 * where the hypotenuse is derived from the given a and b side lengths.
 * The triangle will be drawn such that points a and b are on the same x-axis and point c is drawn below on the y-axis.
 *
 * TODO: for some reason i'm insistent that triange point A is first, and so is side A, which makes it hard to known which is which
 * in most docs i see, point and angle "A" are OPPOSITE side a
 */
export const triangle = (
  lengthSideA: number,
  lengthSideB?: number,
  lengthSideC?: number
): Triangle => {
  if (lengthSideB === undefined) {
    lengthSideC = lengthSideB = lengthSideA;
  } else if (lengthSideC === undefined) {
    lengthSideC = Math.hypot(lengthSideA, lengthSideB);
  }

  const a = { x: 0, y: 0 };
  const b = { x: lengthSideA, y: 0 };
  // https://math.stackexchange.com/questions/2480560/computing-coordinates-of-vertices-in-a-sss-triangle
  // This is also apply law of cosines, but isn't applying cos-1 to it!?
  const cX = round(
    (lengthSideC * (sq(lengthSideC) + sq(lengthSideA) - sq(lengthSideB))) /
      (2 * lengthSideC * lengthSideA)
  );
  const c = {
    x: cX,
    y: round(Math.sqrt(sq(lengthSideC) - sq(cX))),
  };
  return {
    points: { a, b, c },
    sides: { a: lengthSideA, b: lengthSideB, c: lengthSideC },
    angles: findAnglesFromSides(lengthSideA, lengthSideB, lengthSideC),
    pathSpec: `M0 0, L${b.x} ${b.y}, L${c.x} ${c.y}, L0 0`,
  };
};

/*
Law of Cosines:
cos(C) = (a² + b² − c²) / 2ab
cos(A) = (b² + c² − a²) / 2bc
cos(B) = (c² + a² − b²) / 2ca
Find 2, assert the 3rd would sum it all up to 180
 */
const findAnglesFromSides = (a: number, b: number, c: number) => {
  const angles = {
    ab: angleBetween(a, b, c),
    bc: angleBetween(b, c, a),
    ac: angleBetween(a, c, b),
  };
  // The sum still has a bit of a rounding issue  (e.g triangle(100, 140, 140) gives us a sum of 180.01
  const sumAngles = round(angles.ab + angles.bc + angles.ac, 1);
  if (sumAngles !== 180) {
    throw new Error(`WTF law of cosines is broken (sum is ${sumAngles})`);
  }
  return angles;
};

const angleBetween = (
  sideLeft: number,
  sideRight: number,
  sideOpposite: number
): number => {
  return round(
    radToDeg(
      Math.acos(
        (sq(sideLeft) + sq(sideRight) - sq(sideOpposite)) /
          (2 * sideLeft * sideRight)
      )
    )
  );
};

const radToDeg = (r: number) => (r * 180) / Math.PI;
const sq = (n: number) => Math.pow(n, 2);

/**
 * Working around the floating math rounding problems... maybe. https://www.jacklmoore.com/notes/rounding-in-javascript/
 * .toFixed(2) would return a string
 */
const round = (value: number, decimals = 2) => {
  return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
};
