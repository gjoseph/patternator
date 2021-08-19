import Snap from "snapsvg";
import { Coords, equalCoords } from "./coords";
import { Patterns } from "./patterns";
import { Producers } from "./producers";
import { rectangle } from "./shapes/rectangle";
import { triangle } from "./shapes/triangles";
import { cone, cup, cylinder, DevelopedVolume } from "./volumes";
import startAt = Patterns.startAt;
import start = Patterns.start;
import inc = Producers.inc;
import rnd = Producers.rnd;
import dec = Producers.dec;

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
// // lines(0, 3, 60);
// lines(1, 3, 60);
// lines(2, 3, 120);
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
startAt({ x: 5, y: 0 }).gridUntil({ x: 500, y: 500 }, 120, 72).do(dot());
start().grid(50, 50, 10).do(dot());

// alternating grids
const oppositeCorner = { x: MAX_X, y: MAX_Y };
startAt({ x: 0, y: 60 }).gridUntil(oppositeCorner, 120, 72).do(dot("red"));
startAt({ x: 60, y: 24 }).gridUntil(oppositeCorner, 120, 72).do(dot("green"));

// a grid where spacing is adjusted based on size and nr of items
s.rect(0, 0, 1000, 600).attr({ stroke: "#000", strokeWidth: 4 });
start().gridToFit(10, 10, { x: 1000, y: 600 }).do(dot());

// Polygons
s.circle(100, 100, 80);
startAt({ x: 100, y: 100 })
  .onCircle(3, 160)
  .do(circleBlackOr({ x: 105, y: 180 }, "#393"));
startAt({ x: 300, y: 200 })
  .onCircle(8, 100)
  .do(circleBlackOr({ x: 300, y: 250 }, "#935"));
startAt({ x: 105, y: 300 })
  .onCircle(5, 200)
  .do(circleBlackOr({ x: 105, y: 400 }, "#359"));
startAt({ x: 300, y: 200 })
  .onCircle(9, 100)
  .do(circleBlackOr({ x: 300, y: 250 }, "pink"));

startAt({ x: 400, y: 100 }).onCircle(20, 100).do(circle("#a39032"));

s.circle(400, 400, 80);
startAt({ x: 400, y: 400 })
  .onCircle(4, 160)
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

// Shapes:
s.path(rectangle(30, 40).pathSpec).transform("t 100 100")
s.path(triangle(100, 140).pathSpec).transform("t 200 200")
