/**
 * Produces values used in functions/patterns. Most usages will only ever generate
 * numbers, but this is typed so it can be used to produce e.g. strings (colors),
 * or e.g. other functions for complex patterns.
 *
 * Couldn't call this Generator because lib.es2015.generator
 */
import {
  addCoords,
  Coords,
  NumberOrFunctionOptCoords,
  unwrapOpt,
} from "./patterns";

export interface Producer<T> {
  next(): T;
}

export namespace Producers {
  // List-based producers
  export const ring = <T>(values: T[]) => new Ring(values);
  export const yoyo = <T>(values: T[]) => new Yoyo(values, false);
  export const upThenDown = <T>(values: T[]) => new Yoyo(values, true);
  export const randomOrder = <T>(values: T[]) => new RandomOrder(values);

  // Number Producers
  export const inc = (seed: number, step = 1) =>
    new FuncProducer(seed, (n) => n + step);
  export const dec = (seed: number, step = 1) =>
    new FuncProducer(seed, (n) => n - step);
  export const fun = (seed: number, fun: (n: number) => number) =>
    new FuncProducer(seed, fun);
  /** Produces a random number between 0 and max included (I dunno it feels more human to include max, this isn't for nerds) */
  export const rnd = (max: number) => new RandomProducer(max);

  // Coords Producers
  export const transpose = (seed: Coords, step: NumberOrFunctionOptCoords) =>
    new FuncProducer(seed, (prev) => addCoords(prev, unwrapOpt(step)));
  export const grid = (first: Coords, opposite: Coords, spacing: Coords) =>
    gridProducer(first, opposite, spacing);
}

const randomNumber = (max: number) => Math.floor(Math.random() * max);

class Ring<T> implements Producer<T> {
  private i = -1;

  constructor(readonly values: T[]) {}

  next(): T {
    this.i = (this.i + 1) % this.values.length;
    return this.values[this.i];
  }
}

class Yoyo<T> implements Producer<T> {
  private i = 0;
  private forward = true;
  private stalling = true;

  constructor(readonly values: T[], readonly repeatEnds: boolean) {}

  next(): T {
    // Surely, there is math-ier way to implement this
    if (this.forward && !this.stalling) {
      this.i++;
    } else if (!this.stalling) {
      this.i--;
    }
    // could do forward=!forward except for the first iteration where i=0 and we need to go fwd
    if (this.i == this.values.length - 1) {
      // end
      if (this.repeatEnds && !this.stalling) {
        this.stalling = true;
      } else {
        this.forward = false;
        this.stalling = false;
      }
    } else if (this.i == 0) {
      // start
      if (this.repeatEnds && !this.stalling) {
        this.stalling = true;
      } else {
        this.forward = true;
        this.stalling = false;
      }
    }
    return this.values[this.i];
  }
}

class RandomOrder<T> implements Producer<T> {
  constructor(readonly values: T[]) {}

  next(): T {
    return this.values[randomNumber(this.values.length)];
  }
}

/**
 * A producer which gets its next value through a function, and uses it to seed the next call and so on.
 */
class FuncProducer<T> implements Producer<T> {
  private val: T | undefined;

  constructor(readonly seed: T, readonly fun: (previous: T) => T) {
    this.val = undefined;
  }

  next(): T {
    // Only call the function after the initial seed value has been used
    if (this.val === undefined) {
      this.val = this.seed;
    } else {
      this.val = this.fun(this.val);
    }
    return this.val;
  }
}

const gridProducer = (
  firstCorner: Coords,
  oppositeCorner: Coords,
  gridSpacing: Coords
) =>
  new FuncProducer<Coords | undefined>(firstCorner, (prev) => {
    if (prev === undefined) {
      throw new Error("Should never be called if previous value was undefined");
    }
    const next = addCoords(prev, { x: gridSpacing.x, y: 0 });
    if (next.x > oppositeCorner.x) {
      next.x = firstCorner.x;
      next.y = next.y + gridSpacing.y;
    }
    if (next.y > oppositeCorner.y) {
      // STOP!
      return undefined;
    }
    return next;
  });

class RandomProducer implements Producer<number> {
  constructor(readonly max: number) {}

  next(): number {
    return randomNumber(this.max + 1);
  }
}
