import Snap, { rgb } from "snapsvg";
import { randomNumber } from "./misc";
import { Polygons } from "./shapes/regular-polygons";

const s = Snap("svg");
s.attr({
  fill: "none",
  stroke: "#3d9",
  __stroke: "#559",
  _stroke: "#955",
  strokeWidth: 3,
});

const randomColor = () => {
  const rgb1 = rgb(randomNumber(256), randomNumber(256), randomNumber(256));
  // console.log("rgb1:", rgb1);
  return rgb1.toString(); //.hex;
};

