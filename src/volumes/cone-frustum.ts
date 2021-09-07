import { desc, DescribedCoord } from "../coords";
import { annulusSector, AnnulusSector } from "../shapes/annulus";
import { DevelopedVolume } from "../volumes";

/**
 * Cone or truncated cone.
 */
export class ConeFrustum implements DevelopedVolume<AnnulusSector> {
  private readonly slantHeight: number;
  readonly developed: AnnulusSector;
  readonly poi: DescribedCoord[]; // TODO type these like AnnulusSector
  readonly description: string;

  constructor(
    readonly truncDiameter: number, // diameter at truncation  _ (0 for a full cone)
    readonly baseDiameter: number, // base of the cone       /__\
    readonly height: number
  ) {
    // TODO assert baseDiameter is > truncDiameter

    // Based on https://planetcalc.com/3831/
    const baseRadius = baseDiameter / 2; // r2
    const truncRadius = truncDiameter / 2; // r1
    // We have the lower base radius, radius of the upper base (in case of a truncated cone), and cone height.
    // We need to find the length of the lateral side (or slant height),
    // the lower arc radius,
    // the radius of the upper arc (again, in case of a truncated cone),
    // and the common central angle.
    // Slant height can be found using Pythagoras:
    this.slantHeight = Math.hypot(baseRadius - truncRadius, height); // L
    // Radius of the upper arc can be found using triangles similarity. 0 for full cone
    // R_1={L*r_1} / {r_2-r_1},
    const innerRadius =
      (this.slantHeight * truncRadius) / (baseRadius - truncRadius); // R_1

    // The radius of the lower arc thus (slantH for full cone)
    // R_2=L+R_1,
    const outerRadius = this.slantHeight + innerRadius; // R_2

    // And central angle
    // phi=360*({r_2}/{R_2})
    const sectorAngle = 360 * (baseRadius / outerRadius);
    this.developed = annulusSector(sectorAngle, outerRadius, innerRadius);
    this.poi = [
      desc(this.developed.points.arcCenter, "arcCenter"),
      { x: 0, y: this.slantHeight / 2 + innerRadius, description: "center" },
      desc(this.developed.points.startOuterCurve, "startOuterCurve"),
      { x: 0, y: outerRadius, description: "centerOuterCurve" },
      desc(this.developed.points.endOuterCurve, "endOuterCurve"),
    ];
    if (truncDiameter > 0) {
      this.poi.push(
        desc(this.developed.points.startInnerCurve, "startInnerCurve"),
        { x: 0, y: innerRadius, description: "centerInnerCurve" },
        desc(this.developed.points.endInnerCurve, "endInnerCurve")
      );
    }
    this.description = `Frustum(dTop: ${this.truncDiameter}, dBottom: ${baseDiameter}, h: ${this.height} (slantHeight: ${this.slantHeight}))`;
  }
}
