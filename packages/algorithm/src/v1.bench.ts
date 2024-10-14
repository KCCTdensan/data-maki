import { bench, describe } from "vitest";

describe("benchmark v1 algorithm", () => {
  const bigArray = Array.from({ length: 10000 }, () => Math.floor(Math.random() * 4));

  bench("splice delete", () => {
    bigArray.splice(5000, 1);
  });

  bench("swap delete (unordered)", () => {
    bigArray[5000] = bigArray[9999];
    bigArray.pop();
  });

  bench("shift delete (ordered)", () => {
    let index = 5000;
    const stop = bigArray.length - 1;

    while (index < stop) {
      bigArray[index] = bigArray[++index];
    }

    bigArray.pop();
  });
});
