import { Producer, Producers } from "./producers";
import dec = Producers.dec;
import fun = Producers.fun;
import inc = Producers.inc;
import randomOrder = Producers.randomOrder;
import ring = Producers.ring;
import rnd = Producers.rnd;
import upThenDown = Producers.upThenDown;
import yoyo = Producers.yoyo;

function produceTimes<T>(count: number, producer: Producer<T>): T[] {
  const peeked: T[] = [];
  for (let i = 0; i < count; i++) {
    peeked.push(producer.next());
  }
  return peeked;
}

function distinctSortedFrom(firstCall: number[]) {
  return [...new Set(firstCall.sort())];
}

describe("Generates numbers and things out of known values", () => {
  it("ring", () => {
    const expected = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0];
    expect(produceTimes(10, ring([0, 1, 2]))).toEqual(expected);
  });
  it("yoyo", () => {
    const expected = [0, 1, 2, 1, 0, 1, 2, 1, 0, 1];
    expect(produceTimes(10, yoyo([0, 1, 2]))).toEqual(expected);
  });
  it("up then down", () => {
    const expected = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2];
    expect(produceTimes(10, upThenDown([0, 1, 2]))).toEqual(expected);
  });

  it("random order", () => {
    const firstCall = produceTimes(30, randomOrder([0, 1, 2]));
    const secondCall = produceTimes(30, randomOrder([0, 1, 2]));
    // we can expect two consecutive calls to generate a reasonable different order
    expect(firstCall).not.toEqual(secondCall);
    // but we can expect that 30 iterations would provide a good enough distribution to include all 3 values
    expect(distinctSortedFrom(firstCall)).toEqual([0, 1, 2]);
    expect(distinctSortedFrom(secondCall)).toEqual([0, 1, 2]);
  });
});

describe("Generates number values", () => {
  it("increment", () => {
    const expected = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    expect(produceTimes(10, inc(3))).toEqual(expected);
  });
  it("increment happily starts in negative", () => {
    const expected = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
    expect(produceTimes(10, inc(-3))).toEqual(expected);
  });
  it("increment in steps", () => {
    const expected = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
    expect(produceTimes(10, inc(3, 2))).toEqual(expected);
  });
  it("increment in steps happily starts in negative", () => {
    const expected = [-7, -3, 1, 5, 9, 13, 17, 21, 25, 29];
    expect(produceTimes(10, inc(-7, 4))).toEqual(expected);
  });
  it("increment step can be negative because why not", () => {
    const expected = [3, 2, 1, 0, -1, -2, -3, -4, -5, -6];
    expect(produceTimes(10, inc(3, -1))).toEqual(expected);
  });
  it("decrement", () => {
    const expected = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6];
    expect(produceTimes(10, dec(15))).toEqual(expected);
  });
  it("decrement happily goes in negative", () => {
    const expected = [4, 3, 2, 1, 0, -1, -2, -3, -4, -5];
    expect(produceTimes(10, dec(4))).toEqual(expected);
  });
  it("random is hard to test but here goes", () => {
    const firstCall = produceTimes(30, rnd(4));
    const secondCall = produceTimes(30, rnd(4));
    // we can expect two consecutive calls to generate a reasonable different order
    expect(firstCall).not.toEqual(secondCall);
    // but we can expect that 30 iterations would provide a good enough distribution to include all 5 values
    expect(distinctSortedFrom(firstCall)).toEqual([0, 1, 2, 3, 4]);
    expect(distinctSortedFrom(secondCall)).toEqual([0, 1, 2, 3, 4]);
  });
  it("function based, e.g. +1%4", () => {
    expect(
      produceTimes(
        10,
        fun(2, (n) => (n + 1) % 4)
      )
    ).toEqual([2, 3, 0, 1, 2, 3, 0, 1, 2, 3]);
  });

  // are all these simply function on a incremental sequence?
  it.todo("fibonacci");
  it.todo("sin");
  it.todo("cos");
  it.todo("other math functions");
});
