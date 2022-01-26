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
import { circle, makeStoryWithSnap } from "./stories-util";

export default {
  title: "Patternator/Shit Examples",
  args: {
    drawDebugHelp: false,
  },
} as Meta;

export const DiagonalOfLargeDots = makeStoryWithSnap((snap, args) => {
  Patterns.startAt({ x: 50, y: 50 })
    .transposeBy({ x: 50, y: 20 })
    .times(15)
    .do(circle(snap));
});

export const RandomlyLocatedCurveOfLargeDots = makeStoryWithSnap(
  (snap, args) => {
    Patterns.startAt({ x: Producers.rnd(200), y: Producers.rnd(200) })
      .transposeBy({ x: Producers.inc(3), y: Producers.dec(10) })
      .times(7)
      .do(circle(snap));
  }
);

export const TODONicerSyntaxForProducerBasedTransformers = makeStoryWithSnap(
  (s, args) => {
    // TODO: do the following with a nicer syntax and the producers:
    [0, 120, 240].map((a) => {
      s.polygon([40, 30, 60, 60, 20, 60])
        .attr({ stroke: "#3e7ed2" })
        .transform(`r${a},60,60`);
      // transform() supports 2 notations; r180 seems to be snap-specific and is always relative, whereas rotate() is the same as css and isn't relative?
    });
  }
);

export const LinesPatternsAreWack = makeStoryWithSnap((s, args) => {
  // TODO these could actually be nice if it was more controlled
  const MAX_X = 6000;
  const MAX_Y = 6000;

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

  Patterns.startAt({
    x: -500,
    y: 0,
  })
    .transposeBy({ x: 60 })
    .times(60)
    .do((c) =>
      s.line(c.x, c.y, c.x + 100, c.y + 2000).attr({ stroke: "#8d2" })
    );

  // lines(4, 3 , 60);
  // lines(5, 3 , 60);
  // no output, too flat?
  //   lines(6, 3 , 60);
  // lines(7, 3 , 60);
  // lines(8, 3 , 60);
  // lines(9, 3 , 60);
  // lines(10, 3 , 60);
});
