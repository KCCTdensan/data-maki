import type { Problem } from "@data-maki/schemas";
import * as Comlink from "comlink";
import { solve as solveFunc } from "../v1";

declare const self: Worker;

export const solve = (problem: Problem) => solveFunc(self, problem);

Comlink.expose({ solve });
