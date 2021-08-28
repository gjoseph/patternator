import { Coords } from "../coords";
import { gridBuilder } from "./grids";

const COLLECT = (c: Coords) => c;

// prettier-ignore
describe("Transposing & repeating functions", () => {

  it("repeats in a grid bounded by opposite corners, spaced by same amount on both axis", () => {
    expect(
      gridBuilder({ x: 2, y: 2 }).gridUntil({ x: 25, y: 35 }, 10).map(COLLECT)
    ).toEqual([
      { x: 2, y: 2 }, { x: 12, y: 2 }, { x: 22, y: 2 },
      { x: 2, y: 12 }, { x: 12, y: 12 }, { x: 22, y: 12 },
      { x: 2, y: 22 }, { x: 12, y: 22 }, { x: 22, y: 22 },
      { x: 2, y: 32 }, { x: 12, y: 32 }, { x: 22, y: 32 }
    ]);
  });
  it("repeats in a grid bounded by opposite corners, spaced differently per axis", () => {
    expect(
      gridBuilder({ x: 2, y: 2 }).gridUntil({ x: 15, y: 35 }, 5, 10).map(COLLECT)
    ).toEqual([
      { x: 2, y: 2 }, { x: 7, y: 2 }, { x: 12, y: 2 },
      { x: 2, y: 12 }, { x: 7, y: 12 }, { x: 12, y: 12 },
      { x: 2, y: 22 }, { x: 7, y: 22 }, { x: 12, y: 22 },
      { x: 2, y: 32 }, { x: 7, y: 32 }, { x: 12, y: 32 }
    ]);
  });

  it("repeats in a grid of H/V elements, spaced by same amount on both axis", () => {
    expect(
      gridBuilder({ x: 2, y: 2 }).grid(3, 4, 10).map(COLLECT)
    ).toEqual([
      { x: 2, y: 2 }, { x: 12, y: 2 }, { x: 22, y: 2 },
      { x: 2, y: 12 }, { x: 12, y: 12 }, { x: 22, y: 12 },
      { x: 2, y: 22 }, { x: 12, y: 22 }, { x: 22, y: 22 },
      { x: 2, y: 32 }, { x: 12, y: 32 }, { x: 22, y: 32 }
    ]);
  });

  it("repeats in a grid of H/V elements, spaced differently per axis", () => {
    expect(
      gridBuilder({ x: 2, y: 2 }).grid(3, 4, 5, 10).map(COLLECT)
    ).toEqual([
      { x: 2, y: 2 }, { x: 7, y: 2 }, { x: 12, y: 2 },
      { x: 2, y: 12 }, { x: 7, y: 12 }, { x: 12, y: 12 },
      { x: 2, y: 22 }, { x: 7, y: 22 }, { x: 12, y: 22 },
      { x: 2, y: 32 }, { x: 7, y: 32 }, { x: 12, y: 32 }
    ]);
  });

  it("repeats in a grid of H/V elements, spaced depending on total-size", () => {
    expect(
      gridBuilder().gridToFit(3, 4, { x: 30, y: 45 }).map(COLLECT)
    ).toEqual([
      { x: 0, y: 0 }, { x: 15, y: 0 }, { x: 30, y: 0 },
      { x: 0, y: 15 }, { x: 15, y: 15 }, { x: 30, y: 15 },
      { x: 0, y: 30 }, { x: 15, y: 30 }, { x: 30, y: 30 },
      { x: 0, y: 45 }, { x: 15, y: 45 }, { x: 30, y: 45 }
    ]);
  });

  it("repeats in a grid of H/V elements, spaced depending on total-size, where total-size isn't divisible by H/V", () => {
    expect(
      gridBuilder().gridToFit(3, 4, { x: 31, y: 46 }).map(COLLECT)
    ).toEqual([
      { x: 0, y: 0 }, { x: 15, y: 0 }, { x: 30, y: 0 },
      { x: 0, y: 15 }, { x: 15, y: 15 }, { x: 30, y: 15 },
      { x: 0, y: 30 }, { x: 15, y: 30 }, { x: 30, y: 30 },
      { x: 0, y: 45 }, { x: 15, y: 45 }, { x: 30, y: 45 }
    ]);
  });
});
