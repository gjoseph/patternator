import { useEffect } from "@storybook/client-api";
import { Args, Meta, Story } from "@storybook/html";
import Snap from "snapsvg";
import { cone, cup, cylinder, DevelopedVolume } from "../volumes";

export default {
  title: "Patternator/Volumes",
  args: {
    debug: false,
  },
} as Meta;

const makeStory = (makeVolume: (args: Args) => DevelopedVolume<any>): Story => (args: Args) => {
  useEffect(() => {
    const dev = makeVolume(args);
    const snap = args.getSnap();
    const path = snap
      .path(dev.developed.pathSpec)
      .attr({ fill: "none", strokeWidth: 1, stroke: "#000" });
    const debug1 = args.debug ? debug(snap, dev, "#943") : [];
    snap.group(path, ...debug1).transform("t 200 50");
  }, [args]);

  // if void, storybook prints "undefined" -- which we could pbly address via the decorator, but if decorator
  // doesn't invoke story(), well, its useEffect is never invoked either.
  return "";
};

export const Cylinder = makeStory(args=> cylinder(100, 180));
export const Cone = makeStory(args=> cone(100, 180));
export const Cup = makeStory(args=> cup(60, 100, 150));

function debug(s:Snap.Paper, surface: DevelopedVolume<any>, txtClr: string) {
  return [
    s.text(-20, -20, surface.description).attr(textAttr),
    ...surface.poi.flatMap((poi) => {
      console.log("poi:", poi);
      return [
        s.circle(poi.x, poi.y, 5).attr({ stroke: "red" }),
        s
          .text(poi.x + 5, poi.y + 5, poi.description)
          .attr({ ...textAttr, fill: txtClr }),
      ];
    }),
  ];
}

const textAttr = {
  stroke: "none",
  fill: "#333",
  fontFamily: "Spot Mono",
  textAnchor: "left",
  alignmentBaseline: "hanging",
};
