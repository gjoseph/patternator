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
    constructor(readonly coords: Coords) {
    }

    // TODO split out builder/factories from logic/business methods?
    transposeBy(transposition: NumberOrFunctionOptCoords): FixedLengthRepetition {
      return new FixedLengthRepetition(Producers.transpose(this.coords, transposition));
    }

    onGrid(horizontalItems: number, verticalItems: number, gridSpacing: number, gridSpacingY?: number) {
      return this._onGrid(horizontalItems, verticalItems, gridSpacing, (gridSpacingY || gridSpacing));
    }

    onGridSize(horizontalItems: number, verticalItems: number, totalSize: Coords) {
      //TODO assert round numbers, or verify rounding?
      return this._onGrid(horizontalItems, verticalItems, totalSize.x / horizontalItems, totalSize.y / verticalItems);
    }

    private _onGrid(horizontalItems: number, verticalItems: number, gridSpacingX: number, gridSpacingY: number) {
      return new Grid(this, horizontalItems, verticalItems, gridSpacingX, gridSpacingY);
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
      this.currentCoords = this.nextCoords();
      this.currentIdx++;
      return this.currentCoords;
    }

    protected nextCoords() {
      return this.coordsProducer.next();
    }

  }

  class Grid extends FixedLengthRepetition {
    constructor(initial: Initial, readonly horizontalItems: number, readonly verticalItems: number,
                readonly gridSpacingX: number, readonly gridSpacingY: number) {
      super(Producers.transpose(initial.coords, {
        // this just produces a diagonal 🙄
        x: gridSpacingX, y: gridSpacingY
      }));
      this.times(horizontalItems * verticalItems);
    }
  }
}