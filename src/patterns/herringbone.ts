import { addCoords, Coords } from "../coords";
import { Patterns, zero } from "../patterns";
import { Producer } from "../producers";

export const herringbone = (initialCoords: Coords = zero(), brickWidth: number, brickLength: number) =>
  new HerringBoneBuilder(initialCoords, brickWidth, brickLength);

class HerringBoneBuilder {
  constructor(readonly initialCoords: Coords, readonly brickWidth: number, readonly brickLength: number) {
  }

  // GridBuilder and HexBuilder both have an until() type of method - extract to interface, or use
  until(
    oppositeCorner: Coords
  ): Patterns.Repetition {
    return new Patterns.BoundedRepetition(new HerringBoneProducer(this.initialCoords, oppositeCorner, this.brickWidth, this.brickLength));
  }

}

// TODO vastly copied from FuncProducer, which is why i think i began working on something like coords-gen instead
class HerringBoneProducer implements Producer<Coords | undefined> {
  private val: Coords | undefined;
  private hop = false;

  constructor(readonly initialCoords: Coords, readonly oppositeCorner: Coords,
              readonly brickWidth: number, readonly brickLength: number) {
    this.val = undefined;
  }

  next(): Coords | undefined {
    // Only call the function after the initial seed value has been used
    if (this.val === undefined) {
      this.val = this.initialCoords;
    } else {
      this.val = this.herringboneNext(this.val);
    }
    return this.val;
  }

  herringboneNext(prev: Coords | undefined): Coords | undefined {
    if (prev === undefined) {
      throw new Error("Should never be called if previous value was undefined");
    }
    const toAdd = this.hop ? { x: this.brickWidth, y: 0 } : { x: this.brickLength, y: 0 };
    const next = addCoords(prev, toAdd);
    this.hop = !this.hop;

    // the copy-plaster condition to not go over bounds
    if (next.x > this.oppositeCorner.x) {
      next.x = this.initialCoords.x;
      next.y = next.y + this.brickWidth; // TODO??
    }
    if (next.y > this.oppositeCorner.y) {
      // STOP!
      return undefined;
    }
    return next;
  };

}

