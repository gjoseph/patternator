import { Producer } from "./producers";

// TODO most `number` arguments can be replaced by a NumberOrProducer
type NumberOrFunction = number | Producer<number>;

export interface Coords {
  x: number;
  y: number;
}

interface OptCoords {
  x?: number;
  y?: number;
}

export interface NumberOrFunctionCoords {
  // TODO what about Coords|Producer<Coords> ?
  x: NumberOrFunction;
  y: NumberOrFunction;
}

export interface NumberOrFunctionOptCoords {
  x?: NumberOrFunction;
  y?: NumberOrFunction;
}

const toNumber = (nof: NumberOrFunction): number => {
  if (typeof nof === "number") {
    return nof;
  } else {
    return nof.next();
  }
};

export const unwrap = (nofCoords: NumberOrFunctionCoords): Coords => {
  return { x: toNumber(nofCoords.x), y: toNumber(nofCoords.y) };
};

export const unwrapOpt = (nofOptCoords: NumberOrFunctionOptCoords): Coords => {
  return { x: toNumber(nofOptCoords.x || 0), y: toNumber(nofOptCoords.y || 0) };
};

export const addCoords = (a: Coords, b: OptCoords): Coords => {
  return { x: a.x + (b.x || 0), y: a.y + (b.y || 0) };
};

// TODO move this and under under a namespace or module or whatever?
export const equalCoords = (
  a: NumberOrFunctionOptCoords,
  b: NumberOrFunctionOptCoords
): boolean => {
  const ua = unwrapOpt(a);
  const ub = unwrapOpt(b);
  return ua.x === ub.x && ua.y === ub.y;
};
