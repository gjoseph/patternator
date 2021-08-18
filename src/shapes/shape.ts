import { Coords } from "../coords";

export interface Shape {
  pathSpec: string;
  points: { [name: string]: Coords }
}