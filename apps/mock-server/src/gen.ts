import type { Problem } from "@data-maki/schemas";
import type { FixedLengthArray } from "type-fest";
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
}): [id: number, problem: Problem] => {
  console.time("Problem generation successful");

  const width: number = generateSettings.widthRandom ? getRandomInt(32, 257) : generateSettings.width;
  const height: number = generateSettings.widthRandom ? getRandomInt(32, 257) : generateSettings.height;

  const numbers: number[] = Array(width * height).fill(0);

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

  // 初期盤面の生成
  const start: string[] = getBoardArrayFromNumbers(numbers, width);
  const goal: string[] = getBoardArrayFromNumbers(numbers.toSorted() /* 目標盤面の生成 */, width);

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
