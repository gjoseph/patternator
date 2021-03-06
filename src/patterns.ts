import {
  addCoords,
  Coords,
  NumberOrFunctionCoords,
  NumberOrFunctionOptCoords,
  unwrap,
} from "./coords";
import { Producer, Producers } from "./producers";
import { Polygon } from "./shapes/regular-polygons";

// TODO locations to be replaced by points on the enclosing shape
export const center = () => {
  throw Error("not implemented yet");
}; // TODO

// TODO locations to be replaced by points on the enclosing shape
export const zero = () => ({ x: 0, y: 0 });

export namespace Patterns {
  export const startAt = (coords: NumberOrFunctionCoords) => {
    return new Initial(unwrap(coords));
  };

  export class Initial {
    constructor(readonly initialCoords: Coords) {}

    // TODO split out builder/factories from logic/business methods?
    transposeBy(
      transposition: NumberOrFunctionOptCoords
    ): FixedLengthRepetition {
      return new FixedLengthRepetition(
        Producers.transpose(this.initialCoords, transposition)
      );
    }

    onPolygon(polygon: Polygon) {
      const values: Coords[] = Object.values(polygon.vertices).map((c) =>
        addCoords(c, this.initialCoords)
      );
      return new FixedLengthRepetition(Producers.listThenStop(values)).times(
        values.length
      );
    }
  }

  export abstract class Repetition {
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
    do<T>(fun: (coords: Coords) => T): void {
      this.map(fun);
    }
  }

  class FixedLengthRepetition extends Repetition {
    private repeats: number; // builder
    private currentIdx = 0; // state
    protected currentCoords: Coords | undefined = undefined; // state
    constructor(readonly coordsProducer: Producer<Coords>) {
      super();
      this.repeats = 1;
    }

    // TODO split out builder/factories from logic/business methods?
    /**
     * Repeats this move the given number of times; 1 will simply execute the
     * operation at the initial coordinates.
     */
    times(repeats: number) {
      // builder
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
  export class BoundedRepetition extends Repetition {
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
        throw new Error(
          "WTF currentCoords should never be null, did you forget to call hasNext() ?"
        );
      }
      this.preloadNextValue();
      return currentCoords;
    }

    /** pre-load next, so we can check in hasMore() */
    private preloadNextValue() {
      this.nextCoords = this.coordsProducer.next();
    }
  }

  /**
   * Based on https://math.stackexchange.com/questions/117164/calculate-coordinates-of-a-regular-polygon, thanks Google.
   */
  class PolygonProducer implements Producer<Coords> {
    /**
     * Not sure what this is called, but it's there
     */
    private readonly the_const: number;
    private i = 0;

    constructor(
      readonly start: Coords,
      readonly sides: number,
      readonly radius: number
    ) {
      this.the_const = (2 * Math.PI) / sides;
    }

    next(): Coords {
      const theta = this.the_const * this.i;
      this.i++;
      return addCoords(this.start, {
        x: this.radius * Math.sin(theta),
        y: this.radius * Math.cos(theta),
      });
    }
  }
}
