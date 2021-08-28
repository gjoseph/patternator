import { Coords } from "./coords";
import { Patterns } from "./patterns";
import startAt = Patterns.startAt;

const COLLECT = (c: Coords) => c;
const START = startAt({ x: 50, y: 50 });

// prettier-ignore
describe("Transposing & repeating functions", () => {
  it("transposes on x-axis N times", () => {
    expect(
      START.transposeBy({ x: 30 }).times(3).map(COLLECT)
    ).toEqual([{ x: 50, y: 50 }, { x: 80, y: 50 }, { x: 110, y: 50 }]);
  });
  it("transposes on y-axis N times", () => {
    expect(
      START.transposeBy({ y: 6 }).times(5).map(COLLECT)
    ).toEqual([{ x: 50, y: 50 }, { x: 50, y: 56 }, { x: 50, y: 62 }, { x: 50, y: 68 }, { x: 50, y: 74 }]);
  });
  it("transposes on x- and y-axis N times", () => {
    expect(
      START.transposeBy({ x: 5, y: 10 }).times(5).map(COLLECT)
    ).toEqual([{ x: 50, y: 50 }, { x: 55, y: 60 }, { x: 60, y: 70 }, { x: 65, y: 80 }, { x: 70, y: 90 }]);
  });


  it.todo("repeats on a polygon of S sides of length L");
  // startAt(0, 0).onPolygon(3, 30).map(COLLECT);

  it.todo("repeats N times on a circle of D diameter");
  // startAt(0, 0).onCircle(3, 30).map(COLLECT);
});
