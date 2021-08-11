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

  it.todo("repeats in a grid spaced by same amount on both axis")//, () => {
    // startAt(2,2).onGrid(3,4,10)//.map(COLLECT)
  // });

  it.todo("repeats in a grid spaced differently per axis")//, () => {
    // startAt(2, 2).onGrid(3, 4, 5, 10);//.map(COLLECT)
  // });

});
