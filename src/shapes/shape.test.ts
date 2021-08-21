import { toPathSpec } from "./shape";
import { triangle } from "./triangles";

describe("Shape utility methods", () => {
  it("toPathSpec doesn't mutate passed array", () => {
    const arr = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
    ];
    expect(toPathSpec(arr)).toEqual("M0 0 L10 0 L10 10 L0 0");
    expect(arr).toStrictEqual([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
    ]);
  });
});
