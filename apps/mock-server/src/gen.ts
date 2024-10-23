import type { Problem } from "@data-maki/schemas";
import type { FixedLengthArray } from "type-fest";
import { shuffle } from "./utils/array";
import { getRandomInt } from "./utils/number";

type GenerationKindStart =
  | "all-random"
  | "gen-random"
  | "column-seq"
  | "column-seq-reverse"
  | "column-group-shuffle"
  | "random-rectangle-area"
  | "random-eclipse-area";

const generationKindStarts: GenerationKindStart[] = [
  "all-random",
  "gen-random",
  "column-seq",
  "column-seq-reverse",
  "column-group-shuffle",
  "random-rectangle-area",
  "random-eclipse-area",
] as const;

type GenerationKindGoal =
  | "all-random"
  | "sort-asc"
  | "sort-desc"
  | "shuffle"
  | "column-seq"
  | "column-seq-reverse"
  | "partial-single-swap"
  | "partial-block-swap"
  | "random-area-reverse"
  | "block-swap";

const generationKindGoals: GenerationKindGoal[] = [
  "all-random",
  "sort-asc",
  "sort-desc",
  "shuffle",
  "column-seq",
  "column-seq-reverse",
  "partial-single-swap",
  "partial-block-swap",
  "random-area-reverse",
  "block-swap",
] as const;

export type GenerationSettings = {
  widthRandom: boolean;
  heightRandom: boolean;
  width: number;
  height: number;
  genKindStart: GenerationKindStart;
  genKindGoal: GenerationKindGoal;
  waitDuration?: number;
};

export const getBoardArrayFromNumbers = (numbers: number[], width: number): string[] => {
  return [...Array(numbers.length / width).keys()].map((i) =>
    numbers
      .slice(i * width, (i + 1) * width)
      .map(String)
      .join(""),
  );
};

let id = 0;

export const generateProblem = (generationSettings: GenerationSettings): [id: number, problem: Problem] => {
  console.time("Problem generation successful");

  const width = generationSettings.widthRandom ? getRandomInt(32, 257) : generationSettings.width;
  const height = generationSettings.widthRandom ? getRandomInt(32, 257) : generationSettings.height;

  const genKindStart =
    generationSettings.genKindStart === "all-random"
      ? generationKindStarts[getRandomInt(1, 9)]
      : generationSettings.genKindStart;
  const genKindGoal =
    generationSettings.genKindGoal === "all-random"
      ? generationKindGoals[getRandomInt(1, 8)]
      : generationSettings.genKindGoal;

  const numbers: number[] = Array(width * height).fill(0);

  switch (genKindStart) {
    case "gen-random": {
      // ランダム
      let flg = true;

      while (flg) {
        const counts: FixedLengthArray<number, 4> = [0, 0, 0, 0];

        for (let i = 0; i < width * height; i++) {
          const num = getRandomInt(0, 4);

          numbers[i] = num;
          counts[num]++;
        }

        flg = false;

        for (const count of counts) {
          flg = count / (width * height) < 0.1;
        }
      }
      break;
    }
    case "column-seq":
      // 0,1,2,3,0,1,2,3……
      for (let i = 0; i < width * height; i++) {
        numbers[i] = i % 4;
      }
      break;
    case "column-seq-reverse":
      // 3,2,1,0,3,2,1,0……
      for (let i = 0; i < width * height; i++) {
        numbers[i] = 3 - (i % 4);
      }
      break;
    case "column-group-shuffle":
      // random swap 0,0,0……,1,1,1……,2,2,2……,3,3,3……
      for (let i = 0; i < width * height; i++) {
        numbers[i] = Math.floor(i / ((width * height) / 4));
      }
      for (let i = 0; i < width * height * 0.4; ++i) {
        const idx1: number = getRandomInt(0, width * height);
        const idx2: number = getRandomInt(0, width * height);
        [numbers[idx1], numbers[idx2]] = [numbers[idx2] as number, numbers[idx1] as number];
      }
      break;
    case "random-rectangle-area": {
      const areaCnt: number = getRandomInt(30, 40);
      for (let i = 0; i < areaCnt; i++) {
        let x1: number = getRandomInt(-width / (i + 1), width);
        x1 = x1 < 0 ? 0 : x1;
        let x2: number = getRandomInt(x1, width + width / (i + 1));
        x2 = width < x2 ? width - 1 : x2;
        let y1: number = getRandomInt(-height / (i + 1), height);
        y1 = y1 < 0 ? 0 : y1;
        let y2: number = getRandomInt(y1, height + height / (i + 1));
        y2 = height < y2 ? height - 1 : y2;
        const num: number = getRandomInt(0, 4);
        for (let y = y1; y < y2; ++y) {
          for (let x = x1; x < x2; ++x) {
            numbers[y * width + x] = num;
          }
        }
      }
      break;
    }
    case "random-eclipse-area": {
      const areaCnt: number = getRandomInt(30, 50);
      for (let i = 0; i < areaCnt; i++) {
        let x1: number = getRandomInt(-width / (i + 1), width);
        x1 = x1 < 0 ? 0 : x1;
        let x2: number = getRandomInt(x1, width + width / (i + 1));
        x2 = width < x2 ? width - 1 : x2;
        let y1: number = getRandomInt(-height / (i + 1), height);
        y1 = y1 < 0 ? 0 : y1;
        let y2: number = getRandomInt(y1, height + height / (i + 1));
        y2 = height < y2 ? height - 1 : y2;
        const num: number = getRandomInt(0, 4);
        for (let y = y1; y < y2; ++y) {
          for (let x = x1; x < x2; ++x) {
            if (
              (x - (x1 + x2) / 2) ** 2 / ((x1 - x2) / 2) ** 2 + (y - (y1 + y2) / 2) ** 2 / ((y1 - y2) / 2) ** 2 <=
              1
            ) {
              numbers[y * width + x] = num;
            }
          }
        }
      }
      break;
    }
    default:
      throw new Error("Invalid generation kind");
  }

  // 初期盤面の生成
  const start: string[] = getBoardArrayFromNumbers(numbers, width);
  let goal: string[];
  let sortedNumbers: number[];
  let tmpNumbers: number[][] = [];
  let goalNumbers: number[];
  switch (genKindGoal) {
    case "sort-asc":
      goal = getBoardArrayFromNumbers(numbers.toSorted(), width);
      break;
    case "sort-desc":
      // reverse
      goal = getBoardArrayFromNumbers(numbers.toSorted().reverse(), width);
      break;
    case "shuffle":
      // random
      goal = getBoardArrayFromNumbers(shuffle(numbers), width);
      break;
    case "column-seq":
      // 0,1,2,3,0,1,2,3……
      sortedNumbers = numbers.toSorted();
      for (let i = 0; i < 4; ++i) {
        tmpNumbers.push(sortedNumbers.filter((num) => num === i));
      }
      goalNumbers = [];
      for (let i = 0; i < width * height; ++i) {
        for (let j = 0; j < 4; ++j) {
          if ((tmpNumbers[j] as number[]).length > 0) {
            goalNumbers.push((tmpNumbers[j] as number[]).shift() as number);
          }
        }
      }
      goal = getBoardArrayFromNumbers(goalNumbers, width);
      break;
    case "column-seq-reverse":
      // 3,2,1,0,3,2,1,0……
      sortedNumbers = numbers.toSorted();
      tmpNumbers = [];
      for (let i = 0; i < 4; ++i) {
        tmpNumbers.push(sortedNumbers.filter((num) => num === i));
      }
      goalNumbers = [];
      for (let i = 0; i < width * height; ++i) {
        for (let j = 3; 0 <= j; --j) {
          if ((tmpNumbers[j] as number[]).length > 0) {
            goalNumbers.push((tmpNumbers[j] as number[]).shift() as number);
          }
        }
      }
      goal = getBoardArrayFromNumbers(goalNumbers, width);
      break;
    case "partial-single-swap":
      //random swap(40%)
      goalNumbers = numbers;
      for (let i = 0; i < width * height * 0.4; ++i) {
        const idx1: number = getRandomInt(0, width * height);
        const idx2: number = getRandomInt(0, width * height);
        [goalNumbers[idx1], goalNumbers[idx2]] = [goalNumbers[idx2] as number, goalNumbers[idx1] as number];
      }
      goal = getBoardArrayFromNumbers(goalNumbers, width);
      break;
    case "partial-block-swap":
      // block shuffle(1*8)
      goalNumbers = numbers;
      for (let i = 0; i < width * height * 0.4; ++i) {
        const idx1: number = getRandomInt(0, width * height - 8);
        const idx2: number = getRandomInt(0, width * height - 8);
        for (let j = 0; j < 8; ++j) {
          [goalNumbers[idx1 + j], goalNumbers[idx2 + j]] = [
            goalNumbers[idx2 + j] as number,
            goalNumbers[idx1 + j] as number,
          ];
        }
      }
      goal = getBoardArrayFromNumbers(goalNumbers, width);
      break;
    case "random-area-reverse": {
      // random area reverse(30-50)
      goalNumbers = numbers;
      const areaCnt: number = getRandomInt(30, 50);
      for (let i = 0; i < areaCnt; ++i) {
        let x1: number = getRandomInt(-width / (i + 1), width);
        x1 = x1 < 0 ? 0 : x1;
        let x2: number = getRandomInt(x1, width + width / (i + 1));
        x2 = width < x2 ? width - 1 : x2;
        let y1: number = getRandomInt(-height / (i + 1), height);
        y1 = y1 < 0 ? 0 : y1;
        let y2: number = getRandomInt(y1, height + height / (i + 1));
        y2 = height < y2 ? height - 1 : y2;

        if (getRandomInt(0, 2)) {
          /*
          0 1 2 3
          4 5 6 7
             |
             V
          3 2 1 0
          7 6 5 4
          */
          for (let y = y1; y < y2; ++y) {
            for (let j = 0; j < (x2 - x1 + 1) / 2; ++j) {
              const leftIndex = y * width + x1 + j;
              const rightIndex = y * width + x2 - j;

              if (
                leftIndex >= 0 &&
                leftIndex < goalNumbers.length &&
                rightIndex >= 0 &&
                rightIndex < goalNumbers.length
              ) {
                [goalNumbers[leftIndex], goalNumbers[rightIndex]] = [
                  goalNumbers[rightIndex] as number,
                  goalNumbers[leftIndex] as number,
                ];
              }
            }
          }
        }
        if (getRandomInt(0, 2)) {
          /*
          0 1 2 3
          4 5 6 7
             |
             V
          4 5 6 7
          0 1 2 3
          */
          for (let x = x1; x < x2; ++x) {
            for (let j = 0; j < (y2 - y1 + 1) / 2; ++j) {
              const topIndex = (y1 + j) * width + x;
              const bottomIndex = (y2 - j) * width + x;

              if (
                topIndex >= 0 &&
                topIndex < goalNumbers.length &&
                bottomIndex >= 0 &&
                bottomIndex < goalNumbers.length
              ) {
                [goalNumbers[topIndex], goalNumbers[bottomIndex]] = [
                  goalNumbers[bottomIndex] as number,
                  goalNumbers[topIndex] as number,
                ];
              }
            }
          }
        }
      }
      goal = getBoardArrayFromNumbers(goalNumbers, width);
      break;
    }
    case "block-swap": {
      goalNumbers = numbers;
      const blockCnt: number = getRandomInt(30, 50);
      for (let i = 0; i < blockCnt; ++i) {
        let x1: number = getRandomInt(-width / (i + 1), width - 8);
        x1 = x1 < 0 ? 0 : x1;
        let x2: number = getRandomInt(x1, x1 + 8);
        x2 = width < x2 ? width - 1 : x2;
        let y1: number = getRandomInt(-height / (i + 1), height - 8);
        y1 = y1 < 0 ? 0 : y1;
        let y2: number = getRandomInt(y1, y1 + 8);
        y2 = height < y2 ? height - 1 : y2;

        let x3: number = getRandomInt(-width / (i + 1), width - (x2 - x1));
        x3 = x3 < 0 ? 0 : x3;
        let y3: number = getRandomInt(-height / (i + 1), height - (y2 - y1));
        y3 = y3 < 0 ? 0 : y3;

        for (let j = 0; j < x2 - x1; ++j) {
          for (let k = 0; k < y2 - y1; ++k) {
            [goalNumbers[(y1 + k) * width + x1 + j], goalNumbers[(y3 + k) * width + x3 + j]] = [
              goalNumbers[(y3 + k) * width + x3 + j] as number,
              goalNumbers[(y1 + k) * width + x1 + j] as number,
            ];
          }
        }
      }
      goal = getBoardArrayFromNumbers(goalNumbers, width);
      break;
    }
    default:
      throw new Error("Invalid generation kind");
  }
  // const goal: string[] = getBoardArrayFromNumbers(numbers.toSorted() /* 目標盤面の生成 */, width);

  const problem: Problem = {
    board: {
      width: width as number,
      height: height as number,
      start,
      goal,
    },
    general: {
      n: 0,
      patterns: [],
    },
  };

  console.timeEnd("Problem generation successful");

  return [id++, problem];
};
