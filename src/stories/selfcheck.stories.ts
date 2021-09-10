import { useEffect } from "@storybook/client-api";
import { Args, Meta } from "@storybook/html";
import Snap from "snapsvg";

export default {
  title: "SelfCheck",
} as Meta;

export const ViewboxText = (args: Args) => {
  useEffect(() => {
    const snap: Snap.Paper = args.getSnap();
    const viewBox = snap.attr("viewBox");
    console.log("viewBox:", viewBox);
    coordTxt(snap, 0, 0, "left", "top");
    coordTxt(snap, viewBox.width, 0, "right", "top");
    coordTxt(snap, viewBox.width, viewBox.height, "right", "bottom");
    coordTxt(snap, 0, viewBox.height, "left", "bottom");
    snap.rect(viewBox.cx - 3, viewBox.cy - 3, 6, 6).attr(fill);
    snap.rect(0, 0, viewBox.width, viewBox.height);
  }, [args]);

  return "";
};

const coordTxt = (
  snap: Snap.Paper,
  x: number,
  y: number,
  halign: "left" | "right",
  valign: "top" | "bottom"
) => {
  const textX = halign === "left" ? x + 6 : x - 6;
  const boxX = halign === "left" ? x : x - 6;
  const textY = valign === "top" ? y + 6 : y - 6;
  const boxY = valign === "top" ? y : y - 6;
  snap.rect(boxX, boxY, 6, 6).attr(fill);
  snap.text(textX, textY, `(${x},${y})`).attr(textAttr(halign, valign));
};
const fill = { fill: "#666", stroke: "#000" };
const textAttr = (halign: "left" | "right", valign: "top" | "bottom") => {
  return {
    stroke: "none",
    fill: "#333",
    fontFamily: "Spot Mono",
    textAnchor: halign === "left" ? "start" : "end",
    alignmentBaseline: valign === "top" ? "hanging" : "auto", // can't say i really understand the nuances here
  };
};
