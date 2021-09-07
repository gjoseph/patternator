import { Coords, isInside } from "./coords";

describe("is inside utility method", () => {
  const TL = { x: 10, y: 10 };
  const BR = { x: 200, y: 200 };
  it("basic positive tests", () => {
    expect(isInside({ x: 50, y: 50 }, TL, BR)).toEqual(true);
    expect(isInside({ x: 50, y: 20 }, TL, BR)).toEqual(true);
    expect(isInside({ x: 199, y: 11 }, TL, BR)).toEqual(true);
    expect(isInside({ x: 199, y: 199 }, TL, BR)).toEqual(true);
  });
  it("basic negative tests", () => {
    expect(isInside({ x: 1, y: 1 }, TL, BR)).toEqual(false);
    expect(isInside({ x: 0, y: 0 }, TL, BR)).toEqual(false);
    expect(isInside({ x: 201, y: 201 }, TL, BR)).toEqual(false);
    expect(isInside({ x: 50, y: 201 }, TL, BR)).toEqual(false);
    expect(isInside({ x: 201, y: 50 }, TL, BR)).toEqual(false);
  });
  it("boundary is positive", () => {
    expect(isInside({ x: 10, y: 10 }, TL, BR)).toEqual(true);
    expect(isInside({ x: 10, y: 0 }, TL, BR)).toEqual(false);
    expect(isInside({ x: 0, y: 10 }, TL, BR)).toEqual(false);

    expect(isInside({ x: 200, y: 200 }, TL, BR)).toEqual(true);
    expect(isInside({ x: 201, y: 200 }, TL, BR)).toEqual(false);
    expect(isInside({ x: 200, y: 201 }, TL, BR)).toEqual(false);
  });
  it("negative coordinates are fine", () => {
    expect(isInside({ x: -10, y: -10 }, TL, BR)).toEqual(false);
    expect(isInside({ x: 0, y: 0 }, { x: -10, y: -10 }, BR)).toEqual(true);
    expect(isInside({ x: -4, y: -4 }, { x: -10, y: -10 }, BR)).toEqual(true);
  });
  it("corners are validated, errors thrown if inverted", () => {
    expect(() =>
      isInside({ x: 50, y: 50 }, { x: 100, y: 100 }, { x: 10, y: 10 })
    ).toThrowError();
    expect(() =>
      isInside({ x: 50, y: 50 }, { x: 100, y: 100 }, { x: 200, y: 10 })
    ).toThrowError();
    expect(() =>
      isInside({ x: 50, y: 50 }, { x: 100, y: 100 }, { x: 10, y: 200 })
    ).toThrowError();
  });
  it("corners are validated, should be at least 1 unit long and large", () => {
    expect(() =>
      isInside({ x: 50, y: 50 }, { x: 50, y: 50 }, { x: 50, y: 50 })
    ).toThrowError();
    expect(() =>
      isInside({ x: 50, y: 50 }, { x: 50, y: 50 }, { x: 100, y: 50 })
    ).toThrowError();
    expect(() =>
      isInside({ x: 50, y: 50 }, { x: 50, y: 50 }, { x: 50, y: 100 })
    ).toThrowError();
  });
});
