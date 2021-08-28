// What a great file name... just not sure where to put this for now.
export type AngleInDegrees = number; // https://github.com/Microsoft/TypeScript/issues/15480 https://github.com/microsoft/TypeScript/issues/43505

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
