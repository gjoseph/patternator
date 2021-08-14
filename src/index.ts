import Snap from "snapsvg";
import { Coords, Patterns } from "./patterns";
import { Producers } from "./producers";
import start = Patterns.start;
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
    s.circle(coords.x, coords.y, 2).attr({
      fill: color,
      stroke: "none",
    });
  };

const circle = (coords: Coords) => {
  s.circle(coords.x, coords.y, 10).attr({
    fill: "#99c",
    stroke: "#933",
    strokeWidth: 2,
  });
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
startAt({ x: 50, y: 50 }).transposeBy({ x: 50, y: 20 }).times(15).do(circle);

// a random-ish curve of large dots
startAt({ x: rnd(200), y: rnd(200) })
  .transposeBy({ x: inc(3), y: dec(10) })
  .times(7)
  .do(circle);

// a small grid of dots
// startAt({ x: 5, y: 0 }).onGridCorners({ x: 500, y: 500 }, 120, 72).do(dot());

// alternate grids
const oppositeCorner = { x: MAX_X, y: MAX_Y };
startAt({ x: 0, y: 60 }).gridUntil(oppositeCorner, 120, 72).do(dot("red"));
startAt({ x: 60, y: 24 }).gridUntil(oppositeCorner, 120, 72).do(dot("green"));

// a grid where spacing is adjusted based on size and nr of items
s.rect(0, 0, 1000, 600).attr({ stroke: "#000", strokeWidth: 4 });
start().gridToFit(4, 3, { x: 1000, y: 600 }).do(text("Hi!"));
