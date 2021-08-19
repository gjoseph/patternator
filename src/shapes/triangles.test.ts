import { triangle } from "./triangles";

describe("Triangles", () => {
  it("equilateral triangle", () => {
    expect(triangle(10)).toMatchObject({
      sides: {
        a: 10,
        b: 10,
        c: 10,
      },
      angles: { ab: 60, ac: 60, bc: 60 },
      // points: {} TODO
      // pathStr: {} TODO
    });
  });
  it("right angle triangle has a 90 angles", () => {
    expect(triangle(3, 4)).toMatchObject({
      sides: {
        a: 3,
        b: 4,
        c: 5,
      },
      angles: { ab: 90, ac: 53.13, bc: 36.87 },
      // points: {} TODO
      // pathStr: {} TODO
    });
  });
});