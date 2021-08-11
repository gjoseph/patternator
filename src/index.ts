import Snap from "snapsvg";

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

interface Coords {
  x: number,
  y: number
}

interface OptCoords {
  x?: number,
  y?: number
}

class Initial {
  constructor(readonly coords: Coords) {
  }

  // TODO split out builder/factories from logic/business methods?
  transposeBy(transposition: OptCoords): Transposition {
    return new Transposition(this, transposition);
  }
}

class Transposition { // implements Move
  constructor(readonly initial: Initial, readonly transposition: OptCoords) {
  }

  // TODO split out builder/factories from logic/business methods?
  times(count: number) {
    return new Repetition(this, count);
  }

  // supply next coordinates to Repetition
  from(coords: Coords): Coords {
    return {
      x: coords.x + (this.transposition.x || 0),
      y: coords.y + (this.transposition.y || 0)
    };
  }
}

class Repetition {
  private readonly initial: Initial;

  constructor(readonly move: Transposition, readonly repeats?: number) {
    this.initial = move.initial;
  }

  do(fun: (coords: Coords) => void) {
    let coords = this.initial.coords;
    // TODO if repeat <1, repeat until out of screen
    for (let i = 0; i < (this.repeats||0); i++) {
      console.log("coords:", coords);
      fun(coords);
      coords = this.move.from(coords);
    }
  }

  /**
   * Similar to do, but returns the results of `fun` for further processing
   */
  map<T>(fun: (coords: Coords) => T) {
    // TODO
    const coords1 = this.move.initial.coords;
    return fun(coords1);
  }
}

const start = () => startAt(0, 0);
const startAt = (x: number, y: number) => {
  return new Initial({ x, y });
};

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
startAt(50, 50).transposeBy({ x: 50,y:20 }).times(5).do((coords: Coords) => {
  s.circle(coords.x, coords.y, 10).attr({
    fill: "#559",
    stroke: "#955",
    strokeWidth: 5
  });
});