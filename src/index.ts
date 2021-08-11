import * as Snap from "snapsvg";

const MAX_X=6000;
const MAX_Y=6000;
const s = Snap("svg");
s.attr({
    fill: "none",
    stroke: "#3d9",
    strokeWidth: 3
});

const lines = (px: number, py: number, dx: number = px) => {
    // Multiply by MAX_* == magic number to ensure we cross the boundary of the canvas -- which is really ensuring nothing if we don't do the math here
    px = px*2000;
    py = py*2000;
    for (var x = -px; -MAX_X < x && x < MAX_X; x+=dx) {
        s.line(x, 0, x + px, py);
    }
}

const grid = (dx: number, dy: number, init_x = 0, init_y = 0) => {
    for (var x = init_x; x < MAX_X; x+=dx) {
        for (var y = init_y; y < MAX_Y; y+=dy) {
            s.circle(x, y, 3);
        }
    }
}
s.rect(0,0,MAX_X, MAX_Y);

// lines(60, 80, 60);
// lines(3, 4, 60);
// lines(-3, 4, -60);
// lines(-7, 3, -60);
// lines(-6, 3, -60);
// lines(-5, 3, -60);
// lines(-4, 3, -60);
// lines(-3, 3, -60);
lines(-2, 3, -120);
lines(-1, 3, -60);
// lines(0, 3, 60);
lines(1, 3, 60);
lines(2, 3, 120);
// lines(4, 3 , 60);
// lines(5, 3 , 60);
// no output, too flat?
//   lines(6, 3 , 60);
// lines(7, 3 , 60);
// lines(8, 3 , 60);
// lines(9, 3 , 60);
// lines(10, 3 , 60);

// grid(120, 72, 0, 60);
// grid(120, 72, 60, 24);
