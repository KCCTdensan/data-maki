import type { Question } from "@data-maki/schemas";
import * as Comlink from "comlink";
import { solve as solveFunc } from "../v1";

declare const self: Worker;

export const solve = (question: Question) => solveFunc(self, question);

Comlink.expose({ solve });
