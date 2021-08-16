/**
 * An annulus sector is a cut from an annulus, which is bordered by two straight lines from its center.
 */
import { Coords } from "../coords";

export interface AnnulusSector {
  angle: number;
  innerRadius: number;
  outerRadius: number;
  pathSpec: string;
  points: {
    arcCenter: Coords;
    startInnerCurve: Coords;
    endInnerCurve: Coords;
    startOuterCurve: Coords;
    endOuterCurve: Coords;
  };
}

// Based on https://gist.github.com/leefsmp/f721678ee443f1031a74#file-snap-arc-demo-html ...
export const annulusSector = (
  angle: number,
  outerRadius: number,
  innerRadius = 0
): AnnulusSector => {
  const arcCenter = { x: 0, y: 0 };
  const startDeg = 90 - angle / 2;
  const startOuterCurve = {
    x: arcCenter.x + outerRadius * Math.cos((Math.PI * startDeg) / 180),
    y: arcCenter.y + outerRadius * Math.sin((Math.PI * startDeg) / 180),
  };

  const endOuterCurve = {
    x:
      arcCenter.x +
      outerRadius * Math.cos((Math.PI * (startDeg + angle)) / 180),
    y:
      arcCenter.y +
      outerRadius * Math.sin((Math.PI * (startDeg + angle)) / 180),
  };

  const startInnerCurve = {
    x:
      arcCenter.x +
      innerRadius * Math.cos((Math.PI * (startDeg + angle)) / 180),
    y:
      arcCenter.y +
      innerRadius * Math.sin((Math.PI * (startDeg + angle)) / 180),
  };

  const endInnerCurve = {
    x: arcCenter.x + innerRadius * Math.cos((Math.PI * startDeg) / 180),
    y: arcCenter.y + innerRadius * Math.sin((Math.PI * startDeg) / 180),
  };

  const largeArc = angle > 180 ? 1 : 0;

  return {
    angle,
    innerRadius,
    outerRadius,
    // Can't say i have any clue what's happening here below
    pathSpec: `M${startOuterCurve.x},${startOuterCurve.y} A${outerRadius},${outerRadius} 0 ${largeArc},1 ${endOuterCurve.x},${endOuterCurve.y} L${startInnerCurve.x},${startInnerCurve.y} A${innerRadius},${innerRadius} 0 ${largeArc},0 ${endInnerCurve.x},${endInnerCurve.y} L${startOuterCurve.x},${startOuterCurve.y} Z`,
    points: {
      arcCenter,
      startOuterCurve,
      endOuterCurve,
      startInnerCurve,
      endInnerCurve,
    },
  };
};
