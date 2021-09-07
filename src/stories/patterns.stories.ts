import { useEffect } from "@storybook/client-api";
import { Args, Meta, Story } from "@storybook/html";
import Snap from "snapsvg";
import { Coords } from "../coords";
import { Patterns } from "../patterns";
import { gridBuilder } from "../patterns/grids";

export default {
  title: "Patternator/Patterns",
} as Meta;

const dot = (snap: Snap.Paper) => (coords: Coords) => {
  snap.circle(coords.x, coords.y, 1).attr({
    fill: "#444",
    stroke: "none",
  });
};

const makeStory =
  (makePattern: (args: Args) => Patterns.Repetition): Story =>
  (args: Args) => {
    useEffect(() => {
      const pattern = makePattern(args);
      const dotFunction = dot(args.getSnap());
      pattern.do(dotFunction);
    }, [args]);

    // if void, storybook prints "undefined" -- which we could pbly address via the decorator, but if decorator
    // doesn't invoke story(), well, its useEffect is never invoked either.
    return "";
  };

// TODO use args for coordinates and spacing
export const SimpleGrid = makeStory(() =>
  gridBuilder({ x: 5, y: 5 }).gridUntil({ x: 500, y: 500 }, 30, 30)
);

export const GridByItemCount = makeStory(() => gridBuilder().grid(50, 50, 10));

/**
 * a grid where spacing is adjusted based on size and nr of items
 */
export const AutomaticSpacingGrid = makeStory(() =>
  gridBuilder().gridToFit(10, 10, { x: 500, y: 500 })
);

// This is simply two grids super-imposed -- TODO CompositeRepetition
// const oppositeCorner = { x: 1500, y: 800 };
// export const AlternatingGrids =
// gridBuilder({ x: 0, y: 60 }).gridUntil(oppositeCorner, 120, 72).do(dot("red"));
// gridBuilder({ x: 60, y: 24 })
//   .gridUntil(oppositeCorner, 120, 72)
//   .do(dot("green"));
