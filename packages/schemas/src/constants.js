"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixedPatterns = void 0;
/*
 * Schemas of fixed patterns.
 * Patterns has there 3 types for size of 1, 2, 4, 8, 16, 32, 64, 128, 256.
 * - Type I: All cells are 1.
 * - Type II: Even columns are 1, odd columns are 0.
 * - Type III: Even rows are 1, odd rows are 0.
 */
var generateTypeI = function (p, size) {
  var cells = Array.from({ length: size }, function () {
    return "1".repeat(size);
  });
  return {
    p: size,
    width: size,
    height: size,
    cells: cells,
  };
};
var generateTypeII = function (p, size) {
  var cells = Array.from({ length: size }, function (_, i) {
    return (i % 2 === 0 ? "1" : "0").repeat(size);
  });
  return {
    p: size,
    width: size,
    height: size,
    cells: cells,
  };
};
var generateTypeIII = function (p, size) {
  var cells = Array.from({ length: size }, function () {
    return "01".repeat(Math.ceil(size / 2)).substring(0, size);
  });
  return {
    p: size,
    width: size,
    height: size,
    cells: cells,
  };
};
var fixedPatterns = [
  {
    // Size 1
    p: 0,
    width: 1,
    height: 1,
    cells: ["1"],
  },
];
exports.fixedPatterns = fixedPatterns;
for (var i = 1; i <= 8; i++) {
  fixedPatterns.push(generateTypeI(i, Math.pow(2, i)));
  fixedPatterns.push(generateTypeII(i, Math.pow(2, i)));
  fixedPatterns.push(generateTypeIII(i, Math.pow(2, i)));
}
