import { useEffect } from "@storybook/client-api";
import { Args, Meta, Story } from "@storybook/html";
import Snap from "snapsvg";
import { cone, cup, cylinder, DevelopedVolume } from "../volumes";

export default {
  title: "Patternator/Volumes",
  args: {
    drawDebugHelp: false,
  },
} as Meta;

const makeStory =
  (makeVolume: (args: Args) => DevelopedVolume<any>): Story =>
  (args: Args) => {
    useEffect(() => {
      const dev = makeVolume(args);
      const snap = args.getSnap();
      const path = snap.path(dev.developed.pathSpec);
      const debug = drawDebug(args.drawDebugHelp, snap, dev);
      snap.group(path, debug).transform("t 200 50");
    }, [args]);

    // if void, storybook prints "undefined" -- which we could pbly address via the decorator, but if decorator
    // doesn't invoke story(), well, its useEffect is never invoked either.
    return "";
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
  textAnchor: "left",
  alignmentBaseline: "hanging",
};
const redText = { ...textAttr, fill: "#943" };
const redStroke = { stroke: "red" };
