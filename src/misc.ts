// What a great file name... just not sure where to put this for now.
export type AngleInDegrees = number; // https://github.com/Microsoft/TypeScript/issues/15480 https://github.com/microsoft/TypeScript/issues/43505

export const radToDeg = (r: number) => (r * 180) / Math.PI;
export const sq = (n: number) => Math.pow(n, 2);

/**
 * Working around the floating math rounding problems... maybe.
 * https://www.jacklmoore.com/notes/rounding-in-javascript/ didn't work with already complex numbers
 * .toFixed(2) would return a string
 */
export const round = (value: number, decimals = 2) => {
  // return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
  const base = Math.pow(10, decimals);
  return Number(Math.round(Number(value * base)) / base);
};

/**
 * Returns a random integer between 0 and `max` (exclusive).
 */
export const randomNumber = (max: number) => Math.floor(Math.random() * max);

/**
 * If end isn't specified, assume start is 0 and end is the 1st param
 */
export const range = function* (start: number, end?: number, step = 1) {
  if (end === undefined) [end, start] = [start, 0];
  for (let n = start; n < end; n += step) yield n;
};
