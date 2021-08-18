import { DescribedCoord } from "../coords";
import { Rectangle } from "../shapes/rectangle";
import { DevelopedVolume } from "../volumes";

export class Cylinder implements DevelopedVolume<Rectangle> {
  readonly width;
  readonly developed: Rectangle;
  readonly poi: DescribedCoord[];
  readonly description: string;

  constructor(readonly diameter: number, readonly height: number) {
    this.width = Math.PI * this.diameter;
    this.poi = [
      { x: 0, y: 0, description: "top left corner" },
      { x: this.width, y: 0, description: "top right corner" },
      { x: 0, y: this.height, description: "bottom left corner" },
      { x: this.width, y: this.height, description: "bottom right corner" },
      { x: this.width / 2, y: this.height / 2, description: "center" },
    ];
    this.description = `Cylinder(d: ${this.diameter}, h: ${this.height})`;
    // TODO obvs
    this.developed = {pathSpec:'NOOOO', points:{}}
  }

  developOn(p: Snap.Paper) {
    return p.rect(0, 0, this.width, this.height);
  }
}
