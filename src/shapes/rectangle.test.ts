import { rectangle } from "./rectangle";

describe("Rectangles", () => {
  it("simple rectangle", () => {
    expect(rectangle(40, 20)).toEqual({
      points: {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 40, y: 0 },
        bottomLeft: { x: 0, y: 20 },
        bottomRight: { x: 40, y: 20 },
      },
      pathSpec: "M0 0 L40 0 L40 20 L0 20 L0 0",
    });
  });
  it("oblong rectangle", () => {
    expect(rectangle(10, 20)).toEqual({
      points: {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 10, y: 0 },
        bottomLeft: { x: 0, y: 20 },
        bottomRight: { x: 10, y: 20 },
      },
      pathSpec: "M0 0 L10 0 L10 20 L0 20 L0 0",
    });
  });
  it("square", () => {
    expect(rectangle(20, 20)).toEqual({
      points: {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 20, y: 0 },
        bottomLeft: { x: 0, y: 20 },
        bottomRight: { x: 20, y: 20 },
      },
      pathSpec: "M0 0 L20 0 L20 20 L0 20 L0 0",
    });
  });
});
