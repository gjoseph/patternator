export const angleControl = {
  control: { type: "range", min: 0, max: 360, step: 1 },
};

/**
 * If end isn't specified, assume start is 0 and end is the 1st param
 */
export const rangeControl = (min: number, max?: number, step = 1) => {
  if (max === undefined) [max, min] = [min, 0];
  return {
    control: { type: "range", min, max, step },
  };
};
