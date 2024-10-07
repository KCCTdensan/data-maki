import type { Pattern } from "./question";

/*
 * Schemas of fixed patterns.
 * Patterns has there 3 types for size of 1, 2, 4, 8, 16, 32, 64, 128, 256.
 * - Type I: All cells are 1.
 * - Type II: Even columns are 1, odd columns are 0.
 * - Type III: Even rows are 1, odd rows are 0.
 */

const generateTypeI = (p: number, size: number): Pattern => {
  const cells = Array.from({ length: size }, () => "1".repeat(size));

  return {
    p,
    width: size,
    height: size,
    cells,
  };
};

const generateTypeII = (p: number, size: number): Pattern => {
  const cells = Array.from({ length: size }, (_, i) => (i % 2 === 0 ? "1" : "0").repeat(size));

  return {
    p,
    width: size,
    height: size,
    cells,
  };
};

const generateTypeIII = (p: number, size: number): Pattern => {
  const cells = Array.from({ length: size }, () => "10".repeat(Math.ceil(size / 2)).substring(0, size));

  return {
    p,
    width: size,
    height: size,
    cells,
  };
};

const fixedPatterns: Pattern[] = [
  {
    // Size 1
    p: 0,
    width: 1,
    height: 1,
    cells: ["1"],
  },
];

for (let i = 1, j = 2; j <= 256; i += 3, j *= 2) {
  fixedPatterns.push(generateTypeI(i, j));
  fixedPatterns.push(generateTypeII(i + 1, j));
  fixedPatterns.push(generateTypeIII(i + 2, j));
}

export { fixedPatterns };
