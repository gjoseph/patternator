import { useEffect } from "@storybook/client-api";
import { Meta } from "@storybook/html";
import Snap from "snapsvg";
import { Shape } from "../shapes/shape";
import { triangle } from "../shapes/triangles";

export default {
  title: "Patternator/Shapes",
  argTypes: {},
  decorators: [(story) => `<svg id="svgdeco"/><div>${story()}</div>`],
} as Meta;

// TODO
// -- avoid all the shenanigans to create Snap etc -- provide this stuff via shared config
// -- make the svg take all available space

const draw = (shape: Shape, s: Snap.Paper) => s.path(shape.pathSpec);

export const Triangle = () => {
  // move all this to a decorator? Including the html snippet?
  useEffect(() => {
    // const s = Snap(100,100);// actually this works too, so we don't really need an element...
    // could the decorator set this up for us instead?
    const s = Snap("#svgdeco");
    console.log("s:", s);
    s.attr({
      fill: "none",
      stroke: "#3d9",
      __stroke: "#559",
      _stroke: "#955",
      strokeWidth: 3,
    });
    s.rect(1, 1, 90, 90).attr({
      strokeWidth: 1,
      stroke: "red",
      shadow: "none",
    });
    s.rect(10, 10, 100, 100).attr({
      strokeWidth: 1,
      stroke: "black",
      shadow: "none",
    });
    s.circle(40, 40, 20).attr({ stroke: "#9821ed" });

    const tri = draw(triangle(100), s).transform("t 50 50");
  }, []);

  return ""; // if void, storybook prints "undefined" -- which we could pbly address via the decorator, but if decorator
  // doesn't invoke story(), well, its useEffect is never invoked either.
};

/*
// DRAW SHAPES -- somewhat redundant/duplicate with some of the patterns.ts/Producers code!!
const draw = (shape: Shape) => s.path(shape.pathSpec);

const tri = draw(triangle(100)).transform("t 100 100");
const box = tri.getBBox();
console.log("tri.getBBox():", box);
s.circle(box.cx, box.cy, box.r0).attr({ stroke: "#9821ed" });
s.circle(box.cx, box.cy, box.r1).attr({ stroke: "#234364" });
s.circle(box.cx, box.cy, box.r2).attr({ stroke: "#3d89ed" });
// stroke: "#9d6ee3"
//     stroke: "#3e7ed2"
// stroke: "#e7d390"

draw(rectangle(50, 50)).attr({ stroke: "#21c309" }).transform("t 400 400");
// draw(Polygons.byInnerRadius(6, 80))
//   .attr({ stroke: "#e7d390" })
//   .transform("t 200 200");
draw(Polygons.byOuterRadius(6, 80))
  .attr({ stroke: "#3e7ed2" })
  .transform("t 400 200");
draw(Polygons.byOuterRadius(4, 80))
  .attr({ stroke: "#3e7ed2" })
  .transform("t 400 200");
// draw(Polygons.bySideLength(6, 80)).attr({ stroke: "#9d6ee3" });
//   .transform("t 300 300");
*/
