import { Args, Meta, Story } from "@storybook/html";
import Snap from "snapsvg";
import { Coords } from "../coords";
import { Patterns } from "../patterns";
import { dot, makeStoryWithSnap } from "./stories-util";
import { herringbone } from "../patterns/herringbone";

export default {
  title: "Patternator/HerringBone",
  args: {
    drawDebugHelp: false
  }
} as Meta;

export const HerringBoneSimple = makeStoryWithSnap((snap, args) => {
    const pattern = ((args) =>
      herringbone({ x: args.initial.x, y: args.initial.y }, args.brickWidth, args.brickLength).until(
        {
          x: args.opposite.x,
          y: args.opposite.y
        }
      ))(args);
    pattern.do(dot(snap));
    return pattern;
  }, (pattern, snap, args) =>
    snap.rect(args.initial.x, args.initial.y, args.opposite.x, args.opposite.y)
);
HerringBoneSimple.args = {
  initial: { x: 5, y: 5 },
  opposite: { x: 200, y: 200 },
  brickWidth: 40,
  brickLength: 10
};