export interface Coords {
  x: number,
  y: number
}

interface OptCoords {
  x?: number,
  y?: number
}

export namespace Patterns {
  export const start = () => startAt(0, 0);
  export const startAt = (x: number, y: number) => {
    return new Initial({ x, y });
  };

  export class Initial {
    constructor(readonly coords: Coords) {
    }

    // TODO split out builder/factories from logic/business methods?
    transposeBy(transposition: OptCoords): Transposition {
      return new Transposition(this, transposition);
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
    constructor(readonly initial: Initial) {
    }

    // supply next coordinates to Repetition
    // TODO instead keep state here and have peek() and poll()
    // abstract from(coords: Coords): Coords ;
    abstract hasMore(): boolean ;

    abstract poll(): Coords ;

    do(fun: (coords: Coords) => void): void {
      this.map(fun);
    }

    /**
     * Similar to do, but returns the results of `fun` for further processing
     */
    map<T>(fun: (coords: Coords) => T) {
      let coords = [];
      while (this.hasMore()) {
        coords.push(this.poll());
      }
      // let coords = [this.initial.coords];
      // // TODO if repeat <1, repeat until out of screen
      // for (let i = 1; i < (this.repeats || 0); i++) {
      //   coords.push(this.from(coords[i - 1]));
      // }
      return coords.map(fun);
    }
  }

  class Transposition extends Repetition {
    private repeats: number = 0; // builder
    private currentIdx = 0; // state
    private currentCoords: Coords | undefined = undefined; // state
    constructor(initial: Initial, readonly transposition: OptCoords) {
      super(initial);
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
      if (!this.currentCoords) {
        this.currentCoords = this.initial.coords;
      } else {
        this.currentCoords = {
          x: this.currentCoords.x + (this.transposition.x || 0),
          y: this.currentCoords.y + (this.transposition.y || 0)
        };
      }
      this.currentIdx++;
      return this.currentCoords;
    }

    // let coords = [this.initial.coords];
    // // TODO if repeat <1, repeat until out of screen
    // for (let i = 1; i < (this.repeats || 0); i++) {
    //   coords.push(this.from(coords[i - 1]));
    // }
  }

  class Grid extends Repetition {
    constructor(initial: Initial, readonly horizontalItems: number, readonly verticalItems: number, readonly gridSpacingX: number, readonly gridSpacingY: number) {
      super(initial);
    }

    from(coords: Coords): Coords {
      return { x: 0, y: 0 };
    }

    hasMore(): boolean {
      return false;
    }

    poll(): Coords {
      return { x: 0, y: 0 };
    }
  }

}