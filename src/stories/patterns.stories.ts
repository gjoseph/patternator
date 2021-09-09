import { useEffect } from "@storybook/client-api";
import { Args, Meta, Story } from "@storybook/html";
import Snap from "snapsvg";
import { Coords } from "../coords";
import { Patterns } from "../patterns";
import { gridBuilder } from "../patterns/grids";
import { Polygons } from "../shapes/regular-polygons";
import { rangeControl } from "./stories-util";

export default {
  title: "Patternator/Patterns",
  args: {
    drawDebugHelp: false,
  },
} as Meta;

const dot =
  (radius = 1, color = "#444") =>
  (snap: Snap.Paper) =>
  (coords: Coords) => {
    snap.circle(coords.x, coords.y, radius).attr({
      fill: color,
      stroke: color,
    });
  };

const makeStory = (
  makePattern: (args: Args) => Patterns.Repetition,
  doOnPattern: (snap: Snap.Paper) => (coords: Coords) => void = dot(),
  drawDebug: (snap: Snap.Paper, args: Args) => void = () => {}
): Story => {
  return (args: Args) => {
    useEffect(() => {
      const pattern = makePattern(args);
      const snap = args.getSnap();
      const doFunction = doOnPattern(snap);
      pattern.do(doFunction);
      if (args.drawDebugHelp) {
        drawDebug(snap.attr({ stroke: "red" }), args);
      }
    }, [args]);

    // if void, storybook prints "undefined" -- which we could pbly address via the decorator, but if decorator
    // doesn't invoke story(), well, its useEffect is never invoked either.
    return "";
  };
};

export const GridUntil = makeStory(
  (args) =>
    gridBuilder({ x: args.initial.x, y: args.initial.y }).gridUntil(
      {
        x: args.opposite.x,
        y: args.opposite.y,
      },
      args.gridSpacingX,
      args.gridSpacingY
    ),
  dot(),
  (snap, args) =>
    snap.rect(args.initial.x, args.initial.y, args.opposite.x, args.opposite.y)
);
GridUntil.args = {
  initial: { x: 5, y: 5 },
  opposite: { x: 200, y: 200 },
  gridSpacingX: 30,
  gridSpacingY: 30,
};

export const GridByItemCount = makeStory((args) =>
  gridBuilder().grid(args.horizontalItems, args.verticalItems, args.gridSpacing)
);
GridByItemCount.args = {
  horizontalItems: 50,
  verticalItems: 50,
  gridSpacing: 50,
};
// Couldn't get an optional arg to work (storybook would hang/crash when clicking "set value"), so here goes a separate story
export const GridByItemCountWithYSpacing = makeStory((args) =>
  gridBuilder().grid(
    args.horizontalItems,
    args.verticalItems,
    args.gridSpacing,
    args.gridSpacingY
  )
);
GridByItemCountWithYSpacing.args = {
  ...GridByItemCount.args,
  gridSpacingY: 20,
};

/**
 * a grid where spacing is adjusted based on size and nr of items
 */
export const AutomaticSpacingGrid = makeStory(
  (args) =>
    gridBuilder().gridToFit(args.horizontalItems, args.verticalItems, {
      x: 500,
      y: 500,
    }),
  dot(),
  (snap) => snap.rect(0, 0, 500, 500)
);
AutomaticSpacingGrid.args = {
  horizontalItems: 50,
  verticalItems: 50,
};

// This is simply two grids super-imposed -- TODO CompositeRepetition
// const oppositeCorner = { x: 1500, y: 800 };
// export const AlternatingGrids =
// gridBuilder({ x: 0, y: 60 }).gridUntil(oppositeCorner, 120, 72).do(dot("red"));
// gridBuilder({ x: 60, y: 24 })
//   .gridUntil(oppositeCorner, 120, 72)
//   .do(dot("green"));

export const OnPolygonByOuterRadius = makeStory(
  (args) =>
    // TODO start in center?
    Patterns.startAt({ x: 300, y: 300 }).onPolygon(
      Polygons.byOuterRadius(args.sides, args.radius)
    ),
  dot(5, "#935"),
  (snap, args) => {
    snap.circle(300, 300, args.radius);
  }
);
OnPolygonByOuterRadius.args = { sides: 6, radius: 100 };
OnPolygonByOuterRadius.argTypes = {
  sides: rangeControl(3, 20),
  radius: rangeControl(300),
};
