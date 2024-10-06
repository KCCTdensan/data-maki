import type { Question } from "@data-maki/schemas";
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

export const generateProblem = (): Question => {
  console.time("Problem generation successful");

  const width = getRandomInt(32, 257);
  const height = getRandomInt(32, 257);

  const numbers: number[] = Array(width * height).fill(0);

  let flg = true;

  while (flg) {
    const counts: FixedLengthArray<number, 4> = [0, 0, 0, 0];

    for (let i = 0; i < width * height; i++) {
      const num = getRandomInt(0, 5);

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

  const problem: Question = {
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

  return problem;
};
