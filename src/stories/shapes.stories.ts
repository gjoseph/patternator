import { useEffect } from "@storybook/client-api";
import { Meta } from "@storybook/html";
import Snap from "snapsvg";
import { annulusSector } from "../shapes/annulus";
import { rectangle } from "../shapes/rectangle";
import { Polygons } from "../shapes/regular-polygons";
import { Shape } from "../shapes/shape";
import { triangle } from "../shapes/triangles";

export default {
  title: "Patternator/Shapes",
  decorators: [(story) => `<svg id="svgdeco"/><div>${story()}</div>`],
} as Meta;

// TODO
// -- avoid all the shenanigans to create Snap etc -- provide this stuff via shared config
// -- make the svg take all available space

const draw = (shape: Shape, s: Snap.Paper) => s.path(shape.pathSpec);

const makeStory = (makeShape: (args) => Shape) => (args) => {
  // move all this to a decorator? Including the html snippet?
  useEffect(() => {
    // const s = Snap(100,100);// actually this works too, so we don't really need an element...
    // could the decorator set this up for us instead?
    const s = Snap("#svgdeco");
    draw(makeShape(args), s)
      .attr({ fill: "none", strokeWidth: 1, stroke: "#000" })
      .transform("t 50 50");
  }, [args]);

  return ""; // if void, storybook prints "undefined" -- which we could pbly address via the decorator, but if decorator
  // doesn't invoke story(), well, its useEffect is never invoked either.
};

export const Rectangle = makeStory(() => rectangle(50, 80));
export const SquareUsingRectangle = makeStory(() => rectangle(50, 50));
export const EquilateralTriangle = makeStory(() => triangle(100));
export const RightAngleTriangle = makeStory(() => triangle(100, 50));
export const IsoscelesTriangle = makeStory(() => triangle(50, 100, 100));
export const EquilateralTriangleUsingPolygonShape = makeStory(() =>
  Polygons.byOuterRadius(3, 50)
);
export const SquareUsingPolygonShape = makeStory(() =>
  Polygons.byOuterRadius(4, 50)
);
export const Pentagon = makeStory(() => Polygons.byOuterRadius(5, 50));
export const Hexagon = makeStory(() => Polygons.byOuterRadius(6, 50));
export const ParametricPolygon = makeStory((args) =>
  Polygons.byOuterRadius(args.sides, 50)
);
ParametricPolygon.args = { sides: 4 };
ParametricPolygon.argTypes = {
  sides: {
    control: { type: "range", min: 3, max: 50, step: 1 },
  },
};
export const AnnulusSector = makeStory((args) =>
  annulusSector(args.angle, 80, 40)
);
AnnulusSector.args = { angle: 60 };
AnnulusSector.argTypes = {
  angle: {
    control: { type: "range", min: 0, max: 360, step: 1 },
  },
};
