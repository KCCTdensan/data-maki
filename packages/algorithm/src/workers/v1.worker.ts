import type { Question } from "@data-maki/schemas";
import { solve } from "../v1";

declare const self: Worker;

self.onmessage = (e) => {
  const [newQuestion] = e.data;

  question = newQuestion;
};

let question: Question | null = null;

while (!question) {
  // wait for question
  await new Promise((resolve) => setTimeout(resolve, 100));
}

const answer = solve(question, (finalBoard) => {
  self.postMessage({
    type: "finish",
    finalBoard,
  });
});

self.postMessage({
  type: "answer",
  answer,
});
