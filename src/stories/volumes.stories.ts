import { Args, Meta, Story } from "@storybook/html";
import Snap from "snapsvg";
import { cone, cup, cylinder, DevelopedVolume } from "../volumes";
import { makeStoryWithSnap } from "./stories-util";

export default {
  title: "Patternator/Volumes",
  args: {
    drawDebugHelp: false,
  },
} as Meta;

const makeStory = (makeVolume: (args: Args) => DevelopedVolume<any>): Story => {
  return makeStoryWithSnap(
    (snap, args) => {
      const dev = makeVolume(args);
      snap.path(dev.developed.pathSpec).transform("t 200 50");
      return dev;
    },
    (dev, snap, args) => {
      drawDebug(args.drawDebugHelp, snap, dev).transform("t 200 50");
    }
  );
};

export const Cylinder = makeStory((args) => cylinder(100, 180));
export const Cone = makeStory((args) => cone(100, 180));
export const Cup = makeStory((args) => cup(60, 100, 150));

function drawDebug(
  actuallyDebug: boolean,
  s: Snap.Paper,
  surface: DevelopedVolume<any>
) {
  if (!actuallyDebug) {
    // return an empty group, i.e do nothing
    return s.group();
  }
  return s.group(
    s.text(-20, -20, surface.description).attr(textAttr),
    ...surface.poi.flatMap((poi) => {
      return [
        s.circle(poi.x, poi.y, 5).attr(redStroke),
        s.text(poi.x + 5, poi.y + 5, poi.description).attr(redText),
      ];
    })
  );
}

const textAttr = {
  stroke: "none",
  fill: "#333",
  fontFamily: "Spot Mono",
  textAnchor: "start",
  alignmentBaseline: "hanging",
};
const redText = { ...textAttr, fill: "#943" };
const redStroke = { stroke: "red" };
