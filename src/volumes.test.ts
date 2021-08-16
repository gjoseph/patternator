import { cone, cup } from "./volumes";

describe("Cones can be developed", () => {
  it("simple cone developed to disc sector", () => {
    const devCone = cone(20, 20);
    expect(devCone.developed.angle).toBeCloseTo(160.996, 2);
    expect(devCone.developed.innerRadius).toEqual(0);
    expect(devCone.developed.outerRadius).toBeCloseTo(22.3607, 2);
  });
});

describe("Cups (frustums, a.k.a truncated cones) can be developed", () => {
  it("simple cup, modelled as a frustum, developed to annulus", () => {
    const devCup = cup(20, 24, 30);
    expect(devCup.developed.angle).toBeCloseTo(23.946, 2);
    expect(devCup.developed.innerRadius).toBeCloseTo(150.333, 2);
    expect(devCup.developed.outerRadius).toBeCloseTo(180.399, 2);
  });
});
