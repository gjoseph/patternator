import { Coords } from "../coords";

export interface Shape {
  // TODO are we ok for all shapes to _only_ be drawn via a pathSpec?
  // assume pathSpecs all "start" at 0,0?
  // TODO alt we could use polygon() with points (subset?)
  // TODO yeah pathSpecs and points does seem redundant! Mark certain points as "part of the shape"
  // especially since shapes don't fully "close" eventhough finishing with L0,0 :susp:
  pathSpec: string;
  points: { [name: string]: Coords }
}