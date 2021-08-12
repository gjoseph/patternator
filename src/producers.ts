/**
 * Produces values used in functions/patterns. Most usages will only ever generate
 * numbers, but this is typed so it can be used to produce e.g. strings (colors),
 * or e.g. other functions for complex patterns.
 *
 * Couldn't call this Generator because lib.es2015.generator
 */
export interface Producer<T> {
  next(): T;
}

export namespace Producers {
  export const ring = <T>(values: T[]) => new Ring(values);
  export const yoyo = <T>(values: T[]) => new Yoyo(values, false);
  export const upThenDown = <T>(values: T[]) => new Yoyo(values, true);
  export const randomOrder = <T>(values: T[]) => new RandomOrder(values);

  export const inc = (seed: number) => new FunctionBasedProducer(seed, (n: number) => n + 1);
  export const dec = (seed: number) => new FunctionBasedProducer(seed, (n: number) => n - 1);
  export const fun = (seed: number, fun: (n: number) => number) => new FunctionBasedProducer(seed, fun);
  /** Produces a random number between 0 and max included (I dunno it feels more human to include max, this isn't for nerds) */
  export const rnd = (max: number) => new RandomProducer(max);
}

const randomNumber = (max: number) => Math.floor(Math.random() * max);

class Ring<T> implements Producer<T> {
  private i = -1;

  constructor(readonly values: T[]) {
  }

  next(): T {
    this.i = (this.i + 1) % this.values.length;
    return this.values[this.i];
  }
}

class Yoyo<T> implements Producer<T> {
  private i = 0;
  private forward = true;
  private stalling = true;

  constructor(readonly values: T[], readonly repeatEnds: boolean) {
  }

  next(): T {
    // Surely, there is math-ier way to implement this
    if (this.forward && !this.stalling) {
      this.i++;
    } else if (!this.stalling) {
      this.i--;
    }
    // could do forward=!forward except for the first iteration where i=0 and we need to go fwd
    if (this.i == this.values.length - 1) { // end
      if (this.repeatEnds && !this.stalling) {
        this.stalling = true;
      } else {
        this.forward = false;
        this.stalling = false;
      }
    } else if (this.i == 0) { // start
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
  constructor(readonly values: T[]) {
  }

  next(): T {
    return this.values[randomNumber(this.values.length)];
  }

}

/**
 * A producer which gets its next value through a function, and uses it to see the next call and so on.
 */
class FunctionBasedProducer implements Producer<number> {
  private val: number | undefined;

  constructor(readonly seed: number, readonly fun: (n: number) => number) {
    this.val = undefined;
  }

  next(): number {
    // Only call the function after the initial seed value has been used
    if (this.val === undefined) {
      this.val = this.seed;
    } else {
      this.val = this.fun(this.val);
    }
    return this.val;
  }

}

class RandomProducer implements Producer<number> {
  constructor(readonly max: number) {
  }

  next(): number {
    return randomNumber(this.max + 1);
  }

}
