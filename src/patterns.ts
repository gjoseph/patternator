import { Producer, Producers } from "./producers";

// TODO most `number` arguments can be replaced by a NumberOrProducer
type NumberOrFunction = number | Producer<number>

export interface Coords {
  x: number,
  y: number
}

interface OptCoords {
  x?: number,
  y?: number
}

interface NumberOrFunctionCoords { // TODO what about Coords|Producer<Coords> ?
  x: NumberOrFunction,
  y: NumberOrFunction,
}

export interface NumberOrFunctionOptCoords {
  x?: NumberOrFunction,
  y?: NumberOrFunction,
}

const toNumber = (nof: NumberOrFunction): number => {
  if (typeof nof === "number") {
    return nof;
  } else {
    return nof.next();
  }
};

const unwrap = (nofCoords: NumberOrFunctionCoords): Coords => {
  return { x: toNumber(nofCoords.x), y: toNumber(nofCoords.y) };
};

export const unwrapOpt = (nofOptCoords: NumberOrFunctionOptCoords): Coords => {
  return { x: toNumber(nofOptCoords.x || 0), y: toNumber(nofOptCoords.y || 0) };
};

export const addCoords = (a: Coords, b: OptCoords): Coords => {
  return { x: a.x + (b.x || 0), y: a.y + (b.y || 0) };
};

export namespace Patterns {

  export const center = () => {
    throw Error("not implemented yet");
  }; // TODO

  export const start = () => startAt({ x: 0, y: 0 });
  export const startAt = (coords: NumberOrFunctionCoords) => {
    return new Initial(unwrap(coords));
  };

  export class Initial {
    constructor(readonly initialCoords: Coords) {
    }

    // TODO split out builder/factories from logic/business methods?
    transposeBy(transposition: NumberOrFunctionOptCoords): FixedLengthRepetition {
      return new FixedLengthRepetition(Producers.transpose(this.initialCoords, transposition));
    }

    onGrid(horizontalItems: number, verticalItems: number, gridSpacing: number, gridSpacingY: number = gridSpacing) {
      const oppositeCorner = addCoords(this.initialCoords, {
        x: (horizontalItems - 1) * gridSpacing,
        y: (verticalItems - 1) * gridSpacingY
      });
      return this.onGridCorners(oppositeCorner, gridSpacing, gridSpacingY);
    }

    onGridSize(horizontalItems: number, verticalItems: number, totalSize: Coords) {
      const oppositeCorner = addCoords(this.initialCoords, totalSize);
      // TODO do we actually need/want rounding here ?
      const gridSpacingX = Math.floor(totalSize.x / (horizontalItems - 1));
      const gridSpacingY = Math.floor(totalSize.y / (verticalItems - 1));
      return this.onGridCorners(oppositeCorner, gridSpacingX, gridSpacingY);
    }

    onGridCorners(oppositeCorner: Coords, gridSpacing: number, gridSpacingY: number = gridSpacing) {
      // console.debug("GRID: ", { initialCorner: this.initialCoords, oppositeCorner, gridSpacing, gridSpacingY });
      return new BoundedRepetition(Producers.grid(this.initialCoords, oppositeCorner, {
        x: gridSpacing,
        y: gridSpacingY
      }));
    }

    /**
     * Places points on vertices of a polygon of N sides.
     */
    onPolygon(sides: number, sideLength: number) {

    }

    /**
     * Equivalent to #onPolygon but places points on an enclosing circles; sides length unknown to user.
     */
    onCircle(repeats: number, diameter: number) {

    }
  }

  abstract class Repetition {
    abstract hasMore(): boolean;

    abstract poll(): Coords;

    /**
     * Executes the given function over each generated coordinates.
     * Similar to do, but returns the results of `fun` for further processing
     */
    map<T>(fun: (coords: Coords) => T) {
      let coords = [];
      while (this.hasMore()) {
        coords.push(this.poll());
      }
      return coords.map(fun);
    }

    /**
     * A more human-friendly name for map(); does not return the results of `fun`.
     */
    do = this.map;
  }

  class FixedLengthRepetition extends Repetition {
    private repeats: number = 1; // builder
    private currentIdx = 0; // state
    protected currentCoords: Coords | undefined = undefined; // state
    constructor(readonly coordsProducer: Producer<Coords>) {
      super();
    }

    // TODO split out builder/factories from logic/business methods?
    /**
     * Repeats this move the given number of times; 1 will simply execute the
     * operation at the initial coordinates.
     */
    times(repeats: number) {
      this.repeats = repeats;
      return this;
    }

    hasMore(): boolean {
      return this.currentIdx < this.repeats;
    }

    poll(): Coords {
      this.currentCoords = this.coordsProducer.next();
      this.currentIdx++;
      return this.currentCoords;
    }
  }

  /**
   * A repetition that stops when the Producers returns null or undefined (TODO pick a lane)
   */
  class BoundedRepetition extends Repetition {
    protected nextCoords: Coords | undefined = undefined; // state
    constructor(readonly coordsProducer: Producer<Coords | undefined>) {
      super();
      this.preloadNextValue();
    }

    hasMore(): boolean {
      return this.nextCoords !== undefined;
    }

    poll(): Coords {
      const currentCoords = this.nextCoords;
      if (currentCoords === undefined) {
        throw new Error("WTF currentCoords should never be null, did you forget to call hasNext() ?");
      }
      this.preloadNextValue();
      return currentCoords;
    }

    /** pre-load next, so we can check in hasMore() */
    private preloadNextValue() {
      this.nextCoords = this.coordsProducer.next();
    }
  }

}