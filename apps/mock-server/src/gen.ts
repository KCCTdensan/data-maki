import type { Problem } from "@data-maki/schemas";
import type { FixedLengthArray } from "type-fest";
import { shuffle } from "./utils/array";
import { getRandomInt } from "./utils/number";

export const getBoardArrayFromNumbers = (numbers: number[], width: number): string[] => {
  return [...Array(numbers.length / width).keys()].map((i) =>
    numbers
      .slice(i * width, (i + 1) * width)
      .map(String)
      .join(""),
  );
};

let id = 0;

export const generateProblem = (generateSettings: {
  widthRandom: boolean;
  heightRandom: boolean;
  width: number;
  height: number;
  genKindStart: number;
  genKindGoal: number;
}): [id: number, problem: Problem] => {
  console.time("Problem generation successful");

  const width: number = generateSettings.widthRandom ? getRandomInt(32, 257) : generateSettings.width;
  const height: number = generateSettings.widthRandom ? getRandomInt(32, 257) : generateSettings.height;

  const genKindStart: number = generateSettings.genKindStart === 0 ? getRandomInt(1, 4) : generateSettings.genKindStart;
  const genKindGoal: number = generateSettings.genKindGoal === 0 ? getRandomInt(1, 7) : generateSettings.genKindGoal;

  const numbers: number[] = Array(width * height).fill(0);

  switch (genKindStart) {
    case 1: {
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
    case 2:
      // 0,1,2,3,0,1,2,3……
      for (let i = 0; i < width * height; i++) {
        numbers[i] = i % 4;
      }
      break;
    case 3:
      // 3,2,1,0,3,2,1,0……
      for (let i = 0; i < width * height; i++) {
        numbers[i] = 3 - (i % 4);
      }
      break;
    case 4:
      // random swap 0,0,0……,1,1,1……,2,2,2……,3,3,3……
      for (let i = 0; i < width * height; i++) {
        numbers[i] = Math.floor(i / ((width * height) / 4));
      }
      for (let i = 0; i < width * height * 0.4; ++i) {
        const idx1: number = getRandomInt(0, width * height);
        const idx2: number = getRandomInt(0, width * height);
        [numbers[idx1], numbers[idx2]] = [numbers[idx2] as number, numbers[idx1] as number];
      }
  }

  // 初期盤面の生成
  const start: string[] = getBoardArrayFromNumbers(numbers, width);
  let goal: string[];
  let sortedNumbers: number[];
  let tmpNumbers: number[][] = [];
  let goalNumbers: number[];
  switch (genKindGoal) {
    case 1:
      goal = getBoardArrayFromNumbers(numbers.toSorted(), width);
      break;
    case 2:
      // reverse
      goal = getBoardArrayFromNumbers(numbers.toSorted().reverse(), width);
      break;
    case 3:
      // random
      goal = getBoardArrayFromNumbers(shuffle(numbers), width);
      break;
    case 4:
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
    case 5:
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
    case 6:
      //random swap(40%)
      goalNumbers = numbers;
      for (let i = 0; i < width * height * 0.4; ++i) {
        const idx1: number = getRandomInt(0, width * height);
        const idx2: number = getRandomInt(0, width * height);
        [goalNumbers[idx1], goalNumbers[idx2]] = [goalNumbers[idx2] as number, goalNumbers[idx1] as number];
      }
      goal = getBoardArrayFromNumbers(goalNumbers, width);
      break;
    case 7:
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
      goal = getBoardArrayFromNumbers(numbers.toSorted(), width);
      break;
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
