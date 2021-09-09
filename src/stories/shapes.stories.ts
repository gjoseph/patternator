import { useEffect } from "@storybook/client-api";
import { Args, Meta, Story } from "@storybook/html";
import { annulusSector } from "../shapes/annulus";
import { rectangle } from "../shapes/rectangle";
import { Polygons } from "../shapes/regular-polygons";
import { Shape } from "../shapes/shape";
import { triangle } from "../shapes/triangles";
import { angleControl, rangeControl } from "./stories-util";

export default {
  title: "Patternator/Shapes",
} as Meta;

const makeStory =
  (makeShape: (args: Args) => Shape): Story =>
  (args: Args) => {
    useEffect(() => {
      const shape = makeShape(args);
      args
        .getSnap()
        .path(shape.pathSpec)
        .attr({ fill: "none", strokeWidth: 1, stroke: "#000" })
        .transform("t 50 50");
    }, [args]);

    // if void, storybook prints "undefined" -- which we could pbly address via the decorator, but if decorator
    // doesn't invoke story(), well, its useEffect is never invoked either.
    return "";
  };

export const Rectangle = makeStory(() => rectangle(50, 80));
export const SquareUsingRectangle = makeStory(() => rectangle(50, 50));
export const EquilateralTriangle = makeStory(() => triangle(100));
export const RightAngleTriangle = makeStory(() => triangle(100, 50));
export const IsoscelesTriangle = makeStory(() => triangle(50, 100, 100));
export const RegularPolygon = makeStory((args) =>
  Polygons.byOuterRadius(args.sides, 50)
);
RegularPolygon.args = { sides: 6 };
RegularPolygon.argTypes = {
  sides: rangeControl(3, 50),
};
export const AnnulusSector = makeStory((args) =>
  annulusSector(args.angle, 80, 40)
);
AnnulusSector.args = { angle: 60 };
AnnulusSector.argTypes = {
  angle: angleControl,
};
