import { range, round } from "./misc";

describe("rounding", () => {
  it("basic rounding", () => {
    expect(round(0)).toStrictEqual(0);
    expect(round(1)).toStrictEqual(1);
    expect(round(1.2)).toStrictEqual(1.2);
    expect(round(1.23)).toStrictEqual(1.23);
    expect(round(1.23456)).toStrictEqual(1.23);
  });

  it("1.005 rounds correctly", () => {
    expect(round(1.0051)).toStrictEqual(1.01);
    expect(round(1.0049)).toStrictEqual(1);
    expect(round(1.005, 3)).toStrictEqual(1.005);
    // This is the case https://www.jacklmoore.com/notes/rounding-in-javascript/ claims is wrong
    // .. but is is really?
    // expect(round(1.005)).toStrictEqual(1.01)
    // ... i think it actually makes sense to round to 1
    expect(round(1.005)).toStrictEqual(1);
    expect(round(1.0050001)).toStrictEqual(1.01);
  });

  it("6.123233995736766e-15 rounds up correctly", () => {
    expect(round(6.123233995736766e-15)).toStrictEqual(0);
  });
});

describe("range", () => {
  it("range with both params", () => {
    const r = range(1, 6);
    expect([...r]).toStrictEqual([1, 2, 3, 4, 5]);
  });
  it("range with step", () => {
    const r = range(1, 12, 3);
    expect([...r]).toStrictEqual([1, 4, 7, 10]);
  });
  it("range with step where end would match...but should still be excluded", () => {
    const r = range(1, 13, 3);
    expect([...r]).toStrictEqual([1, 4, 7, 10]);
  });
  it("single param assumes start at 0", () => {
    const r = range(5);
    expect([...r]).toStrictEqual([0, 1, 2, 3, 4]);
  });
  it("single param 0 should assume 0...0, i.e empty array", () => {
    const r = range(0);
    expect([...r]).toStrictEqual([]);
  });
  it("explicit 0 to 0 should be empty array", () => {
    const r = range(0, 0);
    expect([...r]).toStrictEqual([]);
  });
});
