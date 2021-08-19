import { Coords } from "../coords";

export interface Shape {
  // TODO are we ok for all shapes to _only_ be drawn via a pathSpec?
  // assume pathSpecs all "start" at 0,0?
  // TODO alt we could use polygon() with points (subset?)
  pathSpec: string;
  points: { [name: string]: Coords }
}