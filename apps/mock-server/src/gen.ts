import type { Problem } from "@data-maki/schemas";
import type { FixedLengthArray } from "type-fest";
import { shuffle } from "./utils/array";
import { getRandomInt } from "./utils/number";

type GenerationKindStart = "all-random" | "gen-random" | "column-seq" | "column-seq-reverse" | "column-group-shuffle";

const generationKindStarts: GenerationKindStart[] = [
  "all-random",
  "gen-random",
  "column-seq",
  "column-seq-reverse",
  "column-group-shuffle",
] as const;

type GenerationKindGoal =
  | "all-random"
  | "sort-asc"
  | "sort-desc"
  | "shuffle"
  | "column-seq"
  | "column-seq-reverse"
  | "partial-single-swap"
  | "partial-block-swap";

const generationKindGoals: GenerationKindGoal[] = [
  "all-random",
  "sort-asc",
  "sort-desc",
  "shuffle",
  "column-seq",
  "column-seq-reverse",
  "partial-single-swap",
  "partial-block-swap",
] as const;

export type GenerationSettings = {
  widthRandom: boolean;
  heightRandom: boolean;
  width: number;
  height: number;
  genKindStart: GenerationKindStart;
  genKindGoal: GenerationKindGoal;
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
      ? generationKindStarts[getRandomInt(1, 4)]
      : generationSettings.genKindStart;
  const genKindGoal =
    generationSettings.genKindGoal === "all-random"
      ? generationKindGoals[getRandomInt(1, 7)]
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
