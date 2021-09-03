import Snap, { rgb } from "snapsvg";
import { addCoords, Coords, equalCoords } from "./coords";
import { randomNumber } from "./misc";
import { Patterns } from "./patterns";
import { gridBuilder } from "./patterns/grids";
import { Producers } from "./producers";
import { Polygons } from "./shapes/regular-polygons";
import { triangle } from "./shapes/triangles";
import { cone, cup, cylinder, DevelopedVolume } from "./volumes";
import startAt = Patterns.startAt;
import dec = Producers.dec;
import inc = Producers.inc;
import rnd = Producers.rnd;

const MAX_X = 6000;
const MAX_Y = 6000;
const s = Snap("svg");
s.attr({
  fill: "none",
  stroke: "#3d9",
  __stroke: "#559",
  _stroke: "#955",
  strokeWidth: 3,
});

// Frame
s.rect(0, 0, MAX_X, MAX_Y);

const lines = (px: number, py: number, dx: number = px) => {
  // Multiply by MAX_* == magic number to ensure we cross the boundary of the canvas -- which is really ensuring nothing if we don't do the math here
  // whatever px meant, we augment it and create a bigger angle... i don't think it was meant to do be used this way...
  px = px * 2000;
  py = py * 2000;
  for (var x = -px; -MAX_X < x && x < MAX_X; x += dx) {
    s.line(x, 0, x + px, py);
  }
};

// lines(60, 80, 60);
// lines(3, 4, 60);
// lines(-3, 4, -60);
// lines(-7, 3, -60);
// lines(-6, 3, -60);
// lines(-5, 3, -60);
// lines(-4, 3, -60);
// lines(-3, 3, -60);
// lines(-2, 3, -120);
// lines(-1, 3, -60);
// lines(0, 3, 60);
// lines(0.5, 3, 60);
lines(1, 3, 60);
lines(2, 3, 60);
// lines(2, 3, 120);
// lines(2, 4, 120);

// TODO merge transposeBy() and times()?
// not sure there's many interesting use-cases for a set nr of repetitions, instead
// have automated repetitions that take the pattern out of screen (or better yet make it infinitely repeating over a cylinder)
startAt({
  x: -500,
  y: 0,
})
  .transposeBy({ x: 60 })
  .times(60)
  .do((c) => s.line(c.x, c.y, c.x + 100, c.y + 2000).attr({ stroke: "#8d2" }));
const p1 = s.polygon(["103.324,10 135.324,32 236.676,32 204.676,20 "]);
p1.attr({
  fill: "#888",
  stroke: "#432",
});
s.polygon([203.324, 10, 235.324, 32, 336.676, 32, 304.676, 20]).attr({
  stroke: "#393",
});

// lines(4, 3 , 60);
// lines(5, 3 , 60);
// no output, too flat?
//   lines(6, 3 , 60);
// lines(7, 3 , 60);
// lines(8, 3 , 60);
// lines(9, 3 , 60);
// lines(10, 3 , 60);

const dot =
  (color: string = "#444") =>
  (coords: Coords) => {
    s.circle(coords.x, coords.y, 1).attr({
      fill: color,
      stroke: "none",
    });
  };

const sqr =
  (color: string = "#444") =>
  (coords: Coords) =>
    s
      .rect(coords.x - 2, coords.y - 2, 4, 4)
      .attr({ fill: color, stroke: "none" });

const circle =
  (stroke = "#933", fill = "none") =>
  (coords: Coords) => {
    s.circle(coords.x, coords.y, 5).attr({
      fill: fill,
      stroke: stroke,
      strokeWidth: 2,
    });
  };

const circleBlackOr =
  (startPos: Coords, defaultColor: string) => (c: Coords) => {
    const color = equalCoords(c, startPos) ? "black" : defaultColor;
    circle(color)(c);
  };

const text = (text: string) => (c: Coords) => {
  s.text(c.x, c.y, text).attr({
    stroke: "none",
    fill: "#333",
    textAnchor: "middle",
    alignmentBaseline: "hanging",
  });
};

const randomColor = () => {
  const rgb1 = rgb(randomNumber(256), randomNumber(256), randomNumber(256));
  // console.log("rgb1:", rgb1);
  return rgb1.toString(); //.hex;
};

// a diagonal of large dots
startAt({ x: 50, y: 50 })
  .transposeBy({ x: 50, y: 20 })
  .times(15)
  .do(circle("#339", "#77c"));

// a random-ish curve of large dots
startAt({ x: rnd(200), y: rnd(200) })
  .transposeBy({ x: inc(3), y: dec(10) })
  .times(7)
  .do(circle("#933", "#99c"));

// a small grid of dots
gridBuilder({ x: 5, y: 0 }).gridUntil({ x: 500, y: 500 }, 120, 72).do(dot());
gridBuilder().grid(50, 50, 10).do(dot());

// alternating grids
const oppositeCorner = { x: 1500, y: 800 };
gridBuilder({ x: 0, y: 60 }).gridUntil(oppositeCorner, 120, 72).do(dot("red"));
gridBuilder({ x: 60, y: 24 })
  .gridUntil(oppositeCorner, 120, 72)
  .do(dot("green"));

// a grid where spacing is adjusted based on size and nr of items
s.rect(0, 0, 1000, 600).attr({ stroke: "#000", strokeWidth: 4 });
gridBuilder().gridToFit(10, 10, { x: 1000, y: 600 }).do(dot());

// Polygons
s.circle(100, 100, 80);
startAt({ x: 100, y: 100 })
  .onPolygon(Polygons.byOuterRadius(3, 160))
  .do(circleBlackOr({ x: 105, y: 180 }, "#393"));
startAt({ x: 300, y: 200 })
  .onPolygon(Polygons.byOuterRadius(8, 100))
  .do(circleBlackOr({ x: 300, y: 250 }, "#935"));
startAt({ x: 105, y: 300 })
  .onPolygon(Polygons.byOuterRadius(5, 200))
  .do(circleBlackOr({ x: 105, y: 400 }, "#359"));
startAt({ x: 300, y: 200 })
  .onPolygon(Polygons.byOuterRadius(9, 100))
  .do(circleBlackOr({ x: 300, y: 250 }, "pink"));

startAt({ x: 400, y: 100 })
  .onPolygon(Polygons.byOuterRadius(20, 100))
  .do(circle("#a39032"));

s.circle(400, 400, 80);
startAt({ x: 400, y: 400 })
  .onPolygon(Polygons.byOuterRadius(4, 160))
  .do(circleBlackOr({ x: 105, y: 180 }, "#393"));

const textAttr = {
  stroke: "none",
  fill: "#333",
  fontFamily: "Spot Mono",
  textAnchor: "left",
  alignmentBaseline: "hanging",
};

function debug(surface: DevelopedVolume<any>, txtClr: string) {
  return [
    s.text(-20, -20, surface.description).attr(textAttr),
    ...surface.poi.flatMap((poi) => {
      console.log("poi:", poi);
      return [
        s.circle(poi.x, poi.y, 5).attr({ stroke: "red" }),
        s
          .text(poi.x + 5, poi.y + 5, poi.description)
          .attr({ ...textAttr, fill: txtClr }),
      ];
    }),
  ];
}

function develop(dev: DevelopedVolume<any>) {
  return s.path(dev.developed.pathSpec);
}

const cyl = cylinder(100, 180);
s.group(
  develop(cyl).attr({ stroke: "#934", strokeWidth: 4 }),
  ...debug(cyl, "#934")
).transform("t100,100");

const cone1 = cone(100, 180);
s.group(
  develop(cone1).attr({ stroke: "#39d", strokeWidth: 4 }),
  ...debug(cone1, "#39d")
).transform("t200,350");

const cup1 = cup(60, 100, 150);
s.group(
  develop(cup1).attr({ stroke: "#393", strokeWidth: 4 }),
  ...debug(cup1, "#393")
).transform("t500,250");

// TODO: do the following with a nicer syntax and the producers:
[0, 120, 240].map((a) => {
  s.polygon([40, 30, 60, 60, 20, 60])
    .attr({ stroke: "#3e7ed2" })
    .transform(`r${a},60,60`);
});

// transform() supports 2 notations; r180 seems to be snap-specific and is always relative, whereas rotate() is the same as css and isn't relative?
s.polygon([40, 30, 60, 60, 20, 60]).transform(`r180`);
s.polygon([240, 230, 260, 260, 220, 260]).transform(`rotate(180 200 200 )`);
s.polygon([240, 230, 260, 260, 220, 260]).transform(`rotate(1turn )`);

// grid + native polygon:
// gridBuilder()
//   .grid(8, 8, 40, 40)
//   .do((c) => {
//     s.polygon([c.x + 40, c.y + 30, c.x + 50, c.y + 60, c.x + 30, c.y + 60])
//       .attr({ stroke: "#4d9d9f" })
//       .clone()
//       .transform("r180 t-20 3");
//   });

// grid + shape + transforms
// TODO: nicer syntax, don't muck about with .transform and injection of coordinates
// instead the "repeater" could have methods to rotate, etc and optionally a more freeform delegate to trnasform()
gridBuilder()
  .grid(8, 8, 60, 87)
  .do((c) => {
    s.path(triangle(40, 80, 80).pathSpec)
      .attr({ stroke: "#8d3d4d" })
      .transform(`T${c.x} ${c.y}`)
      .clone()
      // .transform("r180 t-30 0").transform(`T${c.x -30} ${c.y}`)
      .transform(`r180 T${c.x - 30} ${c.y}`);
  });

s.path(triangle(40, 80, 80).pathSpec)
  .attr({ stroke: "#8d3d4d" })
  // .transform(`T${c.x} ${c.y}`)
  .clone()
  .transform("r180 t-30 0");
// .transform(`T${c.x -30} ${c.y}`)
// .transform(`r180 T${c.x - 30} ${c.y}`);

// TODO: INNER OUTER STROKES --> MOVE THIS TO UTILITY
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

// startAt({ x: 0, y: -40 }).gridUntil(oppositeCorner, 60, 80).do(placeThingo);
// startAt({ x: -30, y: 0 }).gridUntil(oppositeCorner, 60, 80).do(placeThingo);
// END NICE QBERT PATTERN

// =============== Grid on hex ===============
const polygonAround = (sides: number) => (center: Coords) =>
  Polygons.byOuterRadius(sides, 100).vertices.map((c) =>
    // See Producers.transpose
    addCoords(c, center)
  );

const hexAround = () => polygonAround(6);

polygonAround(5)({ x: 410, y: 370 })
  .flatMap(polygonAround(5))
  .flatMap(polygonAround(5))
  .flatMap(polygonAround(5))
  .map(sqr());

s.rect(408, 368, 4, 4).attr({ fill: "green", stroke: "none" });
s.rect(10, 10, 820, 730).attr({ fill: "none", stroke: "green" });
