import { useEffect } from "@storybook/client-api";
import { Args, Story } from "@storybook/html";
import Snap from "snapsvg";

export const angleControl = {
  control: { type: "range", min: 0, max: 360, step: 1 },
};

/**
 * If end isn't specified, assume start is 0 and end is the 1st param
 */
export const rangeControl = (min: number, max?: number, step = 1) => {
  if (max === undefined) [max, min] = [min, 0];
  return {
    control: { type: "range", min, max, step },
  };
};

/**
 * Also see .storybook/preview.js for how SnapSVG is setup.
 * @param drawOnSnap draws the main object of the story on the Snap paper; return an object of any type that will be fed into the debug function
 * @param drawDebug draws "debug" information about the main object returned by the previous function
 */
export const makeStoryWithSnap = <T> (
  drawOnSnap: (snap: Snap.Paper, args: Args) => T,
  drawDebug: (mainDrawing: T, snap: Snap.Paper, args: Args) => void = () => {}
): Story => {
  return (args: Args) => {
    useEffect(() => {
      const snap = args.getSnap();
      const main = drawOnSnap(snap, args);
      if (args.drawDebugHelp) {
        drawDebug(main, snap.attr({ stroke: "red" }), args);
      }
    }, [args]);

    // if void, storybook prints "undefined" -- which we could pbly address via the decorator, but if decorator
    // doesn't invoke story(), well, its useEffect is never invoked either.
    return "";
  };
};
