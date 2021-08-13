import { Producer, Producers } from "./producers";
import dec = Producers.dec;
import fun = Producers.fun;
import inc = Producers.inc;
import randomOrder = Producers.randomOrder;
import ring = Producers.ring;
import rnd = Producers.rnd;
import upThenDown = Producers.upThenDown;
import yoyo = Producers.yoyo;

function peek<T>(count: number, producer: Producer<T>): T[] {
  const peeked: T[] = [];
  for (let i = 0; i < count; i++) {
    peeked.push(producer.next());
  }
  return peeked;
}

describe("Generates numbers and things out of known values", () => {
  it("ring", () => {
    expect(peek(10, ring([0, 1, 2]))).toEqual([0, 1, 2, 0, 1, 2, 0, 1, 2, 0]);
  });
  it("yoyo", () => {
    expect(peek(10, yoyo([0, 1, 2]))).toEqual([0, 1, 2, 1, 0, 1, 2, 1, 0, 1]);
  });
  it("up then down", () => {
    expect(peek(10, upThenDown([0, 1, 2]))).toEqual([0, 1, 2, 2, 1, 0, 0, 1, 2, 2]);
  });

  it("random order", () => {
    const firstCall = peek(30, randomOrder([0, 1, 2]));
    const secondCall = peek(30, randomOrder([0, 1, 2]));
    // we can expect two consecutive calls to generate a reasonable different order
    expect(firstCall).not.toEqual(secondCall);
    // but we can expect that 30 iterations would provide a good enough distribution to include all 3 values
    expect([...new Set(firstCall.sort())]).toEqual([0, 1, 2]);
    expect([...new Set(secondCall.sort())]).toEqual([0, 1, 2]);
  });
});

describe("Generates number values", () => {
  it("increment", () => {
    expect(peek(10, inc(3))).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });
  it("increment happily starts in negative", () => {
    expect(peek(10, inc(-3))).toEqual([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6]);
  });
  it("increment in steps", () => {
    expect(peek(10, inc(3, 2))).toEqual([3, 5, 7, 9, 11, 13, 15, 17, 19, 21]);
  });
  it("increment in steps happily starts in negative", () => {
    expect(peek(10, inc(-7, 4))).toEqual([-7, -3, 1, 5, 9, 13, 17, 21, 25, 29]);
  });
  it("increment step can be negative because why not", () => {
    expect(peek(10, inc(3, -1))).toEqual([3, 2, 1, 0, -1, -2, -3, -4, -5, -6]);
  });
  it("decrement", () => {
    expect(peek(10, dec(15))).toEqual([15, 14, 13, 12, 11, 10, 9, 8, 7, 6]);
  });
  it("decrement happily goes in negative", () => {
    expect(peek(10, dec(4))).toEqual([4, 3, 2, 1, 0, -1, -2, -3, -4, -5]);
  });
  it("random is hard to test but here goes", () => {
    const firstCall = peek(30, rnd(4));
    const secondCall = peek(30, rnd(4));
    // we can expect two consecutive calls to generate a reasonable different order
    expect(firstCall).not.toEqual(secondCall);
    // but we can expect that 30 iterations would provide a good enough distribution to include all 5 values
    expect([...new Set(firstCall.sort())]).toEqual([0, 1, 2, 3, 4]);
    expect([...new Set(secondCall.sort())]).toEqual([0, 1, 2, 3, 4]);

  });
  it("function based, e.g. +1%4", () => {
    expect(peek(10, fun(2, n => (n + 1) % 4))).toEqual([2, 3, 0, 1, 2, 3, 0, 1, 2, 3]);
  });

  // are all these simply function on a incremental sequence?
  it.todo("fibonacci");
  it.todo("sin");
  it.todo("cos");
  it.todo("other math functions");

});
