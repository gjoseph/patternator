import { Coords, Patterns } from "./patterns";
import startAt = Patterns.startAt;

const COLLECT = (c: Coords) => c;

describe("Transposing & repeating functions", () => {
  it("transposes on x-axis N times", () => {
    expect(
      startAt(50, 50).transposeBy({ x: 30 }).times(3).map(COLLECT)
    ).toEqual([{ x: 50, y: 50 }, { x: 80, y: 50 }, { x: 110, y: 50 }]);
  });
  it("transposes on y-axis N times", () => {
    expect(
      startAt(50, 50).transposeBy({ y: 6 }).times(5).map(COLLECT)
    ).toEqual([{ x: 50, y: 50 }, { x: 50, y: 56 }, { x: 50, y: 62 }, { x: 50, y: 68 }, { x: 50, y: 74 }]);
  });
  it("transposes on x- and y-axis N times", () => {
    expect(
      startAt(50, 50).transposeBy({ x: 5, y: 10 }).times(5).map(COLLECT)
    ).toEqual([{ x: 50, y: 50 }, { x: 55, y: 60 }, { x: 60, y: 70 }, { x: 65, y: 80 }, { x: 70, y: 90 }]);
  });

  it.skip("repeats in a grid spaced by same amount on both axis", () => {
    expect(
      startAt(2, 2).onGrid(3, 4, 10).map(COLLECT)
    ).toEqual([
      { x: 2, y: 2 }, { x: 12, y: 2 }, { x: 22, y: 2 },
      { x: 2, y: 12 }, { x: 12, y: 12 }, { x: 22, y: 12 },
      { x: 2, y: 22 }, { x: 12, y: 22 }, { x: 22, y: 22 },
      { x: 2, y: 32 }, { x: 12, y: 32 }, { x: 22, y: 32 }
    ]);
  });
  it.skip("repeats in a grid spaced differently per axis", () => {
    expect(
      startAt(2, 2).onGrid(3, 4, 5, 10).map(COLLECT)
    ).toEqual([
      { x: 2, y: 2 }, { x: 7, y: 2 }, { x: 12, y: 2 },
      { x: 2, y: 12 }, { x: 7, y: 12 }, { x: 12, y: 12 },
      { x: 2, y: 22 }, { x: 7, y: 22 }, { x: 12, y: 22 },
      { x: 2, y: 32 }, { x: 7, y: 32 }, { x: 12, y: 32 }
    ]);
  });
  it.skip("repeats in a grid based on total-size", () => {
    expect(
      startAt(0, 0).onGridSize(3, 4, { x: 30, y: 45 }).map(COLLECT)
    ).toEqual([
      { x: 0, y: 0 }, { x: 15, y: 0 }, { x: 30, y: 0 },
      { x: 0, y: 15 }, { x: 15, y: 15 }, { x: 30, y: 15 },
      { x: 0, y: 30 }, { x: 15, y: 30 }, { x: 30, y: 30 },
      { x: 0, y: 45 }, { x: 15, y: 45 }, { x: 30, y: 45 }
    ]);
  });

  it.todo("repeats on a polygon of S sides of length L")
  // startAt(0, 0).onPolygon(3, 30).map(COLLECT);

  it.todo("repeats N times on a circle of D diameter")
  // startAt(0, 0).onCircle(3, 30).map(COLLECT);
});
