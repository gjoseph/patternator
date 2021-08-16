import { DescribedCoord } from "./coords";
import { ConeFrustum } from "./volumes/cone-frustum";
import { Cylinder } from "./volumes/cylinder";

export const cylinder = (diameter: number, height: number) =>
  new Cylinder(diameter, height);

export const cone = (diameter: number, height: number) =>
  new ConeFrustum(0, diameter, height);

/**
 * a.k.a tapered cylinder, portion of a cone, frustum.
 *
 * ```
 *     ___ <- diameterTop
 * h->|\_/<- not height
 *      ⬆️ diameterBottom
 * ```
 * @param height the perpendicular height of the cup, not along its side (slant height)
 * @param diameterBottom expected to be smaller than diameterTop, i.e to be the truncated side of the cone
 */
export const cup = (
  diameterBottom: number,
  diameterTop: number,
  height: number
) => new ConeFrustum(diameterBottom, diameterTop, height);

// bowls really are portions of spheres mostly?
export const bowl = {
  inside: {}, // SpherePortion
  outside: {}, // SpherePortion
};

/**
 * The construction of 3-D models from [clay and/or stencils] requires some mathematical and geometrical application.
 * Starting with simple 3-D forms, we can calculate the shape of the flat 2-D object needed to make it.
 * The flat shape is known as a DEVELOPMENT.
 *
 * I hate to use Instructables as a source but...
 * https://www.instructables.com/Development-Pattern-Construction/
 */
export interface DevelopedVolume {
  // TODO return instead, don't actually draw, if that's possible?
  developOn(paper: Snap.Paper): Snap.Element;

  /**
   * Points of Interest, relative to 0,0 of the paper we're drawing this on,
   * if we're sticking the surface to the top-left-est position possible.
   */
  poi: DescribedCoord[];

  description: string;
}
