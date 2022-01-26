import { Meta } from "@storybook/html";
import Snap, { rgb } from "snapsvg";
import { Coords } from "../coords";
import { randomNumber } from "../misc";
import { Patterns } from "../patterns";
import { gridBuilder } from "../patterns/grids";
import { overlappingHexBuilder } from "../patterns/hexes";
import { Producers } from "../producers";
import { Polygons } from "../shapes/regular-polygons";
import { triangle } from "../shapes/triangles";
import { makeStoryWithSnap, randomColor } from "./stories-util";

export default {
  title: "Patternator/Examples",
  args: {
    drawDebugHelp: false,
  },
} as Meta;

export const GridWithNativePolygons = makeStoryWithSnap((s, args) => {
  gridBuilder()
    .grid(8, 8, 40, 40)
    .do((c) => {
      s.polygon([c.x + 40, c.y + 30, c.x + 50, c.y + 60, c.x + 30, c.y + 60])
        .attr({ stroke: "#4d9d9f" })
        .clone()
        .transform("r180 t-20 3");
    });
});
export const GridOfTriangles = makeStoryWithSnap((s, args) => {
  // TODO: nicer syntax, don't muck about with .transform and injection of coordinates
  // instead the "repeater" could have methods to rotate, etc and optionally a more freeform delegate to transform()
  gridBuilder()
    .grid(8, 8, 60, 87)
    .do((c) => {
      s.path(triangle(40, 80, 80).pathSpec)
        .attr({ stroke: "#8d3d4d" })
        .transform(`T${c.x} ${c.y}`)
        .clone()
        .transform(`r180 T${c.x - 30} ${c.y}`);
    });
});

export const QBertCubes = makeStoryWithSnap((s, args) => {
  // TODO: INNER OUTER STROKES --> MOVE THIS TO UTILITY
  // TODO: ROMBUS shape --> move to class
  // https://alexwlchan.net/2021/03/inner-outer-strokes-svg/
  const tm = s.polygon([0, 20, 30, 0, 60, 20, 30, 40]).toDefs();
  const bl = s.polygon([0, 20, 30, 40, 30, 60, 0, 40]).toDefs();
  const br = s.polygon([30, 40, 60, 20, 60, 40, 30, 60]).toDefs();
  const thingo = s
    .group(
      (s.use(tm) as Snap.Element)
        .attr({ clipPath: tm, strokeWidth: 6, stroke: "#777" })
        .toDefs(),
      (s.use(bl) as Snap.Element)
        .attr({ clipPath: bl, strokeWidth: 6, stroke: "#444" })
        .toDefs(),
      (s.use(br) as Snap.Element)
        .attr({ clipPath: br, strokeWidth: 6, stroke: "#555" })
        .toDefs()
    )
    .toDefs();
  const placeThingo = (c: Coords) =>
    (s.use(thingo) as Snap.Element).transform(`T${c.x} ${c.y}`);

  const viewBox = s.attr("viewBox");
  const oppositeCorner = { x: viewBox.width, y: viewBox.height };

  gridBuilder({ x: 0, y: -40 })
    .gridUntil(oppositeCorner, 60, 80)
    .do(placeThingo);
  gridBuilder({ x: -30, y: 0 })
    .gridUntil(oppositeCorner, 60, 80)
    .do(placeThingo);
});

export const OverlappingHexesGrid = makeStoryWithSnap((s, args) => {
  overlappingHexBuilder()
    .hexesUntil({ x: 400, y: 400 }, 50)
    .do((c) => {
      s.path(Polygons.byOuterRadius(6, 50).pathSpec)
        .attr({ fill: "none", stroke: "black", strokeWidth: 1 })
        .transform(`T${c.x} ${c.y}`);
    });
});

export const HalfSizeHexesGridRandomColor = makeStoryWithSnap((s, args) => {
  overlappingHexBuilder()
    .hexesUntil({ x: 400, y: 400 }, 50)
    .do((c) => {
      s.path(Polygons.byOuterRadius(6, 25).pathSpec)
        .attr({ fill: randomColor(), stroke: "none", strokeWidth: 1 })
        .transform(`T${c.x} ${c.y}`);
    });
});
