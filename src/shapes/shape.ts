import { Coords } from "../coords";

export interface Shape {
  // TODO are we ok for all shapes to _only_ be drawn via a pathSpec?
  // assume pathSpecs all "start" at 0,0?
  // TODO alt we could use polygon() with points (subset?)
  // TODO yeah pathSpecs and points does seem redundant! Mark certain points as "part of the shape"
  // especially since shapes don't fully "close" eventhough finishing with L0,0 :susp:
  // well, wouldn't work for AnnulusSector since it's not straightlines duh
  pathSpec: string;
  points: { [name: string]: Coords };
}

export const toPathSpec = (coords: Coords[]): string => {
  return (
    coords
      // Add first coord as last so we close the shape
      .concat(coords[0])
      // Move to first coord, then draw lines to all others
      .map((c, i) => (i === 0 ? "M" : "L") + c.x + " " + c.y)
      .join(" ")
  );
};
