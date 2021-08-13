import Snap from "snapsvg";
import { Coords, Patterns } from "./patterns";
import { Producers } from "./producers";
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
  strokeWidth: 3
});

const lines = (px: number, py: number, dx: number = px) => {
  // Multiply by MAX_* == magic number to ensure we cross the boundary of the canvas -- which is really ensuring nothing if we don't do the math here
  px = px * 2000;
  py = py * 2000;
  for (var x = -px; -MAX_X < x && x < MAX_X; x += dx) {
    s.line(x, 0, x + px, py);
  }
};

const grid = (dx: number, dy: number, init_x = 0, init_y = 0) => {
  for (var x = init_x; x < MAX_X; x += dx) {
    for (var y = init_y; y < MAX_Y; y += dy) {
      s.circle(x, y, 3);
    }
  }
};
s.rect(0, 0, MAX_X, MAX_Y);

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

grid(120, 72, 0, 60);
grid(120, 72, 60, 24);

function dot(coords: Coords) {
  console.log("dot -- coords:", coords);
  s.circle(coords.x, coords.y, 2).attr({
    fill: "#444",
    stroke: "#333",
    strokeWidth: 1
  });
}

function drawCircle(coords: Coords) {
  s.circle(coords.x, coords.y, 10).attr({
    fill: "#99c",
    stroke: "#933",
    strokeWidth: 2
  });
}

startAt({ x: 50, y: 50 }).transposeBy({ x: 50, y: 20 }).times(15).do(drawCircle);

startAt({ x: rnd(200), y: rnd(200) })
  .transposeBy({ x: inc(3), y: dec(10) })
  .times(7)
  .do(drawCircle);

// transposes, grids, polygons etc, can just be Producer<Coord> implementations and map to do()
// ... so we need some producers that _end_, or do we just keep using times()
// onGrid with times() makes no sense, since the grid has a finite nr of points, so times() should only be available
// on unbounded generators
startAt({ x: 5, y: 0 })
  .onGrid(20, 20, 120, 72)
  .times(50)
  .do(dot);
