import type { IntRange } from "type-fest";

export const getRandomInt = <TMin extends number, TMax extends number>(min: TMin, max: TMax): IntRange<TMin, TMax> =>
  Math.floor(Math.random() * (max - min) + min) as unknown as IntRange<TMin, TMax>; // min <= n < max
