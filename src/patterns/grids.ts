import { addCoords, Coords } from "../coords";
import { Patterns } from "../patterns";
import { Producers } from "../producers";
import zero = Patterns.zero;

export const gridBuilder = (initialCoords: Coords = zero()) =>
  new GridBuilder(initialCoords);

class GridBuilder {
  constructor(readonly initialCoords: Coords) {}

  grid(
    horizontalItems: number,
    verticalItems: number,
    gridSpacing: number,
    gridSpacingY: number = gridSpacing
  ) {
    const oppositeCorner = addCoords(this.initialCoords, {
      x: (horizontalItems - 1) * gridSpacing,
      y: (verticalItems - 1) * gridSpacingY,
    });
    return this.gridUntil(oppositeCorner, gridSpacing, gridSpacingY);
  }

  gridToFit(horizontalItems: number, verticalItems: number, totalSize: Coords) {
    const oppositeCorner = addCoords(this.initialCoords, totalSize);
    // TODO do we actually need/want rounding here ?
    const gridSpacingX = Math.floor(totalSize.x / (horizontalItems - 1));
    const gridSpacingY = Math.floor(totalSize.y / (verticalItems - 1));
    return this.gridUntil(oppositeCorner, gridSpacingX, gridSpacingY);
  }

  gridUntil(
    oppositeCorner: Coords,
    gridSpacing: number,
    gridSpacingY: number = gridSpacing
  ): Patterns.Repetition {
    // console.debug("GRID: ", { initialCorner: this.initialCoords, oppositeCorner, gridSpacing, gridSpacingY });
    return new Patterns.BoundedRepetition(
      Producers.grid(this.initialCoords, oppositeCorner, {
        x: gridSpacing,
        y: gridSpacingY,
      })
    );
  }
}
