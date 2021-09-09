import { useEffect } from "@storybook/client-api";
import { Args, Meta } from "@storybook/html";
import Snap from "snapsvg";

export default {
  title: "SelfCheck",
} as Meta;

export const ViewboxText = (args: Args) => {
  const fill = { fill: "#666", stroke: "#000" };
  useEffect(() => {
    const snap: Snap.Paper = args.getSnap();
    const viewBox = snap.attr("viewBox");
    console.log("viewBox:", viewBox);
    snap.rect(0, 0, 6, 6).attr(fill);
    snap.rect(viewBox.width - 6, 0, 6, 6).attr(fill);
    snap.rect(viewBox.width - 6, viewBox.height - 6, 6, 6).attr(fill);
    snap.rect(0, viewBox.height - 6, 6, 6).attr(fill);
    snap.rect(viewBox.cx - 3, viewBox.cy - 3, 6, 6).attr(fill);
    snap.rect(0, 0, viewBox.width, viewBox.height);
  }, [args]);

  return "";
};
