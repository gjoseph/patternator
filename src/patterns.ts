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

  }

  abstract class Move {
    constructor(readonly initial: Initial) {
    }

    // supply next coordinates to Repetition
    abstract from(coords: Coords): Coords ;

    // TODO instead keep state here and have peek() and poll()
  }

  class Transposition extends Move {
    constructor(initial: Initial, readonly transposition: OptCoords) {
      super(initial);
    }

    // TODO split out builder/factories from logic/business methods?
    /**
     * Repeats this move the given number of times; 1 will simply execute the
     * operation at the initial coordinates.
     */
    times(count: number) {
      return new Repetition(this, count);
    }

    // supply next coordinates to Repetition
    from(coords: Coords): Coords {
      return {
        x: coords.x + (this.transposition.x || 0),
        y: coords.y + (this.transposition.y || 0)
      };
    }
  }

  class Grid extends Move {
    constructor(initial: Initial, readonly horizontalItems: number, readonly verticalItems: number, readonly gridSpacingX: number, readonly gridSpacingY: number) {
      super(initial);
    }

    from(coords: Coords): Coords {
      return { x: 0, y: 0 };
    }
  }

  class Repetition {
    private readonly initial: Initial;

    constructor(readonly move: Transposition, readonly repeats?: number) {
      this.initial = move.initial;
    }

    do(fun: (coords: Coords) => void): void {
      this.map(fun);
    }

    /**
     * Similar to do, but returns the results of `fun` for further processing
     */
    map<T>(fun: (coords: Coords) => T) {
      let coords = [this.initial.coords];
      // TODO if repeat <1, repeat until out of screen
      for (let i = 1; i < (this.repeats || 0); i++) {
        coords.push(this.move.from(coords[i - 1]));
      }
      return coords.map(fun);
    }
  }
}